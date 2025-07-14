from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    secret_key: str = ""
    database_url: str = ""
    celery_broker_url: str = "redis://localhost:6379/0"
    baidu_app_id: str = ""
    baidu_api_key: str = ""
    baidu_secret_key: str = ""

    #在 config.py 里自动读取.env
    class Config:
        env_file = ".env"

settings = Settings()