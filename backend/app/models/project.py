from datetime import datetime

from sqlalchemy import ForeignKey, Integer, Text, UniqueConstraint, func
from sqlalchemy.dialects.postgresql import ARRAY, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    slug: Mapped[str] = mapped_column(Text, unique=True, index=True)
    kind: Mapped[str] = mapped_column(Text)  # 'flagship' | 'small'
    title: Mapped[str] = mapped_column(Text)
    description: Mapped[str] = mapped_column(Text, default="")
    tags: Mapped[list[str]] = mapped_column(ARRAY(Text), default=list)
    repo_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    live_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    type: Mapped[str | None] = mapped_column(Text, nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        server_default=func.now(), onupdate=func.now()
    )

    case_study: Mapped["ProjectCaseStudy | None"] = relationship(
        back_populates="project", cascade="all, delete-orphan", uselist=False
    )
    deliverables: Mapped[list["ProjectDeliverable"]] = relationship(
        back_populates="project",
        cascade="all, delete-orphan",
        order_by="ProjectDeliverable.sort_order",
    )


class ProjectCaseStudy(Base):
    __tablename__ = "project_case_studies"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    project_id: Mapped[int] = mapped_column(
        ForeignKey("projects.id", ondelete="CASCADE"), unique=True
    )
    client: Mapped[str | None] = mapped_column(Text, nullable=True)
    role: Mapped[str | None] = mapped_column(Text, nullable=True)
    duration: Mapped[str | None] = mapped_column(Text, nullable=True)
    context: Mapped[str | None] = mapped_column(Text, nullable=True)
    platform: Mapped[list[str]] = mapped_column(ARRAY(Text), default=list)
    metrics: Mapped[list] = mapped_column(JSONB, default=list)
    layers: Mapped[list] = mapped_column(JSONB, default=list)
    tech_stack: Mapped[list] = mapped_column(JSONB, default=list)

    project: Mapped[Project] = relationship(back_populates="case_study")


class ProjectDeliverable(Base):
    __tablename__ = "project_deliverables"
    __table_args__ = (
        UniqueConstraint("project_id", "deliverable_key", name="uq_project_deliverable"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    project_id: Mapped[int] = mapped_column(
        ForeignKey("projects.id", ondelete="CASCADE")
    )
    deliverable_key: Mapped[str] = mapped_column(Text)
    title: Mapped[str] = mapped_column(Text)
    tag: Mapped[str] = mapped_column(Text, default="")
    body: Mapped[str] = mapped_column(Text, default="")
    sort_order: Mapped[int] = mapped_column(Integer, default=0)

    project: Mapped[Project] = relationship(back_populates="deliverables")
