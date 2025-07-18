# app/api/captcha.py
from fastapi import APIRouter, Response
from captcha.image import ImageCaptcha
import random, string
from app.utils import GeneralUtils  # 需utils.py中有GeneralUtils实例

router = APIRouter()

@router.get("/captcha_img")
async def get_captcha():
    chars = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
    img = ImageCaptcha(width=160, height=60)
    img_data = img.generate(chars).getvalue()
    GeneralUtils.set(f"captcha:{chars.lower()}", chars, ex=120)  # 有效期2分钟
    return Response(content=img_data, media_type="image/png")
