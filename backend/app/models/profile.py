from datetime import datetime

from sqlalchemy import CheckConstraint, SmallInteger, Text, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Profile(Base):
    __tablename__ = "profile"
    __table_args__ = (CheckConstraint("id = 1", name="profile_singleton"),)

    id: Mapped[int] = mapped_column(SmallInteger, primary_key=True, default=1)
    name: Mapped[str] = mapped_column(Text)
    title: Mapped[str] = mapped_column(Text)
    tagline: Mapped[str] = mapped_column(Text, default="")
    location: Mapped[str] = mapped_column(Text, default="")
    email: Mapped[str] = mapped_column(Text, default="")
    phone: Mapped[str] = mapped_column(Text, default="")
    brand: Mapped[str] = mapped_column(Text, default="")
    status: Mapped[str] = mapped_column(Text, default="")
    summary: Mapped[str] = mapped_column(Text, default="")
    bio: Mapped[list] = mapped_column(JSONB, default=list)
    socials: Mapped[dict] = mapped_column(JSONB, default=dict)
    stats: Mapped[list] = mapped_column(JSONB, default=list)
    updated_at: Mapped[datetime] = mapped_column(
        server_default=func.now(), onupdate=func.now()
    )
