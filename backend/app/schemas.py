from pydantic import BaseModel, EmailStr
from typing import Optional
import datetime

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str
    email: EmailStr        # 新增

class UserRead(UserBase):
    id: int
    role: str
    email: EmailStr        # 新增
    created_at: datetime.datetime
    class Config:
        orm_mode = True

class UserLogin(BaseModel):    # 登录结构
    username: str
    password: str

class SendCodeRequest(BaseModel):
    email: EmailStr

class VerifyCodeRequest(BaseModel):
    email: EmailStr
    code: str
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