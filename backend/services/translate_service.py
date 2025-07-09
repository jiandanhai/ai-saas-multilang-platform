import requests, os

DEEPL_API_KEY = os.getenv("DEEPL_API_KEY", "")
DEEPL_API_URL = "https://api.deepl.com/v2/translate"

def translate_text(text: str, target_lang: str = "EN") -> str:
    """
    调用DeepL/Google Translate/自研NMT，建议统一接口
    """
    if not DEEPL_API_KEY:
        return text + " [未配置DEEPL_API_KEY]"
    data = {
        "auth_key": DEEPL_API_KEY,
        "text": text,
        "target_lang": target_lang.upper()
    }
    try:
        resp = requests.post(DEEPL_API_URL, data=data, timeout=20)
        resp.raise_for_status()
        translations = resp.json().get("translations", [])
        if translations:
            return translations[0]["text"]
        return text
    except Exception as e:
        return f"[翻译失败]{e}"