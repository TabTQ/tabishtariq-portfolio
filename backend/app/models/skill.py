from sqlalchemy import ForeignKey, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class SkillGroup(Base):
    __tablename__ = "skill_groups"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    category: Mapped[str] = mapped_column(Text)
    icon: Mapped[str] = mapped_column(Text, default="")
    sort_order: Mapped[int] = mapped_column(Integer, default=0)

    skills: Mapped[list["Skill"]] = relationship(
        back_populates="group", cascade="all, delete-orphan", order_by="Skill.sort_order"
    )


class Skill(Base):
    __tablename__ = "skills"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    group_id: Mapped[int] = mapped_column(
        ForeignKey("skill_groups.id", ondelete="CASCADE")
    )
    label: Mapped[str] = mapped_column(Text)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)

    group: Mapped[SkillGroup] = relationship(back_populates="skills")
