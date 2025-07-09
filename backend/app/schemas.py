from pydantic import BaseModel
from typing import Optional
import datetime

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    id: int
    role: str
    created_at: datetime.datetime
    class Config:
        orm_mode = True

class TaskBase(BaseModel):
    file_path: str
    status: Optional[str] = None
    asr_text: Optional[str] = None
    translated_text: Optional[str] = None
    tts_url: Optional[str] = None

class TaskCreate(TaskBase):
    pass

class TaskRead(TaskBase):
    id: int
    created_at: datetime.datetime
    user_id: int
    class Config:
        orm_mode = True