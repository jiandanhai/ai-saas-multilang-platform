import requests

def run_tts(text: str, lang: str, voice_type: str) -> str:
    # 示例：ElevenLabs API
    resp = requests.post("https://api.elevenlabs.com/v1/tts", json={"text": text, "lang": lang, "voice_type": voice_type})
    return resp.json().get("audio_url", "")
