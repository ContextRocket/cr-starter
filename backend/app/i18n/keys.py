"""Single source of truth for backend-internal translated strings.

Client-facing error keys (ERROR_*, ACTION_*) are returned as raw key
strings to the frontend, which owns the English text and any future
translations. Only strings that the backend itself must render
(email subjects and body text) live here.

Naming convention (SCREAMING_SNAKE, category prefix):
  EMAIL_*    - email subjects and body text
"""

_MESSAGES: dict[str, str] = {
    # ── Email ───────────────────────────────────────────────────────
    "EMAIL_PASSWORD_RESET_SUBJECT": "Password recovery",
}


def t(key: str, **kwargs: object) -> str:
    """Return the message for *key*, formatted with any keyword arguments.

    Raises ``KeyError`` if the key is unknown (a programming bug, not a
    user error).
    """
    template = _MESSAGES[key]
    return template.format(**kwargs) if kwargs else template
