import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from backend.config import settings

# Attempt PostgreSQL connection, fallback to SQLite inside backend directory
try:
    engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)
    # Test connection
    with engine.connect() as conn:
        pass
    print(f"Connected to PostgreSQL database at {settings.POSTGRES_SERVER}:{settings.POSTGRES_PORT}")
except Exception as e:
    print(f"PostgreSQL server not available locally ({e}). Falling back to local backend/sai_academy.db database.")
    SQLITE_URL = "sqlite:///./backend/sai_academy.db"
    engine = create_engine(SQLITE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependency for database sessions
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
