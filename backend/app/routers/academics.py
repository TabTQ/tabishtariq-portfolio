from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.crud.instances import academic_crud
from app.db.session import get_db
from app.deps import get_current_admin
from app.models import AcademicItem
from app.schemas.academic import AcademicCreate, AcademicRead, AcademicUpdate

router = APIRouter(prefix="/api/academics", tags=["academics"])
admin_router = APIRouter(
    prefix="/api/admin/academics", tags=["admin"], dependencies=[Depends(get_current_admin)]
)


@router.get("", response_model=list[AcademicRead])
def list_academics(type: str | None = None, db: Session = Depends(get_db)):
    stmt = select(AcademicItem).order_by(AcademicItem.sort_order, AcademicItem.id)
    if type:
        stmt = stmt.where(AcademicItem.type == type)
    return list(db.scalars(stmt))


@admin_router.post("", response_model=AcademicRead)
def create_academic(body: AcademicCreate, db: Session = Depends(get_db)):
    return academic_crud.create(db, body)


@admin_router.put("/{id}", response_model=AcademicRead)
def update_academic(id: int, body: AcademicUpdate, db: Session = Depends(get_db)):
    item = academic_crud.get(db, id)
    if not item:
        raise HTTPException(404, "Academic item not found")
    return academic_crud.update(db, item, body)


@admin_router.delete("/{id}")
def delete_academic(id: int, db: Session = Depends(get_db)):
    item = academic_crud.get(db, id)
    if not item:
        raise HTTPException(404, "Academic item not found")
    academic_crud.remove(db, item)
    return {"ok": True}
