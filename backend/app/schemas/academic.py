from app.schemas.base import CamelModel


class AcademicBase(CamelModel):
    type: str  # 'Degree' | 'Publication' | 'Certification'
    title: str
    institution: str
    date: str = ""
    description: str | None = None
    url: str | None = None
    sort_order: int = 0


class AcademicCreate(AcademicBase):
    pass


class AcademicUpdate(AcademicBase):
    pass


class AcademicRead(AcademicBase):
    id: int
