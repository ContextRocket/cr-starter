"""Tests for guest creation and conversion routes (P3).

Covers:
  - POST /auth/guest returns access_token + is_guest claim
  - Guest can call GET /users/me and see is_guest=True
  - POST /auth/convert flips is_guest to False and preserves user id
  - Expired guest token is rejected by /users/me (forged past-exp JWT)
  - Normal register without a guest token is unaffected
  - Converting an already-converted account returns 400
"""

import uuid

import pytest
from fastapi import status
from sqlalchemy import select

from app.models import User


class TestGuestCreate:
    @pytest.mark.asyncio(loop_scope="function")
    async def test_create_guest_returns_token(self, test_client):
        """POST /auth/guest should return 201 with an access_token."""
        resp = await test_client.post("/auth/guest")
        assert resp.status_code == status.HTTP_201_CREATED
        data = resp.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"

    @pytest.mark.asyncio(loop_scope="function")
    async def test_guest_token_allows_me(self, test_client):
        """A guest JWT should authenticate GET /users/me and expose is_guest=True."""
        create_resp = await test_client.post("/auth/guest")
        token = create_resp.json()["access_token"]

        me_resp = await test_client.get(
            "/users/me", headers={"Authorization": f"Bearer {token}"}
        )
        assert me_resp.status_code == status.HTTP_200_OK
        data = me_resp.json()
        assert data["is_guest"] is True
        assert "guest.example" in data["email"]

    @pytest.mark.asyncio(loop_scope="function")
    async def test_guest_email_format(self, test_client, db_session):
        """Guest email should follow the guest-<uuid>@guest.local pattern."""
        await test_client.post("/auth/guest")
        result = await db_session.execute(
            select(User).where(User.email.like("%@guest.example"))
        )
        guest_user = result.scalars().first()
        assert guest_user is not None
        assert guest_user.is_guest is True
        assert guest_user.email.startswith("guest-")
        assert guest_user.email.endswith("@guest.example")


class TestGuestConvert:
    @pytest.mark.asyncio(loop_scope="function")
    async def test_convert_flips_is_guest_and_preserves_id(
        self, test_client, db_session
    ):
        """POST /auth/convert should set is_guest=False and keep the same user id."""
        create_resp = await test_client.post("/auth/guest")
        token = create_resp.json()["access_token"]

        # Capture the guest user id before conversion
        me_before = await test_client.get(
            "/users/me", headers={"Authorization": f"Bearer {token}"}
        )
        original_id = me_before.json()["id"]

        convert_resp = await test_client.post(
            "/auth/convert",
            json={"email": "real@example.com", "password": "NewPass#99"},
            headers={"Authorization": f"Bearer {token}"},
        )
        assert convert_resp.status_code == status.HTTP_200_OK
        data = convert_resp.json()
        assert data["is_guest"] is False
        assert data["id"] == original_id
        assert data["email"] == "real@example.com"

    @pytest.mark.asyncio(loop_scope="function")
    async def test_convert_persisted_in_db(self, test_client, db_session):
        """After conversion the DB row should reflect is_guest=False."""
        create_resp = await test_client.post("/auth/guest")
        token = create_resp.json()["access_token"]
        me = await test_client.get(
            "/users/me", headers={"Authorization": f"Bearer {token}"}
        )
        user_id = uuid.UUID(me.json()["id"])

        await test_client.post(
            "/auth/convert",
            json={"email": "persisted@example.com", "password": "NewPass#99"},
            headers={"Authorization": f"Bearer {token}"},
        )

        result = await db_session.execute(select(User).where(User.id == user_id))
        db_user = result.scalars().first()
        assert db_user is not None
        assert db_user.is_guest is False
        assert db_user.email == "persisted@example.com"

    @pytest.mark.asyncio(loop_scope="function")
    async def test_convert_already_converted_returns_400(self, test_client):
        """Calling /auth/convert twice should return 400."""
        create_resp = await test_client.post("/auth/guest")
        token = create_resp.json()["access_token"]

        await test_client.post(
            "/auth/convert",
            json={"email": "first@example.com", "password": "NewPass#99"},
            headers={"Authorization": f"Bearer {token}"},
        )

        second_resp = await test_client.post(
            "/auth/convert",
            json={"email": "second@example.com", "password": "NewPass#99"},
            headers={"Authorization": f"Bearer {token}"},
        )
        assert second_resp.status_code == status.HTTP_400_BAD_REQUEST
        assert second_resp.json()["detail"] == "ERROR_ALREADY_CONVERTED"

    @pytest.mark.asyncio(loop_scope="function")
    async def test_convert_without_token_returns_401(self, test_client):
        """POST /auth/convert without a Bearer token should return 401."""
        resp = await test_client.post(
            "/auth/convert",
            json={"email": "nobody@example.com", "password": "NewPass#99"},
        )
        assert resp.status_code == status.HTTP_401_UNAUTHORIZED


class TestNormalRegisterUnaffected:
    @pytest.mark.asyncio(loop_scope="function")
    async def test_register_without_guest_token_is_not_guest(
        self, test_client, db_session
    ):
        """Standard register (no guest JWT) should produce is_guest=False."""
        resp = await test_client.post(
            "/auth/register",
            json={"email": "normal@example.com", "password": "Normal#99"},
        )
        assert resp.status_code == status.HTTP_201_CREATED
        data = resp.json()
        # is_guest should default to False for a normal registration
        assert data.get("is_guest", False) is False

        result = await db_session.execute(
            select(User).where(User.email == "normal@example.com")
        )
        db_user = result.scalars().first()
        assert db_user is not None
        assert db_user.is_guest is False


class TestExpiredGuestToken:
    @pytest.mark.asyncio(loop_scope="function")
    async def test_expired_guest_token_rejected(self, test_client, db_session):
        """A JWT with a past exp claim should be rejected by /users/me.

        We forge the token directly using PyJWT to set exp in the past, because
        fastapi-users' JWTStrategy omits exp entirely when lifetime_seconds=0
        (meaning the token would never expire — not the scenario we want).
        """
        import time
        import jwt as pyjwt

        from app.config import settings

        # Create a guest user to get a valid sub (user id).
        create_resp = await test_client.post("/auth/guest")
        assert create_resp.status_code == status.HTTP_201_CREATED
        me_resp = await test_client.get(
            "/users/me",
            headers={"Authorization": f"Bearer {create_resp.json()['access_token']}"},
        )
        user_id = me_resp.json()["id"]

        # Forge a token with exp one second in the past.
        expired_payload = {
            "sub": user_id,
            "aud": ["fastapi-users:auth"],
            "exp": int(time.time()) - 1,
        }
        expired_token = pyjwt.encode(
            expired_payload,
            settings.ACCESS_SECRET_KEY,
            algorithm=settings.ALGORITHM,
        )

        expired_resp = await test_client.get(
            "/users/me", headers={"Authorization": f"Bearer {expired_token}"}
        )
        assert expired_resp.status_code == status.HTTP_401_UNAUTHORIZED
