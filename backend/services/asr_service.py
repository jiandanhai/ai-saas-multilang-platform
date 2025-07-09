import requests
import os

# 推荐：配置API_KEY与调用参数可从环境变量或config加载
ASR_API_URL = os.getenv("ASR_API_URL", "https://api-internal-asr.yourcloud.com/recognize")
ASR_API_KEY = os.getenv("ASR_API_KEY", "demo_key")

def asr_recognize(file_path: str, lang: str = "zh") -> str:
    """
    对接企业内部ASR服务、第三方(如百度、讯飞、Google Speech)均可。
    上传音频返回转写文本。异常统一处理。
    """
    with open(file_path, "rb") as f:
        files = {"file": f}
        data = {"language": lang}
        headers = {"Authorization": f"Bearer {ASR_API_KEY}"}
        try:
            r = requests.post(ASR_API_URL, files=files, data=data, headers=headers, timeout=60)
            r.raise_for_status()
            return r.json().get("result")
        except Exception as e:
            # 实际生产要有详细日志
            return "[ASR识别失败] " + str(e)