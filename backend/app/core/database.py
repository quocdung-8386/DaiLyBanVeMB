"""
core/database.py
Kết nối PostgreSQL bằng SQLAlchemy (async engine + session factory)
"""
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase

from app.core.config import settings

# Chuyển đổi URL sang dạng async (asyncpg driver)
# postgresql://... → postgresql+asyncpg://...
ASYNC_DATABASE_URL = settings.DATABASE_URL.replace(
    "postgresql://", "postgresql+asyncpg://", 1
)

# Tạo async engine
engine = create_async_engine(
    ASYNC_DATABASE_URL,
    echo=settings.DEBUG,      # In SQL ra console khi DEBUG=True
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,       # Tự ping trước khi dùng connection để tránh lỗi stale
)

# Session factory
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,   # Tránh lazy-load sau khi commit
    autocommit=False,
    autoflush=False,
)


class Base(DeclarativeBase):
    """Base class chung cho tất cả ORM models"""
    pass


async def get_db() -> AsyncSession:
    """
    FastAPI Dependency: Cung cấp DB session cho mỗi request.
    Tự động đóng session sau khi request hoàn tất.
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
