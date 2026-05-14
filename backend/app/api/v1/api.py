from fastapi import APIRouter
from app.api.v1.endpoints import flights, bookings, dashboard, users, finance

api_router = APIRouter()
api_router.include_router(flights.router, prefix="/flights", tags=["Flights"])
api_router.include_router(bookings.router, prefix="/bookings", tags=["Bookings"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(finance.router, prefix="/finance", tags=["Finance"])
