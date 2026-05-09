from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
import enum
from datetime import datetime
from app.core.database import Base

class TicketStatus(str, enum.Enum):
    ALLOCATED = "ALLOCATED"
    ISSUED = "ISSUED"
    CHECKED_IN = "CHECKED_IN"
    BOARDED = "BOARDED"
    EXCHANGED = "EXCHANGED"
    REFUNDED = "REFUNDED"
    VOIDED = "VOIDED"

class Ticket(Base):
    __tablename__ = "tickets"
    id = Column(Integer, primary_key=True, index=True)
    ticket_number = Column(String(13), unique=True, index=True, nullable=True)
    passenger_id = Column(Integer, ForeignKey("passengers.id"), nullable=False)
    pnr_id = Column(Integer, ForeignKey("pnr_reservations.id"), nullable=False)
    status = Column(Enum(TicketStatus), default=TicketStatus.ALLOCATED)
    base_fare = Column(Float, default=0.0)
    issue_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
