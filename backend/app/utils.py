import redis
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from contextlib import contextmanager
from typing import Any, Generator
from app.config import settings

# 环境变量/配置项
REDIS_URL = settings.CELERY_BROKER_URL
PG_URL = settings.DATABASE_URL

# ----------- Redis 通用工具类 -----------
class RedisUtils:
    def __init__(self, url: str = REDIS_URL):
        self._pool = redis.ConnectionPool.from_url(url, decode_responses=True)
        self._r = redis.Redis(connection_pool=self._pool)

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
engine = create_engine(PG_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@contextmanager
def get_db_session() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
