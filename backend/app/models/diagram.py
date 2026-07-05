from datetime import datetime

from sqlalchemy import Integer, Text, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Diagram(Base):
    __tablename__ = "diagrams"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    diagram_key: Mapped[str] = mapped_column(Text, unique=True, index=True)
    direction: Mapped[str] = mapped_column(Text, default="TB")  # 'TB' | 'LR'
    nodes: Mapped[list] = mapped_column(JSONB, default=list)
    edges: Mapped[list] = mapped_column(JSONB, default=list)
    updated_at: Mapped[datetime] = mapped_column(
        server_default=func.now(), onupdate=func.now()
    )
