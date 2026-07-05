from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.deps import get_current_admin
from app.models import Diagram, HomelabContainer, HomelabDevice
from app.schemas.diagram import DiagramRead, DiagramSpec, DiagramUpsert

router = APIRouter(prefix="/api/diagrams", tags=["diagrams"])
admin_router = APIRouter(
    prefix="/api/admin/diagrams", tags=["admin"], dependencies=[Depends(get_current_admin)]
)


def _proxmox_container_nodes(db: Session) -> tuple[list[dict], list[dict]]:
    """Derive one node + edge per Proxmox LXC container so new DB rows appear
    on the diagram automatically (this derivation used to live in diagrams.ts)."""
    device = db.scalar(select(HomelabDevice).where(HomelabDevice.category == "proxmox"))
    if not device:
        return [], []
    containers = db.scalars(
        select(HomelabContainer)
        .where(HomelabContainer.device_id == device.id)
        .order_by(HomelabContainer.sort_order, HomelabContainer.id)
    )
    nodes, edges = [], []
    for c in containers:
        nodes.append(
            {
                "id": c.container_key,
                "kind": "service",
                "label": c.name,
                "sublabel": f"{c.container_key.upper()} · {c.purpose or ''}".strip(" ·"),
                "icon": "Box",
                "route": f"#{c.container_key}",
                "accent": "gold" if c.status == "Idle" else "sage",
            }
        )
        edges.append({"id": f"pe-{c.container_key}", "source": "host", "target": c.container_key})
    return nodes, edges


@router.get("/{key}", response_model=DiagramSpec)
def get_diagram(key: str, db: Session = Depends(get_db)):
    diagram = db.scalar(select(Diagram).where(Diagram.diagram_key == key))
    if not diagram:
        raise HTTPException(404, "Diagram not found")
    nodes = list(diagram.nodes)
    edges = list(diagram.edges)
    if key == "proxmox":
        extra_nodes, extra_edges = _proxmox_container_nodes(db)
        nodes.extend(extra_nodes)
        edges.extend(extra_edges)
    # Drop edges that reference missing nodes so a stale DB edit can't break layout.
    node_ids = {n["id"] for n in nodes}
    edges = [e for e in edges if e["source"] in node_ids and e["target"] in node_ids]
    return DiagramSpec(direction=diagram.direction, nodes=nodes, edges=edges)


@admin_router.get("", response_model=list[DiagramRead])
def list_diagrams(db: Session = Depends(get_db)):
    return list(db.scalars(select(Diagram).order_by(Diagram.diagram_key)))


@admin_router.put("/{key}", response_model=DiagramRead)
def upsert_diagram(key: str, body: DiagramUpsert, db: Session = Depends(get_db)):
    diagram = db.scalar(select(Diagram).where(Diagram.diagram_key == key))
    if not diagram:
        diagram = Diagram(diagram_key=key)
        db.add(diagram)
    diagram.direction = body.direction
    diagram.nodes = body.nodes
    diagram.edges = body.edges
    db.commit()
    db.refresh(diagram)
    return diagram


@admin_router.delete("/{key}")
def delete_diagram(key: str, db: Session = Depends(get_db)):
    diagram = db.scalar(select(Diagram).where(Diagram.diagram_key == key))
    if not diagram:
        raise HTTPException(404, "Diagram not found")
    db.delete(diagram)
    db.commit()
    return {"ok": True}
