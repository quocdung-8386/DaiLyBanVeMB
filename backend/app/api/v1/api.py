from fastapi import APIRouter
from app.api.v1.endpoints import flights, bookings, dashboard, users, finance, auth, reports, audit_logs, catalog, loyalty, ai

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(flights.router, prefix="/flights", tags=["Flights"])
api_router.include_router(bookings.router, prefix="/bookings", tags=["Bookings"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(finance.router, prefix="/finance", tags=["Finance"])
api_router.include_router(reports.router, prefix="/reports", tags=["Reports"])
api_router.include_router(audit_logs.router, prefix="/audit-logs", tags=["AuditLogs"])
api_router.include_router(catalog.router, prefix="/catalog", tags=["Catalog"])
api_router.include_router(loyalty.router, prefix="/loyalty", tags=["Loyalty"])
api_router.include_router(ai.router, prefix="/ai", tags=["AI"])
