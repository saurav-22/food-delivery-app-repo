from sqlalchemy import Column, BigInteger, Text, Numeric, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import Mapped, mapped_column
from db import Base

class Restaurant(Base):
    __tablename__ = "restaurant_restaurants"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(Text, nullable=False)
    slug: Mapped[str] = mapped_column(Text, unique=True, nullable=False)
    cuisine: Mapped[str | None] = mapped_column(Text)
    rating: Mapped[float | None] = mapped_column(Numeric(2, 1))
    logo_key: Mapped[str] = mapped_column(Text, nullable=False)  # e.g., restaurants/kfc/logo.jpg
    address_json: Mapped[dict | None] = mapped_column(JSON)
    created_at: Mapped[str] = mapped_column(server_default=func.now())
    updated_at: Mapped[str] = mapped_column(server_default=func.now(), onupdate=func.now())
