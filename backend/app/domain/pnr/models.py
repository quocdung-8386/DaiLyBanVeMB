from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
import enum
from datetime import datetime
from app.core.database import Base

class PnrStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    HOLD = "HOLD"
    PENDING_PAYMENT = "PENDING_PAYMENT"
    TICKETED = "TICKETED"
    CANCELLED = "CANCELLED"

class PnrReservation(Base):
    __tablename__ = "pnr_reservations"
    id = Column(Integer, primary_key=True, index=True)
    pnr_code = Column(String(6), unique=True, index=True, nullable=False)
    agency_id = Column(Integer, nullable=False)
    created_by = Column(Integer, nullable=False)
    status = Column(Enum(PnrStatus), default=PnrStatus.DRAFT)
    total_fare = Column(Float, default=0.0)
    tax_amount = Column(Float, default=0.0)
    hold_until = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    passengers = relationship("Passenger", back_populates="pnr")

class PassengerType(str, enum.Enum):
    ADT = "ADT"
    CHD = "CHD"
    INF = "INF"

class Passenger(Base):
    __tablename__ = "passengers"
    id = Column(Integer, primary_key=True, index=True)
    pnr_id = Column(Integer, ForeignKey("pnr_reservations.id"), nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    dob = Column(DateTime, nullable=False)
    passport_number = Column(String(50), nullable=True)
    passenger_type = Column(Enum(PassengerType), default=PassengerType.ADT)
    
    pnr = relationship("PnrReservation", back_populates="passengers")
