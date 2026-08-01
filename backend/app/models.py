from fastapi_users.db import SQLAlchemyBaseUserTableUUID
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import Boolean, Column, String


class Base(DeclarativeBase):
    pass


class User(SQLAlchemyBaseUserTableUUID, Base):
    """User model.

    locale: ISO 639-1 two-letter language code (default en).
    is_guest: True for ephemeral guest accounts created via POST /auth/guest.
              Flipped to False on conversion (POST /auth/convert). The user id
              is preserved through conversion so any ContextRocket-side session
              context (threads, org bindings) keyed on this id survives intact.
    """

    locale = Column(String(5), nullable=False, default="en", server_default="en")
    is_guest = Column(Boolean, nullable=False, default=False, server_default="false")
