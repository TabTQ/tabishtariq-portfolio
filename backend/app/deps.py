from fastapi import Cookie, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.security import decode_session_token
from app.db.session import get_db
from app.models import AdminUser


def get_current_admin(
    db: Session = Depends(get_db),
    session_token: str | None = Cookie(default=None, alias=get_settings().admin_cookie_name),
) -> AdminUser:
    if not session_token:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Not authenticated")
    username = decode_session_token(session_token)
    if not username:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid or expired session")
    admin = db.scalar(select(AdminUser).where(AdminUser.username == username))
    if not admin:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Unknown admin user")
    return admin
