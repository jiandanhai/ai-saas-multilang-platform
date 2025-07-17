from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.config import settings
import redis
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig

engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
rds = redis.Redis(host=settings.REDIS_HOST, port=settings.REDIS_PORT, db=settings.REDIS_DB, decode_responses=True)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_db_session():
    # 用于celery等不在FastAPI上下文下的任务
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def save_email_code(email: str, code: str, expire=300):
    rds.set(f"verify_code:{email}", code, ex=expire)

def get_email_code(email: str):
    return rds.get(f"verify_code:{email}")

def send_verify_email(email: str, code: str):
    conf = ConnectionConfig(
        MAIL_USERNAME=settings.MAIL_USERNAME,
        MAIL_PASSWORD=settings.MAIL_PASSWORD,
        MAIL_FROM=settings.MAIL_FROM,
        MAIL_PORT=settings.MAIL_PORT,
        MAIL_SERVER=settings.MAIL_SERVER,
        MAIL_TLS=True,
        MAIL_SSL=False,
        USE_CREDENTIALS=True
    )
    fm = FastMail(conf)
    message = MessageSchema(
        subject="验证码",
        recipients=[email],
        body=f"您的验证码是：{code}",
        subtype="plain"
    )
    return fm.send_message(message)