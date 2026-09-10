#!/usr/bin/env python3
"""Deterministic logo plate / light-bg fit / palette analysis (Pillow).

Prints JSON with fit flags plus a small chromatic palette sampled from the mark
(useful when CTA/CSS miss brand hues that only live in the logo).
"""
from __future__ import annotations

import json
import sys
from collections import Counter
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    import subprocess

    subprocess.check_call([sys.executable, "-m", "pip", "install", "pillow", "-q"])
    from PIL import Image


def lum(r: float, g: float, b: float) -> float:
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255.0


def sat(r: float, g: float, b: float) -> float:
    return (max(r, g, b) - min(r, g, b)) / 255.0


def hex_rgb(r: float, g: float, b: float) -> str:
    return "#{:02x}{:02x}{:02x}".format(int(r), int(g), int(b))


def bucket(r: int, g: int, b: int, step: int = 24) -> tuple[int, int, int]:
    return (r // step * step, g // step * step, b // step * step)


def sample_palette(opaque: list[tuple[int, int, int, int]], limit: int = 5) -> list[dict]:
    """Dominant chromatic colors (skip near-white / near-black ink)."""
    counts: Counter[tuple[int, int, int]] = Counter()
    for r, g, b, _a in opaque:
        L = lum(r, g, b)
        S = sat(r, g, b)
        if L > 0.92 or L < 0.08:
            continue
        if S < 0.12 and 0.25 < L < 0.85:
            continue  # grey chrome
        counts[bucket(r, g, b)] += 1
    out = []
    for (r, g, b), n in counts.most_common(limit * 2):
        if n < 8:
            continue
        out.append(
            {
                "hex": hex_rgb(r + 12, g + 12, b + 12),
                "share": round(n / max(len(opaque), 1), 4),
                "luminance": round(lum(r, g, b), 3),
                "saturation": round(sat(r, g, b), 3),
            }
        )
        if len(out) >= limit:
            break
    return out


def analyze_svg(path: Path) -> dict:
    text = path.read_text(encoding="utf-8", errors="ignore")
    low = text.lower()
    # Tiny UI glyphs (phone, close, 16x16) are not wordmarks.
    # Only trust the root <svg> width/height or viewBox — nested <mask width="29">
    # must not mark a full wordmark as a UI icon (Notion failure mode).
    tiny = False
    import re

    root = re.search(r"<svg\b[^>]*>", low)
    root_tag = root.group(0) if root else ""
    m = re.search(r'viewbox\s*=\s*"0\s+0\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)"', root_tag or low)
    vw = vh = None
    if m:
        vw, vh = float(m.group(1)), float(m.group(2))
        if max(vw, vh) <= 32 and (min(vw, vh) <= 32):
            # Square-ish micro icons only; wide viewBoxes are wordmarks even if short.
            if max(vw, vh) / max(min(vw, vh), 1e-6) < 1.8:
                tiny = True
    mw = re.search(r'\bwidth\s*=\s*"(\d+)"', root_tag)
    mh = re.search(r'\bheight\s*=\s*"(\d+)"', root_tag)
    if mw and mh and max(int(mw.group(1)), int(mh.group(1))) <= 32:
        tiny = True
    # Class / id cues: explicit wordmark beats tiny heuristics.
    if re.search(r"\bwordmark\b|\blogo\b|\bbrand\b", root_tag + " " + low[:500]):
        tiny = False

    # Rough fill sampling from explicit hex fills
    fills = re.findall(r"#[0-9a-f]{3,8}\b", low)
    palette = []
    seen = set()
    for f in fills:
        hx = f if len(f) != 4 else "#" + "".join(ch * 2 for ch in f[1:])
        if len(hx) < 7:
            continue
        hx = hx[:7]
        if hx in seen:
            continue
        seen.add(hx)
        r = int(hx[1:3], 16)
        g = int(hx[3:5], 16)
        b = int(hx[5:7], 16)
        if sat(r, g, b) < 0.15 and lum(r, g, b) > 0.85:
            continue
        palette.append(
            {
                "hex": hx,
                "share": None,
                "luminance": round(lum(r, g, b), 3),
                "saturation": round(sat(r, g, b), 3),
            }
        )
        if len(palette) >= 5:
            break

    if tiny:
        return {
            "path": str(path),
            "format": "svg",
            "width": None,
            "height": None,
            "transparentShare": 1.0,
            "cornerOpaque": False,
            "cornerAverage": None,
            "cornerLuminance": None,
            "opaqueAverageLuminance": None,
            "solidPlate": False,
            "plateHex": None,
            "fitsLightBackground": True,
            "fitsDarkBackground": True,
            "reason": "svg-ui-icon",
            "darkReason": "svg-ui-icon",
            "uiIcon": True,
            "palette": palette,
        }

    has_white_fill = bool(
        re.search(r"fill\s*=\s*[\"']#fff(fff)?[\"']", low)
        or re.search(r"fill\s*:\s*#fff", low)
        or "fill=\"white\"" in low
        or "fill='white'" in low
    )
    return {
        "path": str(path),
        "format": "svg",
        "width": None,
        "height": None,
        "transparentShare": 1.0,
        "cornerOpaque": False,
        "cornerAverage": None,
        "cornerLuminance": None,
        "opaqueAverageLuminance": None,
        "solidPlate": False,
        "plateHex": None,
        "fitsLightBackground": not has_white_fill,
        "fitsDarkBackground": True if has_white_fill else ("currentcolor" not in low),
        "reason": "svg-light-text" if has_white_fill else "svg-wordmark",
        "darkReason": "light-mark" if has_white_fill else "svg-wordmark",
        "uiIcon": False,
        "palette": palette,
    }


def analyze(path: Path) -> dict:
    if path.suffix.lower() == ".svg":
        return analyze_svg(path)

    im = Image.open(path).convert("RGBA")
    w, h = im.size
    px = list(im.getdata())
    n = max(len(px), 1)
    transparent = sum(1 for p in px if p[3] < 30) / n

    corners = [
        im.getpixel((min(2, w - 1), min(2, h - 1))),
        im.getpixel((max(w - 3, 0), min(2, h - 1))),
        im.getpixel((min(2, w - 1), max(h - 3, 0))),
        im.getpixel((max(w - 3, 0), max(h - 3, 0))),
    ]
    cr = sum(p[0] for p in corners) / 4
    cg = sum(p[1] for p in corners) / 4
    cb = sum(p[2] for p in corners) / 4
    ca = sum(p[3] for p in corners) / 4
    corner_opaque = ca > 200
    corner_l = lum(cr, cg, cb) if corner_opaque else None

    opaque = [p for p in px if p[3] > 200]
    if opaque:
        ol = sum(lum(p[0], p[1], p[2]) for p in opaque) / len(opaque)
        dark_share = sum(1 for p in opaque if lum(p[0], p[1], p[2]) < 0.35) / len(opaque)
        light_share = sum(1 for p in opaque if lum(p[0], p[1], p[2]) > 0.75) / len(opaque)
    else:
        ol = dark_share = light_share = None

    palette = sample_palette(opaque) if opaque else []

    # Solid plate: opaque corners that are not near-white (favicon/app-icon style).
    solid_plate = bool(corner_opaque and corner_l is not None and corner_l < 0.92)
    plate_hex = hex_rgb(cr, cg, cb) if solid_plate else None

    # White / near-white ink on transparency is a *dark-surface* wordmark.
    light_ink_on_clear = bool(
        transparent > 0.2
        and not solid_plate
        and light_share is not None
        and light_share >= 0.45
        and (ol is None or ol >= 0.7)
    )

    if light_ink_on_clear:
        fits_light = False
        reason = "light-ink-on-transparent"
    elif transparent > 0.12 and not solid_plate:
        fits_light = True
        reason = "transparent-mark"
    elif solid_plate and corner_l is not None and corner_l >= 0.85:
        fits_light = True
        reason = "light-plate"
    elif solid_plate:
        fits_light = False
        reason = f"dark-plate:{plate_hex}"
    elif ol is not None and ol < 0.45:
        fits_light = True
        reason = "dark-mark-on-clear"
    else:
        fits_light = True
        reason = "default-ok"

    if solid_plate and corner_l is not None and corner_l < 0.35:
        fits_dark = True
        reason_dark = "dark-plate"
    elif light_ink_on_clear:
        fits_dark = True
        reason_dark = "light-ink-on-transparent"
    elif ol is not None and light_share is not None and light_share > 0.5:
        fits_dark = True
        reason_dark = "light-mark"
    elif transparent > 0.12 and ol is not None and ol > 0.6:
        fits_dark = True
        reason_dark = "light-mark-on-clear"
    else:
        fits_dark = False
        reason_dark = "may-need-light-plate"

    return {
        "path": str(path),
        "format": path.suffix.lower().lstrip("."),
        "width": w,
        "height": h,
        "transparentShare": round(transparent, 4),
        "cornerOpaque": corner_opaque,
        "cornerAverage": hex_rgb(cr, cg, cb) if corner_opaque else None,
        "cornerLuminance": round(corner_l, 4) if corner_l is not None else None,
        "opaqueAverageLuminance": round(ol, 4) if ol is not None else None,
        "darkOpaqueShare": round(dark_share, 4) if dark_share is not None else None,
        "lightOpaqueShare": round(light_share, 4) if light_share is not None else None,
        "solidPlate": solid_plate,
        "plateHex": plate_hex,
        "fitsLightBackground": fits_light,
        "fitsDarkBackground": fits_dark,
        "reason": reason,
        "darkReason": reason_dark,
        "uiIcon": False,
        "palette": palette,
    }


def main() -> None:
    if len(sys.argv) < 2:
        print("Usage: analyze-logo.py <image> [image...]", file=sys.stderr)
        sys.exit(2)
    out = [analyze(Path(a)) for a in sys.argv[1:]]
    json.dump(out if len(out) > 1 else out[0], sys.stdout, indent=2)
    sys.stdout.write("\n")


if __name__ == "__main__":
    main()
