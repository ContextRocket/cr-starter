#!/usr/bin/env python3
"""CLI for scripts/lib/logo_layers.py — adapt + spatial symbol/wordmark split."""
from __future__ import annotations
import argparse, json, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent / "lib"))
from logo_layers import adapt_raster, adapt_svg, decompose_raster, ink_hex, parse_ink

def main():
    ap = argparse.ArgumentParser(description=__doc__)
    sub = ap.add_subparsers(dest="cmd", required=True)
    a = sub.add_parser("adapt"); a.add_argument("src"); a.add_argument("dest"); a.add_argument("--ink", default="#111111"); a.add_argument("--json", action="store_true")
    d = sub.add_parser("decompose"); d.add_argument("src"); d.add_argument("--out-dir", required=True); d.add_argument("--ink", default="#111111"); d.add_argument("--json", action="store_true")
    args = ap.parse_args(); ink = parse_ink(args.ink)
    if args.cmd == "adapt":
        src, dest = Path(args.src), Path(args.dest)
        result = adapt_svg(src, dest, ink_hex(ink)) if src.suffix.lower()==".svg" else adapt_raster(src, dest, ink)
    else:
        result = decompose_raster(Path(args.src), Path(args.out_dir), ink=ink)
    print(json.dumps(result, indent=2))
if __name__ == "__main__":
    main()
