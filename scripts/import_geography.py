#!/usr/bin/env python3
"""Build the static LMK birthplace catalogue from the approved workbook."""

from __future__ import annotations

import hashlib
import json
import sys
from pathlib import Path

from openpyxl import load_workbook


REGION_IDS = {
    "ノースフェル": "northfell",
    "ベルメア": "bellmere",
    "ローズウィック": "rosewick",
    "ブランブルシャー": "brambleshire",
    "クラウンシャー": "crownshire",
    "ホワイトクリフ": "whitecliff",
    "ミューミンスター（特別区）": "mewminster",
}

DISPLAY_NAMES = {
    "northfell": "ノースフェル地方",
    "bellmere": "ベルメア地方",
    "rosewick": "ローズウィック地方",
    "brambleshire": "ブランブルシャー地方",
    "crownshire": "クラウンシャー地方",
    "whitecliff": "ホワイトクリフ地方",
    "mewminster": "ミューミンスター特別区",
}


def as_js(value: object) -> str:
    return json.dumps(value, ensure_ascii=False, separators=(",", ":"))


def build(source: Path, target: Path) -> None:
    workbook = load_workbook(source, data_only=True, read_only=True)
    descriptions = {
        REGION_IDS[name]: description
        for name, description in workbook["地方説明"].iter_rows(
            min_row=2, values_only=True
        )
    }
    places = []
    for row in workbook["出生地100_v6"].iter_rows(min_row=2, values_only=True):
        number, region_name, name, legend, mystique, tag1, tag2, basis, kind = row
        tags = [tag for tag in (tag1, tag2) if tag and tag != "なし"]
        places.append(
            {
                "number": int(number),
                "regionId": REGION_IDS[region_name],
                "name": name,
                "legend": legend,
                "mystique": int(mystique),
                "tags": tags,
                "basis": basis,
                "kind": kind,
            }
        )

    if len(places) != 100:
        raise ValueError(f"Expected 100 places, found {len(places)}")
    if sorted(place["number"] for place in places) != list(range(1, 101)):
        raise ValueError("Birthplace numbers must be exactly 1..100")

    source_hash = hashlib.sha256(source.read_bytes()).hexdigest()
    regions = {
        region_id: {
            "id": region_id,
            "name": DISPLAY_NAMES[region_id],
            "description": descriptions[region_id],
        }
        for region_id in DISPLAY_NAMES
    }
    header = (
        "// Generated from the approved LMK v6 birthplace workbook.\n"
        "// Rebuild with scripts/import_geography.py; do not hand-edit this file.\n"
    )
    body = (
        f"export const GEOGRAPHY_SOURCE={as_js({'filename': source.name, 'sha256': source_hash, 'version': 6})};\n"
        f"export const REGION_GEOGRAPHY={as_js(regions)};\n"
        f"export const BIRTHPLACES={as_js(places)};\n"
        "export const BIRTHPLACES_BY_REGION=Object.freeze(Object.groupBy"
        "?Object.groupBy(BIRTHPLACES,place=>place.regionId)"
        ":BIRTHPLACES.reduce((all,place)=>((all[place.regionId]??=[]).push(place),all),{}));\n"
    )
    target.write_text(header + body, encoding="utf-8")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise SystemExit("usage: import_geography.py SOURCE.xlsx TARGET.js")
    build(Path(sys.argv[1]), Path(sys.argv[2]))
