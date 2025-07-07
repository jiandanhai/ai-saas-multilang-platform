from celery import Celery
from app.services.asr_service import run_asr
from app.services.translate_service import run_translate
from app.services.tts_service import run_tts
from app.models import Task
from app.crud import update_task_asr, update_task_translated, update_task_tts, update_task_status
from app.utils import SessionLocal

celery_app = Celery(__name__, broker="redis://localhost:6379/0")

@celery_app.task
def process_pipeline(task_id: int):
    db = SessionLocal()
    task = db.query(Task).get(task_id)
    # ASR
    asr_text = run_asr(task.file_path)
    update_task_asr(db, task_id, asr_text)
    # 翻译
    translated = run_translate(asr_text, src_lang="en", tgt_lang="zh")
    update_task_translated(db, task_id, translated)
    # 配音
    tts_url = run_tts(translated, lang="zh", voice_type="female1")
    update_task_tts(db, task_id, tts_url)
    update_task_status(db, task_id, "finished")
    db.close()
