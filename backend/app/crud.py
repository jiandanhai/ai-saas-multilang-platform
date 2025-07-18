from sqlalchemy.orm import Session
from app.models import User, Task
from app.utils import GeneralUtils, get_db
from app.schemas import UserCreate
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ORM相关方法

def create_user(db: Session, username: str, password: str, email: str, role: str = "user") -> User:
    db_user = User(username=username, password=password, email=email, role=role)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_username(db: Session, username: str) -> User:
    return db.query(User).filter(User.username == username).first()

def get_user_by_email(db: Session, email: str) -> User:
    return db.query(User).filter(User.email == email).first()

def create_user_with_email(db: Session, user: UserCreate):
    db_user = User(username=user.username, email=user.email, hashed_password=pwd_context.hash(user.password))
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_task(db: Session, file_path: str, user_id: int) -> int:
    task = Task(file_path=file_path, user_id=user_id)
    db.add(task)
    db.commit()
    db.refresh(task)
    return task.id

def get_task(db: Session, task_id: int) -> Task:
    return db.query(Task).filter(Task.id == task_id).first()

# Redis存储配额
QUOTA_KEY_PREFIX = "saas_quota:"
VERIFY_KEY_PREFIX = "verify_code:"

# 以下方法全部通过 RedisUtils 工具类实现

# ===== 邮箱验证码/邮件发送相关 =====
def send_verify_email(email, code):
    GeneralUtils.send_verify_email(f"{QUOTA_KEY_PREFIX}{email}", code)


def get_trial_quota(ip: str) -> int:
    val = GeneralUtils.get_trial_quota(f"{QUOTA_KEY_PREFIX}{ip}")
    return int(val) if val is not None else 0

def get_user_quota(user_id: str) -> int:
    val = GeneralUtils.get(f"{QUOTA_KEY_PREFIX}{user_id}")
    return int(val) if val is not None else 0

def set_user_quota(user_id: str, quota: int):
    GeneralUtils.set(f"{QUOTA_KEY_PREFIX}{user_id}", quota)

def incr_user_quota(user_id: str, amount: int = 1):
    GeneralUtils.incrby(f"{QUOTA_KEY_PREFIX}{user_id}", amount)

def decr_user_quota(user_id: str, amount: int = 1):
    GeneralUtils.decrby(f"{QUOTA_KEY_PREFIX}{user_id}", amount)

# 验证码：5分钟有效

def set_email_verify_code(email: str, code: str, expire: int = 300):
    GeneralUtils.setex(f"{VERIFY_KEY_PREFIX}{email}", expire, code)

def get_email_verify_code(email: str) -> str:
    return GeneralUtils.get(f"{VERIFY_KEY_PREFIX}{email}")
