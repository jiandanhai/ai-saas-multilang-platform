# backend/app/middlewares/quota_middleware.py
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
import uuid, os
from app.crud import get_user_quota, set_user_quota
from app.config import settings

#实现接口调用限额（quota）相关的中间件逻辑，比如防止用户在试用期间无限制调用API，实现试用配额/套餐配额等
#拦截请求，在业务逻辑之前或之后执行额外校验。
#比如判断token对应用户的额度是否足够、剩余额度是否需要提示等。
#返回配额不足等自定义HTTP响应码，防止继续处理。
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
        if is_anon and quota >= int(settings.FREE_TRIAL_QUOTA):
            return JSONResponse({"code": 402, "msg": "免费额度已用完，请注册/登录后继续使用！"}, status_code=402)
        resp = await call_next(request)
        set_user_quota(user_id, quota + 1)
        if is_anon:
            resp.set_cookie('anon_id', user_id.replace("anon_", ""), max_age=30*24*3600)
        return resp
