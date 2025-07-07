from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session
from app.schemas import TaskStatus
from app.crud import create_task, get_task
from app.tasks import process_pipeline
from app.utils import get_db, save_upload_file

router = APIRouter()

@router.post("/upload")
async def upload_file(file: UploadFile = File(...), db: Session = Depends(get_db)):
    file_path = save_upload_file(file)
    task_id = create_task(db, file_path)
    process_pipeline.delay(task_id)
    return {"task_id": task_id}

@router.get("/task/{task_id}", response_model=TaskStatus)
def get_task_status(task_id: int, db: Session = Depends(get_db)):
    task = get_task(db, task_id)
    return TaskStatus(
        id=task.id,
        status=task.status,
        asr_text=task.asr_text,
        translated_text=task.translated_text,
        tts_url=task.tts_url
    )
