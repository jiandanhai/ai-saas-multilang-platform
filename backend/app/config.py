from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    #REDIS连接信息
    CELERY_BROKER_URL: str = "redis://localhost:6379/0"
    #PORTGRESQL连接信息
    DATABASE_URL: str = ""

    #企业API_KEY
    TRANSLATE_PROVIDER: str = "baidu"  # baidu/deepl/google/azure/openai
    SECRET_KEY: str = ""
    BAIDU_APP_ID: str = ""
    BAIDU_API_KEY: str = ""
    BAIDU_SECRET_KEY: str = ""

    DEEPL_API_KEY: str = ""
    GOOGLE_API_KEY: str = ""
    AZURE_API_KEY: str = ""
    AZURE_REGION: str = "eastasia"
    OPENAI_API_KEY: str = ""

    FREE_TRIAL_LIMIT: int = 10

    # 用户注册相关
    EMAIL_USER: str = ""
    MAIL_USERNAME: str = ""
    MAIL_PASSWORD: str = ""
    EMAIL_PASS: str = ""
    EMAIL_FROM: str = ""
    EMAIL_HOST: str = ""
    MAIL_SERVER: str = ""
    EMAIL_PORT: int = 465
    MAIL_TLS: str = "false"
    MAIL_SSL: str = "ture"

    #frontend
    NEXT_PUBLIC_API_BASE: str = ""

    #在 config.py 里自动读取.env
    class Config:
        env_file = ".env"

settings = Settings()