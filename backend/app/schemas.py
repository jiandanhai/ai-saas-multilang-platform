from pydantic import BaseModel
from typing import Optional

class TaskCreate(BaseModel):
    file_path: str

class TaskStatus(BaseModel):
    id: int
    status: str
    asr_text: Optional[str]
    translated_text: Optional[str]
    tts_url: Optional[str]
