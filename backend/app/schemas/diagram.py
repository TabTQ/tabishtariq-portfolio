from app.schemas.base import CamelModel


class DiagramBase(CamelModel):
    diagram_key: str
    direction: str = "TB"  # 'TB' | 'LR'
    nodes: list[dict] = []
    edges: list[dict] = []


class DiagramUpsert(DiagramBase):
    pass


class DiagramRead(DiagramBase):
    id: int


class DiagramSpec(CamelModel):
    """The shape the frontend SystemMap consumes."""

    direction: str
    nodes: list[dict]
    edges: list[dict]
