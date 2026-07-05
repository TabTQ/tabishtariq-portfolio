from app.schemas.base import CamelModel


class LoginRequest(CamelModel):
    username: str
    password: str


class AdminInfo(CamelModel):
    username: str
