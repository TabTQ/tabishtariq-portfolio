from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.security import create_session_token, verify_password
from app.db.session import get_db
from app.deps import get_current_admin
from app.models import AdminUser
from app.schemas.auth import AdminInfo, LoginRequest

router = APIRouter(prefix="/api/admin", tags=["auth"])


@router.post("/login", response_model=AdminInfo)
def login(body: LoginRequest, response: Response, db: Session = Depends(get_db)):
    admin = db.scalar(select(AdminUser).where(AdminUser.username == body.username))
    if not admin or not verify_password(body.password, admin.password_hash):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid credentials")
    settings = get_settings()
    token = create_session_token(admin.username)
    response.set_cookie(
        key=settings.admin_cookie_name,
        value=token,
        httponly=True,
        samesite="lax",
        max_age=settings.jwt_expire_minutes * 60,
        path="/",
    )
    return AdminInfo(username=admin.username)


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(get_settings().admin_cookie_name, path="/")
    return {"ok": True}


@router.get("/me", response_model=AdminInfo)
def me(admin: AdminUser = Depends(get_current_admin)):
    return AdminInfo(username=admin.username)
