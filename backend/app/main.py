from fastapi import FastAPI
from app.api.endpoints import router as api_router

app = FastAPI(title="AI多语种SaaS商业版")

app.include_router(api_router, prefix="/api")

# 启动命令：
# uvicorn app.main:app --reload
