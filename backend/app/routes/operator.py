"""Operator-only routes.

These routes require is_superuser=True.  They expose minimal management
surfaces for the dashboard operator view (user list).  The backend does not
expose bulk-action or destructive admin endpoints; those are out of scope.

GET /operator/users  -- paginated list of users (id, email, is_guest, is_active).
"""

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_async_session
from app.models import User
from app.schemas import UserListItem, UserListResponse
from app.users import fastapi_users

router = APIRouter(prefix="/operator", tags=["operator"])

# Only superusers may call operator endpoints.
current_superuser = fastapi_users.current_user(active=True, superuser=True)


@router.get(
    "/users",
    response_model=UserListResponse,
    dependencies=[Depends(current_superuser)],
)
async def list_users(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=200),
    session: AsyncSession = Depends(get_async_session),
) -> UserListResponse:
    """Return a paginated list of users for operator review.

    Only accessible to superusers.  Returns id, email, is_guest, and
    is_active.  No sensitive fields (hashed_password, etc.) are exposed.
    """
    total_result = await session.execute(select(func.count(User.id)))
    total = total_result.scalar_one()

    rows_result = await session.execute(select(User).offset(skip).limit(limit))
    users = list(rows_result.scalars().all())

    return UserListResponse(
        total=total,
        skip=skip,
        limit=limit,
        items=[
            UserListItem(
                id=str(user.id),
                email=user.email,
                is_guest=user.is_guest,
                is_active=user.is_active,
            )
            for user in users
        ],
    )
