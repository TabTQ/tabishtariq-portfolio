from sqlalchemy import MetaData
from sqlalchemy.orm import DeclarativeBase

from app.core.config import get_settings

# Every table this app owns lives inside this one existing schema; nothing is
# ever created in `public` or any other schema.
SCHEMA = get_settings().postgres_schema


class Base(DeclarativeBase):
    metadata = MetaData(schema=SCHEMA)
