import redis
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from contextlib import contextmanager
from typing import Any, Generator
from app.config import settings
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from email.mime.text import MIMEText
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from email.header import Header
import smtplib

# ----------- 通用工具类 -----------
class GeneralUtils:
    _redis = None

    @classmethod
    def get_client(cls):
        if not cls._redis:
            cls._redis = redis.StrictRedis.from_url(settings.CELERY_BROKER_URL, decode_responses=True)
        return cls._redis

    @classmethod
    def save_email_code(cls, email, code, expire=300):
        r = cls.get_client()
        r.setex(f"email_code:{email}", expire, code)

    @classmethod
    def get_email_code(cls, email):
        r = cls.get_client()
        return r.get(f"email_code:{email}")

    @classmethod
    def get_trial_quota(cls, ip):
        r = cls.get_client()
        key = f"trial_quota:{ip}"
        val = r.get(key)
        if val is None:
            r.set(key, settings.FREE_TRIAL_QUOTA, ex=86400)
            return settings.FREE_TRIAL_QUOTA
        return int(val)

    @classmethod
    def decrease_trial_quota(cls, ip):
        r = cls.get_client()
        key = f"trial_quota:{ip}"
        if not r.exists(key):
            r.set(key, settings.FREE_TRIAL_QUOTA, ex=86400)
        r.decr(key)

    # ===== 邮箱验证码/邮件发送相关 =====
    def send_verify_email(email, code):
        subject = '您的验证码'
        content = f'您的验证码是：{code}，5分钟内有效。如非本人操作请忽略。'
        msg = MIMEText(content, 'plain', 'utf-8')
        msg['Subject'] = Header(subject, 'utf-8')
        msg['From'] = settings.MAIL_FROM
        msg['To'] = email
        try:
            smtp = smtplib.SMTP_SSL(settings.MAIL_SERVER, settings.MAIL_PORT)
            smtp.login(settings.MAIL_USERNAME, settings.MAIL_PASSWORD)
            smtp.sendmail(settings.MAIL_FROM, [email], msg.as_string())
            smtp.quit()
        except Exception as e:
            print(f"邮件发送失败: {e}")


    def set(self, key: str, value: Any):
        return self._r.set(key, value)

    def get(self, key: str):
        return self._r.get(key)

    def delete(self, key: str):
        return self._r.delete(key)

    def incrby(self, key: str, amount: int = 1):
        return self._r.incrby(key, amount)

    def decrby(self, key: str, amount: int = 1):
        return self._r.decrby(key, amount)

    def setex(self, key: str, time: int, value: Any):
        return self._r.setex(key, time, value)

    def exists(self, key: str):
        return self._r.exists(key)

    def close(self):
        self._r.close()

    # ----------- PostgreSQL 通用Session管理 -----------
engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@contextmanager
def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



