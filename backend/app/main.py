from fastapi import FastAPI
from api import endpoints
from app.config import settings
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="AI多语种SaaS平台", docs_url="/docs")

# 企业级CORS安全优化
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境建议指定具体域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 可选：接入免费额度/配额中间件（如果有）
try:
    from app.middlewares.quota_middleware import QuotaMiddleware
    app.add_middleware(QuotaMiddleware)
except ImportError:
    pass

# 路由
app.include_router(endpoints.router, prefix="/api")

@app.get("/")
def read_root():
    return {"msg": "AI多语种SaaS平台已启动"}
