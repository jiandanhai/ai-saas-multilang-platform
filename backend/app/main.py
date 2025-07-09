from fastapi import FastAPI
from api import endpoints
from app.config import settings
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="AI多语种SaaS平台", docs_url="/docs")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(endpoints.router, prefix="/api")

@app.get("/")
def read_root():
    return {"msg": "AI多语种SaaS平台已启动"}