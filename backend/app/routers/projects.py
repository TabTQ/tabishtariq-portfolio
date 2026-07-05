from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.crud.instances import deliverable_crud, project_crud
from app.db.session import get_db
from app.deps import get_current_admin
from app.models import Project, ProjectCaseStudy
from app.schemas.project import (
    CaseStudyRead,
    CaseStudyUpsert,
    DeliverableCreate,
    DeliverableRead,
    DeliverableUpdate,
    ProjectCreate,
    ProjectRead,
    ProjectUpdate,
)

router = APIRouter(prefix="/api/projects", tags=["projects"])
admin_router = APIRouter(
    prefix="/api/admin/projects", tags=["admin"], dependencies=[Depends(get_current_admin)]
)


@router.get("", response_model=list[ProjectRead])
def list_projects(kind: str | None = None, db: Session = Depends(get_db)):
    stmt = (
        select(Project)
        .options(selectinload(Project.case_study), selectinload(Project.deliverables))
        .order_by(Project.sort_order, Project.id)
    )
    if kind:
        stmt = stmt.where(Project.kind == kind)
    return list(db.scalars(stmt))


@router.get("/{slug}", response_model=ProjectRead)
def get_project(slug: str, db: Session = Depends(get_db)):
    stmt = (
        select(Project)
        .options(selectinload(Project.case_study), selectinload(Project.deliverables))
        .where(Project.slug == slug)
    )
    project = db.scalar(stmt)
    if not project:
        raise HTTPException(404, "Project not found")
    return project


@admin_router.post("", response_model=ProjectRead)
def create_project(body: ProjectCreate, db: Session = Depends(get_db)):
    return project_crud.create(db, body)


@admin_router.put("/{id}", response_model=ProjectRead)
def update_project(id: int, body: ProjectUpdate, db: Session = Depends(get_db)):
    project = project_crud.get(db, id)
    if not project:
        raise HTTPException(404, "Project not found")
    return project_crud.update(db, project, body)


@admin_router.delete("/{id}")
def delete_project(id: int, db: Session = Depends(get_db)):
    project = project_crud.get(db, id)
    if not project:
        raise HTTPException(404, "Project not found")
    project_crud.remove(db, project)
    return {"ok": True}


@admin_router.put("/{id}/case-study", response_model=CaseStudyRead)
def upsert_case_study(id: int, body: CaseStudyUpsert, db: Session = Depends(get_db)):
    project = project_crud.get(db, id)
    if not project:
        raise HTTPException(404, "Project not found")
    cs = project.case_study
    if not cs:
        cs = ProjectCaseStudy(project_id=id)
        db.add(cs)
    for field, value in body.model_dump().items():
        setattr(cs, field, value)
    db.commit()
    db.refresh(cs)
    return cs


@admin_router.post("/{id}/deliverables", response_model=DeliverableRead)
def create_deliverable(id: int, body: DeliverableCreate, db: Session = Depends(get_db)):
    if not project_crud.get(db, id):
        raise HTTPException(404, "Project not found")
    data = body.model_dump()
    obj = deliverable_crud.model(**data, project_id=id)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@admin_router.put("/{id}/deliverables/{deliverable_id}", response_model=DeliverableRead)
def update_deliverable(
    id: int, deliverable_id: int, body: DeliverableUpdate, db: Session = Depends(get_db)
):
    obj = deliverable_crud.get(db, deliverable_id)
    if not obj or obj.project_id != id:
        raise HTTPException(404, "Deliverable not found")
    return deliverable_crud.update(db, obj, body)


@admin_router.delete("/{id}/deliverables/{deliverable_id}")
def delete_deliverable(id: int, deliverable_id: int, db: Session = Depends(get_db)):
    obj = deliverable_crud.get(db, deliverable_id)
    if not obj or obj.project_id != id:
        raise HTTPException(404, "Deliverable not found")
    deliverable_crud.remove(db, obj)
    return {"ok": True}
