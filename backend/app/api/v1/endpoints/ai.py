from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List, Optional
import google.generativeai as genai
from datetime import datetime, timedelta
import json
import re

from app.core.database import get_db
from app.core.config import settings
from app.models.nghiep_vu import DatCho, VeMayBay
from app.models.danh_muc import ChuyenBay, SanBay, TuyenBay, ChiTietHangGhe
from app.models.quan_tri import KhachHang
from pydantic import BaseModel

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[dict]] = []

class ChatResponse(BaseModel):
    response: str

class PredictionResponse(BaseModel):
    summary: str
    predictions: List[dict]

class ActionRequest(BaseModel):
    action_type: str
    data: dict

async def get_ai_context(db: AsyncSession):
    try:
        # Total Bookings
        count_stmt = select(func.count(DatCho.ma_dat_cho))
        total_bookings = (await db.execute(count_stmt)).scalar() or 0
        
        # Total Revenue
        rev_stmt = select(func.sum(DatCho.tong_tien))
        total_revenue = (await db.execute(rev_stmt)).scalar() or 0
        
        # Recent Bookings
        recent_stmt = select(DatCho).order_by(DatCho.ngay_dat.desc()).limit(5)
        recent_bookings = (await db.execute(recent_stmt)).scalars().all()
        
        # Top Routes
        top_routes_stmt = select(
            TuyenBay.ma_sb_di, 
            TuyenBay.ma_sb_den, 
            func.count(VeMayBay.ma_ve).label('ticket_count')
        ).join(ChuyenBay, TuyenBay.ma_tuyen == ChuyenBay.ma_tuyen)\
         .join(VeMayBay, ChuyenBay.ma_cb == VeMayBay.ma_cb)\
         .group_by(TuyenBay.ma_sb_di, TuyenBay.ma_sb_den)\
         .order_by(func.count(VeMayBay.ma_ve).desc())\
         .limit(3)
        
        top_routes = (await db.execute(top_routes_stmt)).all()

        context = f"Dữ liệu hệ thống hiện tại:\n"
        context += f"- Tổng số đơn hàng: {total_bookings}\n"
        context += f"- Tổng doanh thu: {float(total_revenue):,.0f} VNĐ\n"
        context += f"- Top 3 tuyến bay phổ biến nhất:\n"
        for r in top_routes:
            context += f"  + {r.ma_sb_di} -> {r.ma_sb_den}: {r.ticket_count} vé\n"
        
        context += "\n5 đơn hàng gần nhất:\n"
        for b in recent_bookings:
            context += f"  + Mã: {b.ma_dat_cho}, Ngày: {b.ngay_dat}, Tổng: {float(b.tong_tien or 0):,.0f} VNĐ, Trạng thái: {b.trang_thai_tt}\n"
        
        return context
    except Exception as e:
        return f"Lỗi khi lấy dữ liệu: {str(e)}"

@router.post("/chat", response_model=ChatResponse)
async def ai_chat(request: ChatRequest, db: AsyncSession = Depends(get_db)):
    if not settings.GEMINI_API_KEY:
        return {"response": "Lỗi: Chưa cấu hình GEMINI_API_KEY."}

    try:
        genai.configure(api_key=settings.GEMINI_API_KEY)
        # Using gemini-3-flash-preview as requested/available
        model = genai.GenerativeModel('gemini-3-flash-preview')
        
        db_context = await get_ai_context(db)
        
        system_prompt = f"""
Bạn là 'Skyward AI Assistant'. Dữ liệu hệ thống:
{db_context}

Nhiệm vụ: Trả lời câu hỏi của Admin về kinh doanh, doanh thu, và gợi ý tối ưu. Trả lời ngắn gọn, chuyên nghiệp.
"""
        full_message = f"{system_prompt}\n\nUser: {request.message}"
        response = model.generate_content(full_message)
        return {"response": response.text}
    except Exception as e:
        print(f"AI Chat Error: {str(e)}")
        # Fallback to a simpler response if Gemini fails
        return {"response": f"Xin lỗi, tôi đang gặp sự cố kết nối: {str(e)}"}

@router.get("/prediction", response_model=PredictionResponse)
async def get_ai_predictions(db: AsyncSession = Depends(get_db)):
    if not settings.GEMINI_API_KEY:
        raise HTTPException(status_code=400, detail="Missing API Key")

    try:
        genai.configure(api_key=settings.GEMINI_API_KEY)
        model = genai.GenerativeModel('gemini-3-flash-preview')
        
        db_context = await get_ai_context(db)
        prompt = f"""
Phân tích dữ liệu sau và đưa ra 3 dự báo/gợi ý giá cho tuần tới.
Trả về JSON duy nhất: 
{{
  "summary": "Tóm tắt xu hướng",
  "predictions": [
    {{"route": "HAN-SGN", "trend": "Tăng 10%", "reason": "Lý do...", "suggestion": "Tăng giá 50k", "action_id": "update_price", "params": {{"ma_tuyen": "HAN-SGN", "increase": 50000}}}}
  ]
}}
Dữ liệu: {db_context}
"""
        response = model.generate_content(prompt)
        content = response.text
        match = re.search(r'\{.*\}', content, re.DOTALL)
        if match:
            return json.loads(match.group())
        return {"summary": "Không có dữ liệu dự báo", "predictions": []}
    except Exception as e:
        print(f"AI Prediction Error: {str(e)}")
        return {"summary": f"Lỗi: {str(e)}", "predictions": []}

@router.post("/action")
async def ai_action(request: ActionRequest, db: AsyncSession = Depends(get_db)):
    """Xử lý các hành động được gợi ý bởi AI"""
    try:
        if request.action_type == "update_price":
            ma_tuyen = request.data.get("ma_tuyen")
            increase = request.data.get("increase", 0)
            
            # Cập nhật giá cơ bản cho tất cả các chuyến bay thuộc tuyến này
            stmt = select(ChuyenBay).where(ChuyenBay.ma_tuyen == ma_tuyen)
            result = await db.execute(stmt)
            chuyen_bays = result.scalars().all()
            
            for cb in chuyen_bays:
                stmt_hg = select(ChiTietHangGhe).where(ChiTietHangGhe.ma_cb == cb.ma_cb)
                res_hg = await db.execute(stmt_hg)
                hang_ghes = res_hg.scalars().all()
                for hg in hang_ghes:
                    hg.gia_co_ban += increase
            
            await db.commit()
            return {"status": "success", "message": f"Đã tăng giá {increase:,.0f} VNĐ cho tuyến {ma_tuyen}"}
            
        return {"status": "error", "message": "Hành động không hợp lệ"}
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
