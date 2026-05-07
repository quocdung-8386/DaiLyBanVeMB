from datetime import datetime, time
from decimal import Decimal
from typing import List, Optional
from pydantic import BaseModel, ConfigDict


class AirlineSchema(BaseModel):
    ma_hang: str
    ten_hang: str
    logo: Optional[str] = None
    quoc_gia: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class AirportSchema(BaseModel):
    ma_sb: str
    ten_sb: str
    thanh_pho: str
    quoc_gia: str

    model_config = ConfigDict(from_attributes=True)


class FlightClassSchema(BaseModel):
    hang_ghe: str
    tong_so_ghe: int
    so_ghe_trong: int
    gia_co_ban: Decimal

    model_config = ConfigDict(from_attributes=True)


class FlightSearchRequest(BaseModel):
    origin: str
    destination: str
    departure_date: datetime
    passengers: int = 1
    seat_class: str = "Economy"


class FlightResponse(BaseModel):
    ma_cb: str
    ma_hang: str
    ten_hang: str
    logo: Optional[str] = None
    ma_tuyen: str
    ma_sb_di: str
    ten_sb_di: str
    ma_sb_den: str
    ten_sb_den: str
    ngay_gio_di: datetime
    ngay_gio_den: datetime
    thoi_gian_bay: int  # minutes
    nha_ga: Optional[str] = None
    cong_khoi_hanh: Optional[str] = None
    trang_thai: str
    
    # Thông tin hạng ghế cụ thể được chọn
    hang_ghe: str
    so_ghe_trong: int
    gia_ve: Decimal
    
    # Tiện ích (từ dữ liệu mẫu frontend)
    carry_on: str = "7kg"
    checked_baggage: str = "20kg"
    aircraft: str = "Airbus A321"

    model_config = ConfigDict(from_attributes=True)
