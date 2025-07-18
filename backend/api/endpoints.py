from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, BackgroundTasks, Request,Response
from sqlalchemy.orm import Session
from app import models, schemas, crud, auth
from app.crud import send_verify_email
from app.utils import get_db
from services import asr_service, translate_service, tts_service, billing
from app.tasks import process_pipeline_task
from pydantic import BaseModel, EmailStr
import os, shutil, random, string
from app.config import settings
from captcha.image import ImageCaptcha

router = APIRouter(prefix="/user")
# SaaS试用配额配置
REGISTERED_QUOTA = 50

def random_code(n=6):
    return ''.join(random.choices(string.digits, k=n))

class VerifyCodeRequest(BaseModel):
    email: EmailStr

#邮箱验证码发送
@router.post("/send-verify-code")
async def send_verify_code(req: VerifyCodeRequest, background_tasks: BackgroundTasks):
    code = random_code(6)
    crud.set_email_verify_code(req.email, code, expire=300)
    background_tasks.add_task(send_verify_email, req.email, code)
    return {"success": True, "message": "验证码发送成功"}

# 注册接口，带邮箱和验证码校验
@router.post("/register", response_model=schemas.UserRead)
def register(user: schemas.UserCreate, code: str, db: Session = Depends(get_db)):
    # 校验验证码
    real_code = crud.get_email_verify_code(user.email)
    if not real_code or real_code != code:
        raise HTTPException(status_code=400, detail="验证码错误或已过期")
    db_user = crud.get_user_by_email(db, user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="邮箱已注册")
    return crud.create_user_with_email(db, user)

# 登录接口
@router.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, user.username)
    if not db_user or not crud.verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="用户名或密码错误")
    # 返回token略
    return {"token": "TODO_GENERATE_TOKEN"}

# 试用配额查询（假设未登录可匿名查剩余额度）
# 获取试用配额
@router.get("/quota")
def get_quota(request: Request):
    ip = request.client.host
    quota = crud.get_trial_quota(ip)
    return {"quota_remain": quota, "quota_total": settings.FREE_TRIAL_QUOTA}
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

@router.get("/captcha_img")
async def get_captcha_img():
    chars = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
    img = ImageCaptcha(width=160, height=60)
    img_data = img.generate(chars).getvalue()
    crud.set_captcha_img(f"captcha:{chars.lower()}", chars, ex=120)
    return Response(content=img_data, media_type="image/png")