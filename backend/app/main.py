"""
main.py – FastAPI Application Entry Point
Hệ thống Quản lý Đại lý bán vé máy bay
"""
from contextlib import asynccontextmanager
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import engine, Base
from app.core.config import settings

# Import tất cả models để SQLAlchemy nhận diện metadata
import app.models  # noqa: F401
import app.domain.pnr.models
import app.domain.ticketing.models
import app.domain.inventory.models
import app.domain.checkin.models

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup & Shutdown lifecycle"""
    # STARTUP
    logger.info("🚀 Khởi động Airline Ticket Agency API...")
    logger.info(f"📊 Kết nối tới: {settings.DATABASE_URL.split('@')[-1]}")
    # Tạo bảng nếu chưa tồn tại (chỉ dùng khi phát triển)
    # Trong production, nên dùng Alembic migration
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("✅ Database tables ready")
    yield
    # SHUTDOWN
    logger.info("🛑 Đóng kết nối database...")
    await engine.dispose()


from app.api.v1.api import api_router
from app.core.config import settings

# ... (rest of imports)

app = FastAPI(
    title="Airline Ticket Agency Management API",
    description="API quản lý đại lý bán vé máy bay - DailyBanVeMB",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS – cho phép frontend Next.js gọi API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,

    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/", tags=["Health"])
async def root():
    return {
        "message": "✈️ Airline Ticket Agency API đang hoạt động",
        "version": "1.0.0",
        "docs": "/docs",
    }


@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok", "database": "connected"}
