from sqlalchemy.orm import Session
from app.models import User, Task

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