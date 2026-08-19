#!/usr/bin/env python3
"""Replace em dashes (U+2014) with two ASCII hyphens (--).

Robust replacement for the previous `sed -i "" 's/—/--/g'` hook, which
unconditionally rewrote every file (macOS BSD sed) and intermittently reported
a modification even when no em dash was present. This script writes a file ONLY
when it actually contains an em dash, and it is cross-platform (no GNU/BSD sed
differences).

Usage (driven by pre-commit, one path per arg):
    python3 scripts/replace-em-dashes.py <file> [<file> ...]
"""

import sys

EM_DASH = "\u2014"
REPLACEMENT = "--"


def fix_file(path: str) -> bool:
    try:
        with open(path, encoding="utf-8") as fh:
            original = fh.read()
    except (OSError, UnicodeDecodeError):
        # Binary or unreadable -- leave alone; pre-commit already filtered by
        # `types: [text]`, so this is a defensive no-op.
        return False

    if EM_DASH not in original:
        return False

    with open(path, "w", encoding="utf-8") as fh:
        fh.write(original.replace(EM_DASH, REPLACEMENT))
    return True


def main() -> int:
    changed = [p for p in sys.argv[1:] if fix_file(p)]
    if changed:
        print(f"replaced em dashes in {len(changed)} file(s): {', '.join(changed)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
