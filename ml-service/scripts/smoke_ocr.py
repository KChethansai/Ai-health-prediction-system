"""OCR smoke: render a fake printed prescription, run extract(), assert results.

Usage: TESSDATA_PREFIX=~/.tessdata python scripts/smoke_ocr.py  (from ml-service/)
"""
import base64
import io
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from ocr import extract

LINES = [
    "Rx",
    "Metformin 500mg 1-0-1 twice daily x 30 days",
    "Atorvastatin 10mg OD at bedtime",
    "Cetirizine 10mg once daily",
]

img = Image.new("RGB", (900, 400), "white")
d = ImageDraw.Draw(img)
font = ImageFont.truetype("/usr/share/fonts/TTF/DejaVuSans.ttf", 36)
y = 30
for line in LINES:
    d.text((30, y), line, fill="black", font=font)
    y += 70
buf = io.BytesIO()
img.save(buf, format="PNG")
b64 = base64.b64encode(buf.getvalue()).decode()

out = extract(b64)
print("confidence:", out.get("confidence"), out.get("ocrConfidence"))
for m in out["medicines"]:
    print(f"- {m['name']} | {m['dosage']} | {m['frequency']} -> {m['times']} | score {m['matchScore']}")

names = {m["name"] for m in out["medicines"]}
assert {"Metformin", "Atorvastatin", "Cetirizine"} <= names, f"MISSING: {names}"
assert out["confidence"] in ("high", "medium"), out["confidence"]
sched = {m["name"]: m["times"] for m in out["medicines"]}
assert sched["Metformin"] == ["08:00", "20:00"], sched
assert sched["Atorvastatin"] == ["08:00"], sched  # OD wins over bedtime line order
print("OCR-SMOKE-OK")
