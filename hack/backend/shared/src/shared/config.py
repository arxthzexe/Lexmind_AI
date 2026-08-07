from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_env: str = "development"
    app_debug: bool = True
    app_host: str = "0.0.0.0"
    app_port: int = 80
    app_skip_infra: bool = False

    database_url: str = "postgresql+asyncpg://lexmind:lexmind_dev@postgres:5432/lexmind"
    neo4j_uri: str = "bolt://neo4j:7687"
    neo4j_user: str = "neo4j"
    neo4j_password: str = "lexmind_dev"
    qdrant_url: str = "http://qdrant:6333"
    minio_endpoint: str = "http://minio:9000"
    minio_root_user: str = "lexmind"
    minio_root_password: str = "lexmind_dev_strong"
    minio_bucket: str = "lexmind-docs"

    vllm_url: str = "http://vllm:8000/v1"
    llm_model: str = "mistralai/Mistral-7B-Instruct-v0.2"
    embedding_url: str = "http://embedding-service:8080"

    jwt_secret_key: str = "lexmind_dev_secret_change_in_prod"
    jwt_algorithm: str = "HS256"
    jwt_expiration_minutes: int = 60


settings = Settings()
