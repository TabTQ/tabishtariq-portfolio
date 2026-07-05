from app.schemas.base import CamelModel


class ProfileBase(CamelModel):
    name: str
    title: str
    tagline: str = ""
    location: str = ""
    email: str = ""
    phone: str = ""
    brand: str = ""
    status: str = ""
    summary: str = ""
    bio: list[str] = []
    socials: dict = {}
    stats: list[dict] = []


class ProfileRead(ProfileBase):
    pass


class ProfileUpdate(ProfileBase):
    pass
