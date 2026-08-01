import warnings
from typing import Set

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # OpenAPI docs
    OPENAPI_URL: str = "/openapi.json"
    # Path where OpenAPI schema is generated (relative to backend/)
    # Frontend reads from same location (relative to frontend/)
    # Both resolve to: <project-root>/local-shared-data/openapi.json
    OPENAPI_OUTPUT_FILE: str = "../local-shared-data/openapi.json"

    # Database - ports 5452/5453 isolated from sibling context-rocket (5442/5443)
    DATABASE_URL: str = "postgresql+asyncpg://postgres:password@localhost:5452/app_db"
    TEST_DATABASE_URL: str = (
        "postgresql+asyncpg://postgres:password@localhost:5453/app_test_db"
    )
    EXPIRE_ON_COMMIT: bool = False

    # Connection pooling strategy
    # "null" - No pooling, new connection per request (serverless: Vercel, Lambda)
    # "queue" - Connection pool with reuse (traditional servers: Docker, VPS, Kubernetes)
    DATABASE_POOL_CLASS: str = "null"
    # QueuePool settings (ignored when using NullPool)
    DATABASE_POOL_SIZE: int = 5  # Number of connections to maintain
    DATABASE_MAX_OVERFLOW: int = 10  # Additional connections if pool exhausted
    DATABASE_POOL_RECYCLE: int = 3600  # Recycle connections after N seconds

    # User secrets - DEVELOPMENT DEFAULTS (MUST override in production!)
    ACCESS_SECRET_KEY: str = "dev-access-secret-CHANGE-IN-PRODUCTION-min-32-chars"
    RESET_PASSWORD_SECRET_KEY: str = (
        "dev-reset-secret-CHANGE-IN-PRODUCTION-min-32-chars"
    )
    VERIFICATION_SECRET_KEY: str = "dev-verify-secret-CHANGE-IN-PRODUCTION-min-32-chars"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_SECONDS: int = 3600
    # Guest sessions are short-lived (72h default). Configurable so operators
    # can tighten or relax the window without a code change.
    GUEST_TOKEN_LIFETIME_SECONDS: int = 72 * 3600

    # Email - Safe defaults for local development (uses MailHog on port 1026,
    # isolated from the sibling context-rocket project which uses 1025).
    MAIL_USERNAME: str | None = None
    MAIL_PASSWORD: str | None = None
    MAIL_FROM: str = "noreply@localhost"
    MAIL_SERVER: str = "localhost"
    MAIL_PORT: int = 1026
    MAIL_FROM_NAME: str = "ContextRocket Starter"
    MAIL_STARTTLS: bool = False
    MAIL_SSL_TLS: bool = False
    USE_CREDENTIALS: bool = False
    VALIDATE_CERTS: bool = False
    TEMPLATE_DIR: str = "email_templates"

    # Frontend — port 3100 is the template default; isolated from the sibling
    # context-rocket project (3000). Set in .env.example / compose for full
    # override, or keep the default for local development.
    FRONTEND_URL: str = "http://localhost:3100"

    # Backend base URL (this API). Port 8100 is the template default; isolated
    # from the sibling context-rocket project (8000).
    BACKEND_URL: str = "http://localhost:8100"

    # CORS - Safe default for local development (template ports 3100 / 8100)
    CORS_ORIGINS: Set[str] = {"http://localhost:3100", "http://localhost:8100"}

    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Warn if using development secrets in production-like environments
        if self.ACCESS_SECRET_KEY.startswith("dev-"):
            warnings.warn(
                "⚠️  WARNING: Using development secret keys! "
                "Set ACCESS_SECRET_KEY, RESET_PASSWORD_SECRET_KEY, and "
                "VERIFICATION_SECRET_KEY in production environment!",
                UserWarning,
                stacklevel=2,
            )


settings = Settings()
