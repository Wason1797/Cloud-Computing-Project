from functools import lru_cache


from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    AZURE_DATABASE_URL: str
    MAIL_USERNAME: str
    MAIL_PASSWORD: str
    MAIL_FROM: str
    MAIL_PORT: int
    MAIL_SERVER: str

    model_config = SettingsConfigDict(env_file=".env")

    def get_db_url(self) -> str:
        return f"postgresql+asyncpg://{self.AZURE_DATABASE_URL}/webshopdb"


@lru_cache
def get_settings() -> Settings:
    return Settings()
