from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, BackgroundTasks,Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app import models, schemas, crud, auth,utils
from app.utils import get_db
from services import asr_service, translate_service, tts_service, billing
from app.tasks import process_pipeline_task
import shutil, os
import random, string, redis
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from app.config import settings
from pydantic import BaseModel, EmailStr

router = APIRouter()
# SaaS试用配额配置
FREE_TRIAL_QUOTA = 5
REGISTERED_QUOTA = 50

# ======== 新增：邮箱验证码注册能力（SaaS级） ========
r = redis.StrictRedis.from_url(settings.CELERY_BROKER_URL, decode_responses=True)

def random_code(n=6):
    return ''.join(random.choices(string.digits, k=n))

class VerifyCodeRequest(BaseModel):
    email: EmailStr

@router.post("/send-verify-code")
async def send_verify_code(req: VerifyCodeRequest, background_tasks: BackgroundTasks):
    code = ''.join(random.choices(string.digits, k=6))
    # 假设存在全局redis/数据库用于保存验证码
    crud.save_verify_code(req.email, code)
    # 邮件发送
    conf = ConnectionConfig(
        MAIL_USERNAME=settings.MAIL_USERNAME,
        MAIL_PASSWORD=settings.MAIL_PASSWORD,
        MAIL_FROM=settings.MAIL_FROM,
        MAIL_PORT=settings.MAIL_PORT,
        MAIL_SERVER=settings.MAIL_SERVER,
        MAIL_TLS=True,
        MAIL_SSL=False,
        USE_CREDENTIALS=True,
    )
    message = MessageSchema(
        subject="您的验证码",
        recipients=[req.email],
        body=f"您的验证码是：{code}，5分钟内有效。如非本人操作请忽略。",
        subtype="plain",
    )
    fm = FastMail(conf)
    background_tasks.add_task(fm.send_message, message)
    return {"success": True, "message": "验证码发送成功"}

# 邮箱验证码发送
# 邮箱验证码发送
@router.post("/send_code")
def send_code(req: schemas.SendCodeRequest):
    code = "".join(random.choices(string.digits, k=6))
    utils.save_email_code(req.email, code)
    utils.send_verify_email(req.email, code)
    return {"msg": "验证码已发送"}

# 注册接口，带邮箱和验证码校验
@router.post("/register", response_model=schemas.UserRead)
def register(user: schemas.UserCreate, code: str, db: Session = Depends(utils.get_db)):
    # 校验验证码
    real_code = utils.get_email_code(user.email)
    if not real_code or real_code != code:
        raise HTTPException(status_code=400, detail="验证码错误或已过期")
    db_user = crud.get_user_by_email(db, user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="邮箱已注册")
    return crud.create_user_with_email(db, user)

# 登录接口
@router.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(utils.get_db)):
    db_user = crud.get_user_by_email(db, user.username)
    if not db_user or not crud.verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="用户名或密码错误")
    # ...生成token，返回

# 试用配额查询（假设未登录可匿名查剩余额度）
@router.get("/quota")
def get_quota(request: Request):
    # 可根据 session/cookie 或 ip 限流
    # 示例返回
    return {"quota_remain": 3, "quota_total": 3}

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
