#!/usr/bin/env python3
"""
Seed test data for E2E tests.

Standard Test Data Pattern:
- Domain: @example.com
- Password: DevPass#99 (same for all test users)
- Pattern: {persona}@example.com

Current personas:
- tester@example.com: Primary test user for E2E tests

Future personas can be added easily:
- support@example.com: Support agent persona
- admin@example.com: Admin persona
- customer1@example.com, customer2@example.com: Different customer personas

Idempotent - safe to run multiple times.
"""

import asyncio
import sys
from pathlib import Path
from typing import Dict, Any

# Add backend directory to path so we can import app modules
sys.path.insert(0, str(Path(__file__).parent))

from sqlalchemy import select

from app.database import async_session_maker
from app.models import User
from app.users import UserManager
from app.database import get_user_db
from app.schemas import UserCreate


# Standard password for all test users
STANDARD_TEST_PASSWORD = "DevPass#99"

# Test personas - easy to add more
TEST_PERSONAS: list[Dict[str, Any]] = [
    {
        "email": "tester@example.com",
    },
    # Add more personas here as needed:
    # {"email": "support@example.com"},
    # {"email": "admin@example.com"},
]


async def seed_persona(session, persona: Dict[str, Any]) -> bool:
    """Seed a single persona (user)."""
    email = persona["email"]

    # Check if user already exists
    result = await session.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()

    if user:
        print(f"  User already exists: {email}")
        return True

    # Create user using UserManager (handles password hashing)
    user_db_dep = get_user_db(session)
    user_db = await user_db_dep.__anext__()

    user_manager = UserManager(user_db)

    user_create = UserCreate(
        email=email,
        password=STANDARD_TEST_PASSWORD,
        is_superuser=False,
        is_verified=True,  # Pre-verify for testing
    )

    try:
        await user_manager.create(user_create)
        print(f"  Created user: {email}")
        return True
    except Exception as e:
        print(f"  Failed to create user {email}: {e}")
        return False


async def seed_test_data():
    """Seed all test personas."""
    print("Seeding test data...")
    print(f"   Password for all test users: {STANDARD_TEST_PASSWORD}\n")

    success = True
    async with async_session_maker() as session:
        for persona in TEST_PERSONAS:
            if not await seed_persona(session, persona):
                success = False

    if success:
        print("\nTest data seeded successfully!")
        print(f"\nTest users (all use password: {STANDARD_TEST_PASSWORD}):")
        for persona in TEST_PERSONAS:
            print(f"   - {persona['email']}")
    else:
        print("\nSome test data failed to seed")

    return success


async def main():
    """Main entry point."""
    try:
        success = await seed_test_data()
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"\nError seeding test data: {e}")
        import traceback

        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
