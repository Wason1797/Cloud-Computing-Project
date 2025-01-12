from fastapi import FastAPI
from .repositories.postgres.connector import PostgreSQLDBConnector
from .routes import products_router
from .config.env_manager import get_settings

EnvManager = get_settings()


app = FastAPI()
PostgreSQLDBConnector.init_db(EnvManager.get_db_url())

app.include_router(products_router)
