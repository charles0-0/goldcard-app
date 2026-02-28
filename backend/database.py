import os
from urllib.parse import quote_plus
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

load_dotenv()

ENV = os.getenv("ENV", "development")

if ENV == "production":
    # Supabase PostgreSQL
    SUPABASE_URL = os.getenv("SUPABASE_URL", "")
    SUPABASE_PASSWORD = os.getenv("SUPABASE_PASSWORD", "")
    
    if not SUPABASE_URL or not SUPABASE_PASSWORD:
        raise ValueError("SUPABASE_URL and SUPABASE_PASSWORD must be set in production")
    
    # Parse project ref from URL
    project_ref = SUPABASE_URL.replace("https://", "").replace(".supabase.co", "")
    
    # URL encode the password to handle special characters
    encoded_password = quote_plus(SUPABASE_PASSWORD)
    SQLALCHEMY_DATABASE_URL = f"postgresql://postgres:{encoded_password}@db.{project_ref}.supabase.co:5432/postgres"
    
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
else:
    # Development: SQLite
    SQLALCHEMY_DATABASE_URL = "sqlite:///./database.sqlite"
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
