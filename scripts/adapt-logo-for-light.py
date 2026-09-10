#!/usr/bin/env python3
"""Thin CLI wrapper around scripts/lib/logo_layers.py (adapt-for-light)."""
from __future__ import annotations
import argparse, json, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent / "lib"))
from logo_layers import adapt_raster, adapt_svg, ink_hex, parse_ink

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src"); ap.add_argument("dest")
    ap.add_argument("--ink", default="#111111"); ap.add_argument("--json", action="store_true")
    args = ap.parse_args()
    src, dest = Path(args.src), Path(args.dest)
    ink = parse_ink(args.ink)
    result = adapt_svg(src, dest, ink_hex(ink)) if src.suffix.lower()==".svg" else adapt_raster(src, dest, ink)
    print(json.dumps(result) if args.json else f"adapted → {dest} remapped={result.get('remappedPixels', result.get('replacements'))} ink={ink_hex(ink)}")
if __name__ == "__main__":
    main()
