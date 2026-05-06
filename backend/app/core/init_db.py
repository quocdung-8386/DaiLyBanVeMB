"""
core/init_db.py
Khởi tạo database: chạy schema.sql để tạo toàn bộ bảng.
Sử dụng raw asyncpg connection để thực thi multi-statement SQL.
"""
import asyncio
import argparse
import logging
from pathlib import Path
import asyncpg

from app.core.config import settings

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
logger = logging.getLogger(__name__)

SCRIPTS_DIR = Path(__file__).resolve().parents[3] / "database" / "scripts"
SCHEMA_FILE = SCRIPTS_DIR / "schema.sql"
SEED_FILE = SCRIPTS_DIR / "seed.sql"
PROCEDURES_FILE = SCRIPTS_DIR / "procedures.sql"

# asyncpg URL
DB_URL = settings.DATABASE_URL.replace("postgresql://", "postgresql://", 1)

async def run_sql_file(conn: asyncpg.Connection, filepath: Path, label: str) -> None:
    """Đọc và thực thi toàn bộ file SQL bằng raw execute của asyncpg."""
    if not filepath.exists():
        logger.warning(f"⚠️  File không tồn tại, bỏ qua: {filepath}")
        return

    logger.info(f"▶ Đang thực thi {label}: {filepath.name}")
    sql_content = filepath.read_text(encoding="utf-8")
    
    # asyncpg Connection.execute() hỗ trợ thực thi nhiều câu lệnh ngăn cách bởi dấu ;
    try:
        await conn.execute(sql_content)
        logger.info(f"✅ Hoàn thành {label}")
    except Exception as e:
        logger.error(f"❌ Lỗi khi thực thi {label}: {e}")
        raise e

async def init_db(run_seed: bool = False) -> None:
    """Tạo toàn bộ bảng từ schema.sql và stored procedures."""
    
    try:
        # Chuyển URL sang định dạng asyncpg nếu cần (thực tế DATABASE_URL đã dùng được)
        conn_url = settings.DATABASE_URL
        
        logger.info("=" * 55)
        logger.info("🚀 Bắt đầu khởi tạo Database: DaiLyBanVeMB")
        logger.info(f"📍 URL: {conn_url.split('@')[-1]}")
        logger.info("=" * 55)

        conn = await asyncpg.connect(conn_url)
        try:
            # Bước 1: Tạo bảng từ schema.sql
            await run_sql_file(conn, SCHEMA_FILE, "Schema (tạo bảng)")

            # Bước 2: Tạo stored procedures
            await run_sql_file(conn, PROCEDURES_FILE, "Stored Procedures")

            # Bước 3 (tuỳ chọn): Nạp dữ liệu mẫu
            if run_seed:
                await run_sql_file(conn, SEED_FILE, "Seed Data (dữ liệu mẫu)")

            logger.info("=" * 55)
            logger.info("🎉 Khởi tạo DB thành công!")
            logger.info("=" * 55)
        finally:
            await conn.close()

    except Exception as e:
        logger.error(f"❌ Lỗi hệ thống: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Khởi tạo Database PostgreSQL")
    parser.add_argument(
        "--seed",
        action="store_true",
        help="Nạp dữ liệu mẫu từ seed.sql sau khi tạo bảng",
    )
    args = parser.parse_args()
    asyncio.run(init_db(run_seed=args.seed))
