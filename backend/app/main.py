from fastapi import FastAPI

app = FastAPI(title="Airline Ticket Agency Management API")

@app.get("/")
async def root():
    return {"message": "Welcome to the Airline Ticket Agency Management API"}
