import requests, os

TTS_API_URL = os.getenv("TTS_API_URL", "https://api-internal-tts.yourcloud.com/synthesize")
TTS_API_KEY = os.getenv("TTS_API_KEY", "demo_key")

OUTPUT_DIR = "tts_outputs"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def synthesize_speech(text: str, lang: str = "zh") -> str:
    """
    对接企业自研、百度、讯飞、Google TTS服务皆可
    生成音频mp3，返回URL
    """
    params = {"text": text, "lang": lang}
    headers = {"Authorization": f"Bearer {TTS_API_KEY}"}
    try:
        resp = requests.post(TTS_API_URL, json=params, headers=headers, timeout=60)
        resp.raise_for_status()
        # 假设返回二进制MP3
        filename = f"{lang}_{abs(hash(text))}.mp3"
        path = os.path.join(OUTPUT_DIR, filename)
        with open(path, "wb") as f:
            f.write(resp.content)
        return path
    except Exception as e:
        return f"[TTS失败]{e}"