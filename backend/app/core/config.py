"""
core/config.py
Đọc cấu hình từ file .env bằng pydantic BaseSettings
"""
from pathlib import Path
from pydantic_settings import BaseSettings

# Tìm file .env ở gốc dự án (2 cấp trên backend/app/core)
_ENV_FILE = Path(__file__).resolve().parents[3] / ".env"


class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str = "changeme"
    DEBUG: bool = True
    API_V1_STR: str = "/api/v1"
    GEMINI_API_KEY: str | None = None
    GEMINI_MODEL: str = "gemini-2.5-flash"


    class Config:
        env_file = str(_ENV_FILE)
        env_file_encoding = "utf-8"


settings = Settings()
