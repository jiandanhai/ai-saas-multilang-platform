import hashlib
import random
import requests
from app.config import settings

class TranslateProvider:
    BAIDU = "baidu"
    DEEPL = "deepl"
    GOOGLE = "google"
    AZURE = "azure"
    OPENAI = "openai"
    # 可拓展更多

def translate_text(text: str, target_lang: str = "EN") -> str:
    provider = getattr(settings, "TRANSLATE_PROVIDER", "baidu").lower()
    if provider == TranslateProvider.BAIDU:
        return baidu_translate(text, target_lang)
    elif provider == TranslateProvider.DEEPL:
        return deepl_translate(text, target_lang)
    elif provider == TranslateProvider.GOOGLE:
        return google_translate(text, target_lang)
    elif provider == TranslateProvider.AZURE:
        return azure_translate(text, target_lang)
    elif provider == TranslateProvider.OPENAI:
        return openai_translate(text, target_lang)
    else:
        raise ValueError(f"不支持的翻译引擎: {provider}")

# ========== 百度翻译 ==========
def baidu_translate(text: str, target_lang: str = "en") -> str:
    appid = settings.BAIDU_APP_ID
    key = settings.BAIDU_API_KEY
    api_url = "https://fanyi-api.baidu.com/api/trans/vip/translate"
    salt = str(random.randint(32768, 65536))
    from_lang = "auto"
    sign = hashlib.md5((appid + text + salt + key).encode("utf-8")).hexdigest()
    params = {
        "q": text,
        "from": from_lang,
        "to": target_lang,
        "appid": appid,
        "salt": salt,
        "sign": sign
    }
    try:
        resp = requests.post(api_url, data=params, timeout=8)
        resp.raise_for_status()
        data = resp.json()
        if "trans_result" in data:
            return data["trans_result"][0]["dst"]
        else:
            err_msg = data.get("error_msg", "未知错误")
            raise Exception(f"百度翻译失败: {err_msg}")
    except Exception as e:
        return f"[百度翻译异常] {e}"

# ========== DeepL ==========
def deepl_translate(text: str, target_lang: str = "EN") -> str:
    deepl_key = getattr(settings, "DEEPL_API_KEY", "")
    api_url = "https://api.deepl.com/v2/translate"
    params = {
        "auth_key": deepl_key,
        "text": text,
        "target_lang": target_lang
    }
    try:
        resp = requests.post(api_url, data=params, timeout=8)
        resp.raise_for_status()
        data = resp.json()
        if "translations" in data:
            return data["translations"][0]["text"]
        else:
            err_msg = data.get("message", "未知错误")
            raise Exception(f"DeepL翻译失败: {err_msg}")
    except Exception as e:
        return f"[DeepL翻译异常] {e}"

# ========== Google ==========
def google_translate(text: str, target_lang: str = "en") -> str:
    api_key = getattr(settings, "GOOGLE_API_KEY", "")
    api_url = "https://translation.googleapis.com/language/translate/v2"
    params = {
        "key": api_key,
        "q": text,
        "target": target_lang
    }
    try:
        resp = requests.post(api_url, data=params, timeout=8)
        resp.raise_for_status()
        data = resp.json()
        if "data" in data and "translations" in data["data"]:
            return data["data"]["translations"][0]["translatedText"]
        else:
            err_msg = data.get("error", {}).get("message", "未知错误")
            raise Exception(f"Google翻译失败: {err_msg}")
    except Exception as e:
        return f"[Google翻译异常] {e}"

# ========== Azure ==========
def azure_translate(text: str, target_lang: str = "en") -> str:
    azure_key = getattr(settings, "AZURE_API_KEY", "")
    azure_region = getattr(settings, "AZURE_REGION", "eastasia")
    api_url = f"https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to={target_lang}"
    headers = {
        "Ocp-Apim-Subscription-Key": azure_key,
        "Ocp-Apim-Subscription-Region": azure_region,
        "Content-Type": "application/json"
    }
    body = [{"text": text}]
    try:
        resp = requests.post(api_url, json=body, headers=headers, timeout=8)
        resp.raise_for_status()
        data = resp.json()
        if data and "translations" in data[0]:
            return data[0]["translations"][0]["text"]
        else:
            raise Exception(f"Azure翻译失败: 未知错误")
    except Exception as e:
        return f"[Azure翻译异常] {e}"

# ========== OpenAI (GPT) ==========
def openai_translate(text: str, target_lang: str = "en") -> str:
    openai_key = getattr(settings, "OPENAI_API_KEY", "")
    api_url = "https://api.openai.com/v1/chat/completions"
    prompt = f"Translate the following text to {target_lang}: {text}"
    headers = {
        "Authorization": f"Bearer {openai_key}",
        "Content-Type": "application/json"
    }
    data = {
        "model": "gpt-3.5-turbo",
        "messages": [
            {"role": "system", "content": "You are a translation AI."},
            {"role": "user", "content": prompt}
        ],
        "max_tokens": 2048,
        "temperature": 0.2
    }
    try:
        resp = requests.post(api_url, json=data, headers=headers, timeout=15)
        resp.raise_for_status()
        r = resp.json()
        if "choices" in r and r["choices"]:
            return r["choices"][0]["message"]["content"].strip()
        else:
            raise Exception("OpenAI返回内容异常")
    except Exception as e:
        return f"[OpenAI翻译异常] {e}"

# config.py中补充:
# TRANSLATE_PROVIDER: str = "baidu"
# BAIDU_APP_ID/BAIDU_API_KEY/DEEPL_API_KEY/AZURE_API_KEY/OPENAI_API_KEY/AZURE_REGION 等分别配置
