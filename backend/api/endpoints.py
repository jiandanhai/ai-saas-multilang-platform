from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app import models, schemas, crud, auth
from app.utils import get_db
from services import asr_service, translate_service, tts_service, billing
from app.tasks import process_pipeline_task
import shutil, os

router = APIRouter()

# -------- 用户注册/登录（带密码hash+JWT） --------
@router.post("/register", response_model=schemas.UserRead)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    if crud.get_user_by_username(db, user.username):
        raise HTTPException(status_code=400, detail="Username already registered")
    hashed_pw = auth.get_password_hash(user.password)
    return crud.create_user(db, user.username, hashed_pw)

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.get_user_by_username(db, form_data.username)
    if not user or not auth.verify_password(form_data.password, user.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    token = auth.create_access_token(data={"sub": user.username})
    return {"access_token": token, "token_type": "bearer"}

# -------- 文件上传并触发AI流水线 --------
@router.post("/upload")
def upload_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    os.makedirs("uploads", exist_ok=True)
    file_path = os.path.join("uploads", file.filename)
    with open(file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)
    # 建立任务（绑定用户）
    task_id = crud.create_task(db, file_path=file_path, user_id=current_user.id)
    process_pipeline_task.delay(task_id)
    return {"task_id": task_id}

# -------- 查询任务状态 --------
@router.get("/task/{task_id}", response_model=schemas.TaskRead)
def get_task(task_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    task = crud.get_task(db, task_id)
    if not task or task.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

# -------- 用户任务列表 --------
@router.get("/my_tasks", response_model=list[schemas.TaskRead])
def my_tasks(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return db.query(models.Task).filter(models.Task.user_id == current_user.id).all()

# -------- 计费与扣费查询 --------
@router.get("/billing/{task_id}")
def billing_info(task_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    task = crud.get_task(db, task_id)
    if not task or task.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Task not found")
    cost = billing.calculate_cost(task)
    return {"task_id": task_id, "cost": cost}