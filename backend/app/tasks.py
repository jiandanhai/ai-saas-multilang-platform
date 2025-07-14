from celery import Celery
from services import asr_service, translate_service, tts_service
from app import crud, models
from app.utils import get_db_session
from sqlalchemy.orm import Session
from app.config import settings

celery_app = Celery('tasks', broker=settings.CELERY_BROKER_URL)

@celery_app.task(bind=True, max_retries=3, default_retry_delay=60)
def process_pipeline_task(self, task_id: int):
    """
    商业SaaS典型AI流水线：ASR->翻译->TTS->状态更新。每步异常自动重试。
    """
    db: Session = next(get_db_session())
    try:
        # 1. 拿任务信息
        task = crud.get_task(db, task_id)
        if not task:
            return
        # 2. ASR语音识别
        asr_text = asr_service.asr_recognize(task.file_path)
        task.asr_text = asr_text
        db.commit()
        # 3. 翻译
        translated_text = translate_service.translate_text(asr_text, target_lang="EN")
        task.translated_text = translated_text
        db.commit()
        # 4. TTS语音合成
        tts_url = tts_service.synthesize_speech(translated_text, lang="en")
        task.tts_url = tts_url
        task.status = "completed"
        db.commit()
    except Exception as exc:
        task = crud.get_task(db, task_id)
        if task:
            task.status = "failed"
            db.commit()
        raise self.retry(exc=exc)
    finally:
        db.close()