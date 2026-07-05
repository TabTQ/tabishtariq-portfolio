from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.crud.instances import experience_crud
from app.db.session import get_db
from app.deps import get_current_admin
from app.models import Experience
from app.schemas.experience import ExperienceCreate, ExperienceRead, ExperienceUpdate

router = APIRouter(prefix="/api/experiences", tags=["experiences"])
admin_router = APIRouter(
    prefix="/api/admin/experiences", tags=["admin"], dependencies=[Depends(get_current_admin)]
)


@router.get("", response_model=list[ExperienceRead])
def list_experiences(db: Session = Depends(get_db)):
    return experience_crud.get_multi(db)


@router.get("/{slug}", response_model=ExperienceRead)
def get_experience(slug: str, db: Session = Depends(get_db)):
    exp = db.scalar(select(Experience).where(Experience.slug == slug))
    if not exp:
        raise HTTPException(404, "Experience not found")
    return exp


@admin_router.post("", response_model=ExperienceRead)
def create_experience(body: ExperienceCreate, db: Session = Depends(get_db)):
    return experience_crud.create(db, body)


@admin_router.put("/{id}", response_model=ExperienceRead)
def update_experience(id: int, body: ExperienceUpdate, db: Session = Depends(get_db)):
    exp = experience_crud.get(db, id)
    if not exp:
        raise HTTPException(404, "Experience not found")
    return experience_crud.update(db, exp, body)


@admin_router.delete("/{id}")
def delete_experience(id: int, db: Session = Depends(get_db)):
    exp = experience_crud.get(db, id)
    if not exp:
        raise HTTPException(404, "Experience not found")
    experience_crud.remove(db, exp)
    return {"ok": True}
