from pydantic import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:password@localhost:5432/dbname"
    SECRET_KEY: str = "your_secret_key"
    DEEP_L_API_KEY: str = "your_deepL_api_key"
    class Config:
        env_file = ".env"

settings = Settings()