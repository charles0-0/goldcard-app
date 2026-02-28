import os
import sys

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import auth, users, cards, transactions

# Create Tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="GoldCard Pay API")

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router, prefix="/api", tags=["auth"])
app.include_router(users.router, prefix="/api", tags=["users"])
app.include_router(cards.router, prefix="/api", tags=["cards"])
app.include_router(transactions.router, prefix="/api", tags=["transactions"])

@app.get("/")
def read_root():
    return {"message": "Welcome to GoldCard Pay API"}

@app.get("/api")
def read_api():
    return {"message": "Welcome to GoldCard Pay API"}
