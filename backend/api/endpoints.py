import response
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, BackgroundTasks, Request,Response
from sqlalchemy.orm import Session
from app import models, schemas, crud, auth
from app.crud import send_verify_email, get_tasks
from services import asr_service, translate_service, tts_service, billing
from app.tasks import process_pipeline_task
from pydantic import BaseModel, EmailStr
import os, shutil, random, string
from app.config import settings
from captcha.image import ImageCaptcha
from fastapi.responses import JSONResponse
from jose import JWTError, jwt
from typing import Optional
from app import crud, models, schemas
import uuid
from starlette.responses import JSONResponse


router = APIRouter(prefix="/user")
# SaaS试用配额配置
REGISTERED_QUOTA = 50

def random_code(n=6):
    return ''.join(random.choices(string.digits, k=n))

class VerifyCodeRequest(BaseModel):
    email: EmailStr

ANON_KEY_PREFIX = "anon"
QUOTA_KEY_PREFIX = "user_quota"
VERIFY_KEY_PREFIX = "verify_code"

def get_current_user(request: Request) -> Optional[models.User]:
    token = request.headers.get("Authorization")
    if not token:
        return None
    try:
        scheme, _, param = token.partition(" ")
        payload = jwt.decode(param, settings.SECRET_KEY, algorithms=["HS256"])
        user = crud.get_user(models.User, payload["user_id"])
        return user
    except Exception:
        return None

#邮箱验证码发送
@router.post("/send-verify-code")
async def send_verify_code(req: VerifyCodeRequest, background_tasks: BackgroundTasks):
    code = random_code(6)
    key = f"{VERIFY_KEY_PREFIX}:{req.email}"
    crud.set_email_verify_code(key, code, expire=300)
    print("存储邮箱验证码成功！key："+key +"->"+ code)
    background_tasks.add_task(send_verify_email, req.email, code)
    return {"success": True, "message": "验证码发送成功"}

# 注册接口，带邮箱和验证码校验
@router.post("/register", response_model=schemas.UserRead)
def register(user: schemas.UserCreate, code: str):
    # 校验验证码
    key = f"{VERIFY_KEY_PREFIX}:{user.email}"
    real_code = crud.get_email_verify_code(key)
    if not real_code or real_code != code:
        raise HTTPException(status_code=400, detail="验证码错误或已过期")
    db_user = crud.get_user_by_email(user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="邮箱已注册")
    return crud.create_user_with_email(user)

# 登录接口
@router.post("/login")
def login(user: schemas.UserLogin):
    db_user = crud.get_user_by_email(user.email)
    if not db_user or not crud.verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="用户名或密码错误")
    # 返回token略
    return {"token": "TODO_GENERATE_TOKEN"}


#获取当前用户或游客配额信息，支持未登录试用,未登录可匿名查剩余额度
@router.get("/quota")
async  def process_quota(request: Request, user=None, crud=None, call_next=None, settings=None):
    #user = get_current_user(request)
    # Function to get or create a quota key for the user
    if user:
        # If the user is logged in, use their user ID
        key= f"{QUOTA_KEY_PREFIX}:{user.id}"
    else:
        # For anonymous users, prioritize anon_id (cookies), fallback to IP if anon_id is not available
        anon_id = request.cookies.get('anon_id')
        if not anon_id:
            # If no anon_id exists, create a new one and store it in the cookie
            anon_id = str(uuid.uuid4())
            # Proceed with the API call if quota allows
            resp = await call_next(request)
            resp.set_cookie('anon_id', anon_id, max_age=30 * 24 * 3600)  # 30 days expiry
        key = f"{ANON_KEY_PREFIX}:{anon_id}"

    # Check for anonymous or logged-in user quota
    is_anon = user is None  # If the user is None, they are an anonymous user
    used = crud.get_user_quota(key)

    # Check free trial quota for anonymous users
    if is_anon and used >= int(settings.FREE_TRIAL_QUOTA):
        return JSONResponse({"code": 402, "msg": "免费额度已用完，请注册/登录后继续使用！"}, status_code=402)

    # Update the quota for the user or anonymous user
    if is_anon:
        crud.set_user_quota(key, used + 1)  # Increment quota for the anonymous user

    # For logged-in users, handle their quotas accordingly
    if user and user.role != "user":  # If user is not a basic user, assign unlimited quota or a high limit
        max_quota = settings.FREE_TRIAL_QUOTA
    else:
        max_quota = 99999  # Assuming 99999 as the maximum quota for non-free users

    # Calculate remaining quota
    left = max(max_quota - used, 0)
    print(f"Max Quota: {max_quota}; Used: {used}; Left: {left}")
    return {"quotaLeft": max(left, 0), "maxQuota": max_quota}

# -------- 文件上传并触发AI流水线 --------
@router.post("/upload", response_model=schemas.TaskRead)
def upload_file(
    request: Request,
    file: UploadFile = File(...)
):
    """
    上传文件，配额控制（支持未登录试用/登录用户）
    """
    user = get_current_user(request)
    if user:
        # If the user is logged in, use their user ID
        key= f"{QUOTA_KEY_PREFIX}:{user.id}"
    else:
        # For anonymous users, prioritize anon_id (cookies), fallback to IP if anon_id is not available
        anon_id = request.cookies.get('anon_id')
        key = f"{ANON_KEY_PREFIX}:{anon_id}"
        role = "user"

        used = crud.get_user_quota(key)
        max_quota = settings.FREE_TRIAL_QUOTA if not user or role == "user" else 99999
        if used >= max_quota:
            raise HTTPException(status_code=403, detail="已用完免费额度，请注册/登录/付费后继续使用。")
        # 文件存储逻辑（按需存到本地/云端/DB）
        filename = f"{uuid.uuid4().hex}_{file.filename}"
        save_dir = settings.UPLOAD_DIR if hasattr(settings, "UPLOAD_DIR") else "uploads"
        os.makedirs(save_dir, exist_ok=True)
        file_path = os.path.join(save_dir, filename)
        with open(file_path, "wb") as f:
            f.write(file.file.read())
        #with open(file_path, "wb") as f:
        #    shutil.copyfileobj(file.file, f)

    task_id = crud.create_task(file_path=file_path, user_id=user.id if user else None)
    crud.incr_user_quota(key,1)
    process_pipeline_task.delay(task_id)
    if not user:
        # 游客配额1小时清空（防刷）
        crud.expire_user_quota(key, 3600)
    return {"task_id": task_id}

# -------- 查询任务状态 --------
@router.get("/task/{task_id}", response_model=schemas.TaskRead)
def get_task(task_id: int, current_user: models.User = Depends(auth.get_current_user)):
    task = crud.get_task(task_id)
    if not task or task.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

# -------- 用户任务列表 --------
@router.get("/my_tasks", response_model=list[schemas.TaskRead])
def my_tasks(current_user: models.User = Depends(auth.get_current_user)):
    return get_tasks(models.Task,current_user.id)

# -------- 计费与扣费查询 --------
@router.get("/billing/{task_id}")
def billing_info(task_id: int, current_user: models.User = Depends(auth.get_current_user)):
    task = crud.get_task(task_id)
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