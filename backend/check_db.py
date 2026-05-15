import asyncio
import sys
import os
import json

# Add the current directory to sys.path so we can import 'app'
sys.path.append(os.getcwd())

from sqlalchemy import select
from app.core.database import AsyncSessionLocal
from app.models.nghiep_vu import DatCho

async def check_booking():
    print("--- DIRECT DATABASE CHECK (JSON MODE) ---")
    async with AsyncSessionLocal() as db:
        query = select(DatCho)
        result = await db.execute(query)
        bookings = result.scalars().all()
        
        data = []
        for b in bookings:
            data.append({
                "id": b.ma_dat_cho,
                "status": b.trang_thai_tt,
                "amount": str(b.tong_tien)
            })
        
        # Print as JSON string to avoid console encoding issues
        print(json.dumps(data, ensure_ascii=True, indent=2))

if __name__ == "__main__":
    asyncio.run(check_booking())
