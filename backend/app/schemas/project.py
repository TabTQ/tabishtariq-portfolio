from app.schemas.base import CamelModel


class CaseStudyBase(CamelModel):
    client: str | None = None
    role: str | None = None
    duration: str | None = None
    context: str | None = None
    platform: list[str] = []
    metrics: list[dict] = []
    layers: list[dict] = []
    tech_stack: list[dict] = []


class CaseStudyRead(CaseStudyBase):
    id: int


class CaseStudyUpsert(CaseStudyBase):
    pass


class DeliverableBase(CamelModel):
    deliverable_key: str
    title: str
    tag: str = ""
    body: str = ""
    sort_order: int = 0


class DeliverableCreate(DeliverableBase):
    pass


class DeliverableUpdate(DeliverableBase):
    pass


class DeliverableRead(DeliverableBase):
    id: int
    project_id: int


class ProjectBase(CamelModel):
    slug: str
    kind: str  # 'flagship' | 'small'
    title: str
    description: str = ""
    tags: list[str] = []
    repo_url: str | None = None
    live_url: str | None = None
    type: str | None = None
    sort_order: int = 0


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(ProjectBase):
    pass


class ProjectRead(ProjectBase):
    id: int
    case_study: CaseStudyRead | None = None
    deliverables: list[DeliverableRead] = []
