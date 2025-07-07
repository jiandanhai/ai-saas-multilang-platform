from app.models import Task
from sqlalchemy.orm import Session

def create_task(db: Session, file_path: str) -> int:
    task = Task(file_path=file_path)
    db.add(task)
    db.commit()
    db.refresh(task)
    return task.id

def get_task(db: Session, task_id: int):
    return db.query(Task).filter(Task.id == task_id).first()

def update_task_asr(db: Session, task_id: int, asr_text: str):
    task = db.query(Task).get(task_id)
    task.asr_text = asr_text
    task.status = "asr_done"
    db.commit()

def update_task_translated(db: Session, task_id: int, translated: str):
    task = db.query(Task).get(task_id)
    task.translated_text = translated
    task.status = "translated"
    db.commit()

def update_task_tts(db: Session, task_id: int, tts_url: str):
    task = db.query(Task).get(task_id)
    task.tts_url = tts_url
    task.status = "tts_done"
    db.commit()

def update_task_status(db: Session, task_id: int, status: str):
    task = db.query(Task).get(task_id)
    task.status = status
    db.commit()
