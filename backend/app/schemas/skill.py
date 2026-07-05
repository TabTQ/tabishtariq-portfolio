from app.schemas.base import CamelModel


class SkillBase(CamelModel):
    group_id: int
    label: str
    sort_order: int = 0


class SkillCreate(SkillBase):
    pass


class SkillUpdate(SkillBase):
    pass


class SkillRead(SkillBase):
    id: int


class SkillGroupBase(CamelModel):
    category: str
    icon: str = ""
    sort_order: int = 0


class SkillGroupCreate(SkillGroupBase):
    pass


class SkillGroupUpdate(SkillGroupBase):
    pass


class SkillGroupRead(SkillGroupBase):
    id: int
    skills: list[SkillRead] = []


class SkillGroupPublic(CamelModel):
    """Matches the frontend's existing SkillGroup shape: skills as plain labels."""

    category: str
    icon: str = ""
    skills: list[str] = []
