"""Tests for operator-only routes.

Covers:
  - GET /operator/users requires superuser (returns 401 for anonymous, 403 for
    non-superuser)
  - GET /operator/users returns paginated user list for superusers
  - Response includes expected fields (id, email, is_guest, is_active)
  - Pagination parameters (skip, limit) are respected
"""

import uuid

import pytest
from fastapi import status
from fastapi_users.password import PasswordHelper

from app.models import User
from app.users import get_jwt_strategy


def _make_user(**kwargs) -> dict:
    defaults = {
        "id": uuid.uuid4(),
        "email": "user@example.com",
        "hashed_password": PasswordHelper().hash("TestPassword123!"),
        "is_active": True,
        "is_superuser": False,
        "is_verified": True,
        "is_guest": False,
    }
    defaults.update(kwargs)
    return defaults


async def _create_user(db_session, **kwargs) -> User:
    data = _make_user(**kwargs)
    user = User(**data)
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)
    return user


async def _token_for(user: User) -> str:
    strategy = get_jwt_strategy()
    return await strategy.write_token(user)


class TestOperatorUsersAnonymous:
    @pytest.mark.asyncio(loop_scope="function")
    async def test_anonymous_rejected(self, test_client):
        """GET /operator/users without auth returns 401."""
        resp = await test_client.get("/operator/users")
        assert resp.status_code == status.HTTP_401_UNAUTHORIZED


class TestOperatorUsersNonSuperuser:
    @pytest.mark.asyncio(loop_scope="function")
    async def test_non_superuser_rejected(self, test_client, db_session):
        """GET /operator/users with a normal (non-superuser) JWT returns 403."""
        user = await _create_user(
            db_session, email="normal@example.com", is_superuser=False
        )
        token = await _token_for(user)
        resp = await test_client.get(
            "/operator/users", headers={"Authorization": f"Bearer {token}"}
        )
        assert resp.status_code == status.HTTP_403_FORBIDDEN


class TestOperatorUsersList:
    @pytest.mark.asyncio(loop_scope="function")
    async def test_superuser_gets_list(self, test_client, db_session):
        """Superuser can fetch the user list."""
        admin = await _create_user(
            db_session, email="admin@example.com", is_superuser=True
        )
        token = await _token_for(admin)
        resp = await test_client.get(
            "/operator/users", headers={"Authorization": f"Bearer {token}"}
        )
        assert resp.status_code == status.HTTP_200_OK
        data = resp.json()
        assert "items" in data
        assert "total" in data

    @pytest.mark.asyncio(loop_scope="function")
    async def test_response_fields(self, test_client, db_session):
        """Each item in the list has the expected fields."""
        admin = await _create_user(
            db_session, email="admin2@example.com", is_superuser=True
        )
        await _create_user(db_session, email="regular@example.com")
        token = await _token_for(admin)
        resp = await test_client.get(
            "/operator/users", headers={"Authorization": f"Bearer {token}"}
        )
        assert resp.status_code == status.HTTP_200_OK
        item = resp.json()["items"][0]
        assert "id" in item
        assert "email" in item
        assert "is_guest" in item
        assert "is_active" in item
        # Sensitive fields must not be present
        assert "hashed_password" not in item

    @pytest.mark.asyncio(loop_scope="function")
    async def test_guest_flag_shown(self, test_client, db_session):
        """is_guest is correctly reflected in the operator list."""
        admin = await _create_user(
            db_session, email="admin3@example.com", is_superuser=True
        )
        await _create_user(
            db_session,
            email="guest-abc@guest.example",
            is_guest=True,
        )
        token = await _token_for(admin)
        resp = await test_client.get(
            "/operator/users", headers={"Authorization": f"Bearer {token}"}
        )
        items = resp.json()["items"]
        guest_items = [i for i in items if i["is_guest"]]
        assert len(guest_items) >= 1

    @pytest.mark.asyncio(loop_scope="function")
    async def test_pagination_limit(self, test_client, db_session):
        """limit parameter caps the number of returned items."""
        admin = await _create_user(
            db_session, email="admin4@example.com", is_superuser=True
        )
        # Create 3 extra users
        for i in range(3):
            await _create_user(db_session, email=f"extra{i}@example.com")
        token = await _token_for(admin)
        resp = await test_client.get(
            "/operator/users?limit=2",
            headers={"Authorization": f"Bearer {token}"},
        )
        assert resp.status_code == status.HTTP_200_OK
        data = resp.json()
        assert len(data["items"]) <= 2
        assert data["total"] >= 4  # admin + 3 extras
