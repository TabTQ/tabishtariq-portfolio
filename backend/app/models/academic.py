from sqlalchemy import Integer, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class AcademicItem(Base):
    __tablename__ = "academic_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    type: Mapped[str] = mapped_column(Text)  # 'Degree' | 'Publication' | 'Certification'
    title: Mapped[str] = mapped_column(Text)
    institution: Mapped[str] = mapped_column(Text)
    date: Mapped[str] = mapped_column(Text, default="")
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    url: Mapped[str | None] = mapped_column(Text, nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
