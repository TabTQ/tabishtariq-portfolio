from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.crud.instances import skill_crud, skill_group_crud
from app.db.session import get_db
from app.deps import get_current_admin
from app.models import SkillGroup
from app.schemas.skill import (
    SkillCreate,
    SkillGroupCreate,
    SkillGroupPublic,
    SkillGroupRead,
    SkillGroupUpdate,
    SkillRead,
    SkillUpdate,
)

router = APIRouter(prefix="/api/skills", tags=["skills"])
admin_router = APIRouter(
    prefix="/api/admin", tags=["admin"], dependencies=[Depends(get_current_admin)]
)


@router.get("", response_model=list[SkillGroupPublic])
def list_skills(db: Session = Depends(get_db)):
    stmt = (
        select(SkillGroup)
        .options(selectinload(SkillGroup.skills))
        .order_by(SkillGroup.sort_order, SkillGroup.id)
    )
    groups = db.scalars(stmt)
    return [
        SkillGroupPublic(
            category=g.category,
            icon=g.icon,
            skills=[s.label for s in g.skills],
        )
        for g in groups
    ]


@admin_router.get("/skill-groups", response_model=list[SkillGroupRead])
def list_skill_groups(db: Session = Depends(get_db)):
    stmt = (
        select(SkillGroup)
        .options(selectinload(SkillGroup.skills))
        .order_by(SkillGroup.sort_order, SkillGroup.id)
    )
    return list(db.scalars(stmt))


@admin_router.post("/skill-groups", response_model=SkillGroupRead)
def create_skill_group(body: SkillGroupCreate, db: Session = Depends(get_db)):
    return skill_group_crud.create(db, body)


@admin_router.put("/skill-groups/{id}", response_model=SkillGroupRead)
def update_skill_group(id: int, body: SkillGroupUpdate, db: Session = Depends(get_db)):
    group = skill_group_crud.get(db, id)
    if not group:
        raise HTTPException(404, "Skill group not found")
    return skill_group_crud.update(db, group, body)


@admin_router.delete("/skill-groups/{id}")
def delete_skill_group(id: int, db: Session = Depends(get_db)):
    group = skill_group_crud.get(db, id)
    if not group:
        raise HTTPException(404, "Skill group not found")
    skill_group_crud.remove(db, group)
    return {"ok": True}


@admin_router.get("/skills", response_model=list[SkillRead])
def list_all_skills(db: Session = Depends(get_db)):
    return skill_crud.get_multi(db)


@admin_router.post("/skills", response_model=SkillRead)
def create_skill(body: SkillCreate, db: Session = Depends(get_db)):
    return skill_crud.create(db, body)


@admin_router.put("/skills/{id}", response_model=SkillRead)
def update_skill(id: int, body: SkillUpdate, db: Session = Depends(get_db)):
    skill = skill_crud.get(db, id)
    if not skill:
        raise HTTPException(404, "Skill not found")
    return skill_crud.update(db, skill, body)


@admin_router.delete("/skills/{id}")
def delete_skill(id: int, db: Session = Depends(get_db)):
    skill = skill_crud.get(db, id)
    if not skill:
        raise HTTPException(404, "Skill not found")
    skill_crud.remove(db, skill)
    return {"ok": True}
