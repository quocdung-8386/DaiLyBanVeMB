from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from decimal import Decimal

class PassengerCreate(BaseModel):
    name: str
    seat: Optional[str] = None
    age_type: str = "Người lớn"

class ExtraServicesCreate(BaseModel):
    baggage: List[dict] # [{weight: 15, price: 150000}]
    meals: List[dict] # [{selected: True, type: 'Cơm gà', price: 85000}]

class BookingCreate(BaseModel):
    flight_id: str
    customer_name: str
    phone: str
    email: Optional[str] = None
    passengers: List[PassengerCreate]
    total_amount: Decimal
    status: str = "Chờ thanh toán"
    fare_class: str = "Economy"
    extra_services: Optional[ExtraServicesCreate] = None

class BookingUpdate(BaseModel):
    status: Optional[str] = None
    badge: Optional[str] = None
    seat: Optional[str] = None
