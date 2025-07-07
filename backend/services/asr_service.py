import requests

def run_asr(file_path: str) -> str:
    # 示例：Whisper API
    with open(file_path, 'rb') as f:
        resp = requests.post("https://api.whisper.com/asr", files={"file": f})
    return resp.json().get("text", "")
