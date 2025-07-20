from typing import LiteralString

from sqlalchemy.orm import Session
from app.models import User, Task
from app.utils import GeneralUtils, get_db
from app.schemas import UserCreate
from passlib.context import CryptContext
from fastapi import APIRouter, Depends
from typing import Optional

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ORM相关方法
def get_user(user: User,user_id) -> Optional[User]:
    db = Depends(get_db)
    user = db.query(user).filter_by(user_id).first()
    return user

def create_user(username: str, password: str, email: str, role: str = "user") -> User:
    db = Depends(get_db)
    db_user = User(username=username, password=password, email=email, role=role)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_username(username: str) -> User:
    db = Depends(get_db)
    return db.query(User).filter(User.username == username).first()

def get_user_by_email(email: str) -> User:
    db = Depends(get_db)
    return db.query(User).filter(User.email == email).first()

def create_user_with_email(user: UserCreate):
    db = Depends(get_db)
    db_user = User(username=user.username, email=user.email, hashed_password=pwd_context.hash(user.password))
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_task(file_path: str, user_id: int) -> int:
    db = Depends(get_db)
    task = Task(file_path=file_path, user_id=user_id)
    db.add(task)
    db.commit()
    db.refresh(task)
    return task.id

def get_task(task_id: int) -> Task:
    db = Depends(get_db)
    return db.query(Task).filter(Task.id == task_id).first()

def get_tasks(task: Task, current_user_id: int):
    db = Depends(get_db)
    return db.query(task).filter(task.user_id == current_user_id).all()

# Redis存储配额

# ===== 邮箱验证码/邮件发送相关 =====
def send_verify_email(email: str, code: str):
    GeneralUtils.send_verify_email(email, code)


def get_user_quota(key: str) -> int:
    return GeneralUtils.get_user_quota(key)

def set_user_quota(key: str, quota: int):
    GeneralUtils.set(key, quota)

def incr_user_quota(key: str, amount: int = 1):
    GeneralUtils.incrby(key, amount)

def expire_user_quota(key: str, time: int = 1):
    GeneralUtils.expire(key, time)

def decr_user_quota(key: str, amount: int = 1):
    GeneralUtils.decrby(key, amount)

# 验证码：5分钟有效

def set_email_verify_code(key: str, code: str, expire: int = 300):
    GeneralUtils.setex(key, expire, code)

def get_email_verify_code(key: str) -> str:
    return GeneralUtils.get(key)

def set_captcha_img( img_chars: str):
    GeneralUtils.set(f"captcha:{img_chars.lower()}", img_chars, ex=120)
