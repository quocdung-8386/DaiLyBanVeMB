from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Enum, Boolean, Float
from sqlalchemy.orm import relationship
import enum
from datetime import datetime
from app.core.database import Base

class CheckinStatus(str, enum.Enum):
    PENDING = "PENDING"
    COMPLETED = "COMPLETED"
    REVOKED = "REVOKED"

class CheckinRecord(Base):
    __tablename__ = "checkin_records"
    id = Column(Integer, primary_key=True, index=True)
    pnr_id = Column(Integer, ForeignKey("pnr_reservations.id"), nullable=False)
    ticket_id = Column(Integer, ForeignKey("tickets.id"), nullable=False)
    checkin_time = Column(DateTime, default=datetime.utcnow)
    ip_address = Column(String(50), nullable=True)
    status = Column(Enum(CheckinStatus), default=CheckinStatus.COMPLETED)
    channel = Column(String(20), default="WEB")

class BoardingPass(Base):
    __tablename__ = "boarding_passes"
    id = Column(Integer, primary_key=True, index=True)
    checkin_id = Column(Integer, ForeignKey("checkin_records.id"), nullable=False)
    sequence_number = Column(Integer, nullable=False)
    seat_number = Column(String(4), nullable=False)
    boarding_group = Column(String(10), nullable=True)
    gate_id = Column(Integer, nullable=True)
    terminal = Column(String(10), nullable=True)
    boarding_time = Column(DateTime, nullable=True)

class BaggageType(str, enum.Enum):
    CARRY_ON = "CARRY_ON"
    CHECKED_IN = "CHECKED_IN"
    HEAVY = "HEAVY"

class BaggageItem(Base):
    __tablename__ = "baggage_items"
    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(Integer, ForeignKey("tickets.id"), nullable=False)
    type = Column(Enum(BaggageType), default=BaggageType.CHECKED_IN)
    weight_kg = Column(Float, nullable=False)
    price = Column(Float, default=0.0)
    status = Column(String(20), default="PAID")
