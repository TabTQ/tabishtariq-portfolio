from app.schemas.base import CamelModel


class ExperienceBase(CamelModel):
    slug: str
    role: str
    company: str
    client: str | None = None
    duration: str = ""
    location: str | None = None
    summary: str = ""
    skills: list[str] = []
    highlights: list[str] = []
    sort_order: int = 0


class ExperienceCreate(ExperienceBase):
    pass


class ExperienceUpdate(ExperienceBase):
    pass


class ExperienceRead(ExperienceBase):
    id: int
