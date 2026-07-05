from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.deps import get_current_admin
from app.models import Profile
from app.schemas.profile import ProfileRead, ProfileUpdate

router = APIRouter(prefix="/api/profile", tags=["profile"])
admin_router = APIRouter(
    prefix="/api/admin/profile", tags=["admin"], dependencies=[Depends(get_current_admin)]
)


@router.get("", response_model=ProfileRead)
def get_profile(db: Session = Depends(get_db)):
    profile = db.get(Profile, 1)
    if not profile:
        raise HTTPException(404, "Profile not seeded")
    return profile


@admin_router.put("", response_model=ProfileRead)
def update_profile(body: ProfileUpdate, db: Session = Depends(get_db)):
    profile = db.get(Profile, 1)
    if not profile:
        profile = Profile(id=1)
        db.add(profile)
    for field, value in body.model_dump().items():
        setattr(profile, field, value)
    db.commit()
    db.refresh(profile)
    return profile
