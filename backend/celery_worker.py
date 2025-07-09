from app.tasks import celery_app

if __name__ == "__main__":
    celery_app.worker_main()
#用于独立启动 Celery 任务队列：
#celery -A app.tasks.celery_app worker --loglevel=info