from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    SECRET_KEY: str = ""
    DEEP_L_API_KEY: str = ""
    DATABASE_URL: str = ""
    CELERY_BROKER_URL: str = ""
    BAIDU_APP_ID: str = ""
    BAIDU_API_KEY: str = ""
    BAIDU_SECRET_KEY: str = ""

    #在 config.py 里自动读取.env
    class Config:
        env_file = ".env"

settings = Settings()