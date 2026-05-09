from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
import enum
from datetime import datetime
from app.core.database import Base

class SeatZone(str, enum.Enum):
    BUSINESS = "BUSINESS"
    ECONOMY = "ECONOMY"
    EXIT = "EXIT"

class SeatStatus(str, enum.Enum):
    AVAILABLE = "AVAILABLE"
    HELD = "HELD"
    OCCUPIED = "OCCUPIED"
    BLOCKED = "BLOCKED"

class FlightSegment(Base):
    __tablename__ = "flight_segments"
    id = Column(Integer, primary_key=True, index=True)
    flight_number = Column(String(10), nullable=False)
    departure_airport = Column(String(3), nullable=False)
    arrival_airport = Column(String(3), nullable=False)
    departure_time = Column(DateTime, nullable=False)
    arrival_time = Column(DateTime, nullable=False)

class SeatInventory(Base):
    __tablename__ = "seat_inventory"
    id = Column(Integer, primary_key=True, index=True)
    flight_segment_id = Column(Integer, ForeignKey("flight_segments.id"), nullable=False)
    seat_number = Column(String(4), nullable=False)
    zone_type = Column(Enum(SeatZone), default=SeatZone.ECONOMY)
    status = Column(Enum(SeatStatus), default=SeatStatus.AVAILABLE)
    ticket_id = Column(Integer, ForeignKey("tickets.id"), nullable=True)
