from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    TRANSLATE_PROVIDER: str = "baidu"  # baidu/deepl/google/azure/openai
    SECRET_KEY: str = ""
    DATABASE_URL: str = ""
    CELERY_BROKER_URL: str = "redis://localhost:6379/0"
    BAIDU_APP_ID: str = ""
    BAIDU_API_KEY: str = ""
    BAIDU_SECRET_KEY: str = ""

    DEEPL_API_KEY: str = ""
    GOOGLE_API_KEY: str = ""
    AZURE_API_KEY: str = ""
    AZURE_REGION: str = "eastasia"
    OPENAI_API_KEY: str = ""

    #在 config.py 里自动读取.env
    class Config:
        env_file = ".env"

settings = Settings()