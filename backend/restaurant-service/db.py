from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session, DeclarativeBase
from sqlalchemy.pool import NullPool
from config import get_db_url

class Base(DeclarativeBase):
    pass

# Use NullPool to avoid lingering connections in short-lived scripts/seeders.
engine = create_engine(get_db_url(), poolclass=NullPool, future=True)
SessionLocal = scoped_session(sessionmaker(bind=engine, autoflush=False, autocommit=False))