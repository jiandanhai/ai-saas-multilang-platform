from app.models import Task

def calculate_cost(task: Task) -> float:
    """
    可自定义：
    - 按原音时长计价（推荐）
    - 按翻译字数、合成语音长度
    - 按套餐/订阅/单次/用户/团队定价
    """
    # 示例：基础版按上传文件名简单计费，商业可对接订单/支付
    return 1.0