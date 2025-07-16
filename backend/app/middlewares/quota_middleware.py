# backend/app/middlewares/quota_middleware.py
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
import uuid, os
from app.crud import get_user_quota, set_user_quota
from app.config import settings

FREE_TRIAL_LIMIT = int(settings.FREE_TRIAL_LIMIT)

class QuotaMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        user_id = getattr(request.state, "user_id", None)
        is_anon = False
        if not user_id:
            anon_id = request.cookies.get('anon_id')
            if not anon_id:
                anon_id = str(uuid.uuid4())
            user_id = f"anon_{anon_id}"
            is_anon = True
        quota = get_user_quota(user_id)
        if is_anon and quota >= FREE_TRIAL_LIMIT:
            return JSONResponse({"code": 402, "msg": "免费额度已用完，请注册/登录后继续使用！"}, status_code=402)
        resp = await call_next(request)
        set_user_quota(user_id, quota + 1)
        if is_anon:
            resp.set_cookie('anon_id', user_id.replace("anon_", ""), max_age=30*24*3600)
        return resp
