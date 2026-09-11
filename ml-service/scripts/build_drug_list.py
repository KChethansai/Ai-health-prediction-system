"""Build OCR drug gazetteer from the repo's curated medicine DB.

Parses ../.. /src/data/medicines.ts (genericName + brandName + drugClass)
into data/drug_names.json. Zero licensing friction (repo-owned data);
RxNorm documented as the production upgrade path.

Usage: python scripts/build_drug_list.py
"""
import json
import re
from pathlib import Path

HERE = Path(__file__).resolve().parent.parent
SRC = HERE.parent / "src" / "data" / "medicines.ts"
OUT = HERE / "data" / "drug_names.json"


def main():
    text = SRC.read_text()
    generics = re.findall(r'genericName:\s*"([^"]+)"', text)
    brands = re.findall(r'brandName:\s*"([^"]+)"', text)
    classes = re.findall(r'drugClass:\s*"([^"]+)"', text)
    assert len(generics) == len(brands) == len(classes) and generics, "parse failed"
    entries = [{"generic": g, "brand": b, "drugClass": c}
               for g, b, c in zip(generics, brands, classes)]
    OUT.parent.mkdir(exist_ok=True)
    OUT.write_text(json.dumps(entries, indent=1))
    names = {g for e in entries for g in (e["generic"], e["brand"])}
    print(f"{len(entries)} drugs, {len(names)} unique names -> {OUT}")


if __name__ == "__main__":
    main()
