"""Guest authentication and conversion routes.

POST /auth/guest   — create an ephemeral guest account and return a short-lived JWT.
POST /auth/convert — upgrade the caller's guest account to a permanent account.

Design decision — dedicated routes vs. fastapi-users hooks
----------------------------------------------------------
We use two plain FastAPI routes instead of overriding fastapi-users' register
hook.  The hook approach would require intercepting `on_after_register` to
detect an incoming guest JWT and re-key the session, which is fragile:
fastapi-users creates a NEW user row on every register call, making it
impossible to "flip" the guest row without a separate reconciliation step.

A dedicated POST /auth/convert route is cleaner:
  1. It accepts the guest Bearer JWT via standard auth dependency.
  2. It updates that SAME user row (email + hashed_password + is_guest=False).
  3. The user id is unchanged, so any ContextRocket-side session context
     (threads, org bindings, probe history) keyed on the user id survives
     without any data migration or re-binding.
"""

import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi_users.db import SQLAlchemyUserDatabase
from fastapi_users.password import PasswordHelper

from app.config import settings
from app.database import get_user_db
from app.models import User
from app.schemas import ConvertRequest, GuestTokenResponse, UserRead
from app.users import current_active_user, get_jwt_strategy

router = APIRouter(prefix="/auth", tags=["auth"])

_password_helper = PasswordHelper()


def _guest_email(user_id: uuid.UUID) -> str:
    """Generate a deterministic, obviously-unusable email for a guest account.

    Uses .example TLD (RFC 2606 reserved) so the address is syntactically
    valid for Pydantic's email validator but will never route to a real mailbox.
    Avoid .local (mDNS reserved) and .invalid (triggers validation errors in
    email-strict parsers).
    """
    return f"guest-{user_id}@guest.example"


@router.post(
    "/guest", response_model=GuestTokenResponse, status_code=status.HTTP_201_CREATED
)
async def create_guest(
    user_db: SQLAlchemyUserDatabase = Depends(get_user_db),
) -> GuestTokenResponse:
    """Create an ephemeral guest account and return a short-lived Bearer JWT.

    The generated email (guest-<uuid>@guest.example) is intentionally unusable
    for login.  The hashed password is a random UUID — also not usable.
    is_guest=True marks the account for conversion.

    The JWT lifetime is controlled by GUEST_TOKEN_LIFETIME_SECONDS (default 72h).
    """
    user_id = uuid.uuid4()
    user = await user_db.create(
        {
            "id": user_id,
            "email": _guest_email(user_id),
            "hashed_password": _password_helper.hash(str(uuid.uuid4())),
            "is_active": True,
            "is_superuser": False,
            "is_verified": False,
            "is_guest": True,
        }
    )

    # Issue a short-lived token using the same JWT strategy as regular login,
    # but with the guest lifetime override.
    strategy = get_jwt_strategy()
    # Temporarily swap lifetime for guest tokens.
    strategy.lifetime_seconds = settings.GUEST_TOKEN_LIFETIME_SECONDS
    token = await strategy.write_token(user)

    return GuestTokenResponse(access_token=token, token_type="bearer")


@router.post("/convert", response_model=UserRead)
async def convert_guest(
    body: ConvertRequest,
    current_user: User = Depends(current_active_user),
    user_db: SQLAlchemyUserDatabase = Depends(get_user_db),
) -> User:
    """Convert a guest account to a permanent account.

    The caller must present a valid guest Bearer JWT.  The SAME user row is
    updated in-place (email + hashed_password + is_guest=False) so the user id
    is preserved and any ContextRocket-side session context survives intact.

    Raises 400 if the caller is already a permanent (non-guest) account.
    Raises 400 if the requested email is already taken by another user.
    """
    if not current_user.is_guest:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ERROR_ALREADY_CONVERTED",
        )

    # Check email uniqueness before mutating.
    existing = await user_db.get_by_email(body.email)
    if existing is not None and existing.id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="ERROR_EMAIL_ALREADY_EXISTS",
        )

    update_dict = {
        "email": body.email,
        "hashed_password": _password_helper.hash(body.password),
        "is_guest": False,
        "is_active": True,
    }
    updated = await user_db.update(current_user, update_dict)
    return updated
