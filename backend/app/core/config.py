from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )

    # App
    PROJECT_NAME: str = "MentorBGITU"
    API_V1_PREFIX: str = "/api"
    DEBUG: bool = True

    # Security
    SECRET_KEY: str = "change-me"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7
    ALGORITHM: str = "HS256"

    # CORS — храним строкой, парсим в cors_origins (без JSON-декодинга pydantic)
    BACKEND_CORS_ORIGINS: str = "http://localhost:5173"

    # Database
    POSTGRES_USER: str = "mentor"
    POSTGRES_PASSWORD: str = "mentor"
    POSTGRES_DB: str = "mentorbgitu"
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432

    @property
    def cors_origins(self) -> list[str]:
        return [o.strip() for o in self.BACKEND_CORS_ORIGINS.split(",") if o.strip()]

    @property
    def database_url(self) -> str:
        return (
            f"postgresql+psycopg2://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )


@lru_cache
def get_settings() -> "Settings":
    return Settings()


settings = get_settings()
