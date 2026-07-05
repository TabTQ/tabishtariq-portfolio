from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

ENV_FILE = Path(__file__).resolve().parents[2] / ".env"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=str(ENV_FILE), env_file_encoding="utf-8")

    postgres_host: str
    postgres_port: int = 5432
    postgres_db: str
    postgres_user: str
    postgres_password: str
    postgres_schema: str = "portfolio"

    cors_origins: str = "http://localhost:3000"

    jwt_secret: str
    jwt_expire_minutes: int = 720
    admin_cookie_name: str = "portfolio_admin"

    admin_username: str = ""
    admin_password: str = ""

    @property
    def database_url(self) -> str:
        from urllib.parse import quote_plus

        return (
            f"postgresql+psycopg://{quote_plus(self.postgres_user)}:"
            f"{quote_plus(self.postgres_password)}@{self.postgres_host}:"
            f"{self.postgres_port}/{self.postgres_db}"
        )

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
