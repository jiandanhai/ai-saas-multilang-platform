from sqlalchemy.orm import Session
from app.models import User, Task
import redis
from app.config import settings

# 推荐在 config.py 配 REDIS_URL，这里简单用环境变量
rds = redis.Redis.from_url(settings.CELERY_BROKER_URL, decode_responses=True)

# ORM相关方法保持不变
def create_user(db: Session, username: str, password: str, role: str = "user") -> User:
    db_user = User(username=username, password=password, role=role)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_username(db: Session, username: str) -> User:
    return db.query(User).filter(User.username == username).first()

def create_task(db: Session, file_path: str, user_id: int) -> int:
    task = Task(file_path=file_path, user_id=user_id)
    db.add(task)
    db.commit()
    db.refresh(task)
    return task.id

def get_task(db: Session, task_id: int) -> Task:
    return db.query(Task).filter(Task.id == task_id).first()

# Redis存储quota
QUOTA_KEY_PREFIX = "saas_quota:"

def get_user_quota(user_id: str) -> int:
    val = rds.get(f"{QUOTA_KEY_PREFIX}{user_id}")
    return int(val) if val is not None else 0

def set_user_quota(user_id: str, quota: int):
    rds.set(f"{QUOTA_KEY_PREFIX}{user_id}", quota)
