from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
import datetime

Base = declarative_base()

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    file_path = Column(String)
    status = Column(String, default="pending")
    asr_text = Column(String, nullable=True)
    translated_text = Column(String, nullable=True)
    tts_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
