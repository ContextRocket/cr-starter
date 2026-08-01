import uuid

from fastapi_users import schemas
from pydantic import BaseModel, field_validator

# Locale: two-letter language codes only (ISO 639-1, e.g. en, es, pt). Default is English.
SUPPORTED_LOCALES = ("en", "es", "pt")
DEFAULT_LOCALE = "en"


class UserRead(schemas.BaseUser[uuid.UUID]):
    locale: str = DEFAULT_LOCALE
    is_guest: bool = False


class UserCreate(schemas.BaseUserCreate):
    locale: str = DEFAULT_LOCALE


class UserUpdate(schemas.BaseUserUpdate):
    locale: str | None = None

    @field_validator("locale")
    @classmethod
    def locale_must_be_supported(cls, v: str | None) -> str | None:
        if v is None:
            return v
        if v not in SUPPORTED_LOCALES:
            raise ValueError(f"locale must be one of {SUPPORTED_LOCALES}")
        return v


class GuestTokenResponse(BaseModel):
    """Response from POST /auth/guest — same shape as JWT login."""

    access_token: str
    token_type: str = "bearer"


class ConvertRequest(BaseModel):
    """Payload for POST /auth/convert — upgrade a guest to a full account.

    The caller must already carry a valid guest Bearer JWT. The same user
    row is updated in-place so any ContextRocket-side session context
    (threads, org bindings, probe history) keyed on the user id is
    preserved without any data migration.
    """

    email: str
    password: str


class HealthResponse(BaseModel):
    status: str


class UserListItem(BaseModel):
    """A single user row for the operator user-list view.

    Intentionally minimal: id, email, is_guest, is_active.
    No sensitive fields (hashed_password, secrets) are included.
    """

    id: str
    email: str
    is_guest: bool
    is_active: bool


class UserListResponse(BaseModel):
    """Paginated user list for the operator dashboard."""

    total: int
    skip: int
    limit: int
    items: list[UserListItem]
