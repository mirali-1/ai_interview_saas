import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Get DATABASE_URL from environment
DATABASE_URL = os.getenv("DATABASE_URL")

# Fallback for local development (SQLite)
if not DATABASE_URL:
    DATABASE_URL = "sqlite:///./test.db"

# Railway PostgreSQL requires SSL
connect_args = {}

if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
else:
    # PostgreSQL (Railway)
    connect_args = {"sslmode": "require"}

# Create engine
engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args
)

# Create session
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base class
Base = declarative_base()


# Dependency for FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()