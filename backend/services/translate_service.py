import requests

def run_translate(text: str, src_lang: str, tgt_lang: str) -> str:
    # 示例：DeepL API
    resp = requests.post("https://api.deepl.com/v2/translate", data={"text": text, "source_lang": src_lang, "target_lang": tgt_lang})
    return resp.json()["translations"][0]["text"]
