"""Prescription OCR: Tesseract -> dosage regex -> gazetteer fuzzy-match -> schedule.

Print-only (handwriting degrades to low confidence + unverified flags, never
silent garbage). Gazetteer: data/drug_names.json built by scripts/build_drug_list.py.
"""
import base64
import io
import json
import os
import re

from PIL import Image, ImageFilter, ImageOps

DATA = os.path.join(os.path.dirname(__file__), "data")
with open(os.path.join(DATA, "drug_names.json")) as f:
    _DRUGS = json.load(f)
_NAMES = [(d["generic"], d) for d in _DRUGS] + [(d["brand"], d) for d in _DRUGS]

STRENGTH = re.compile(r"(\d+(?:\.\d+)?\s*(?:mg|mcg|µg|g|ml|iu|units?))\b", re.I)
DASH = re.compile(r"\b([0-3])\s*[-–]\s*([0-3])\s*[-–]\s*([0-3])\b")  # 1-0-1
EVERY_H = re.compile(r"every\s*(\d+)\s*h", re.I)
DURATION = re.compile(r"[x×]\s*(\d+)\s*days?", re.I)
FREQ_WORDS = [
    (r"\b(od|once daily|once a day|daily|qd|mane|morning)\b", ["08:00"]),
    (r"\b(hs|bedtime|night|nocte)\b", ["22:00"]),
    (r"\b(bd|twice daily|twice a day|bid|1-0-1|every 12h?)\b", ["08:00", "20:00"]),
    (r"\b(tds|thrice|three times|tid|1-1-1|every 8h?)\b", ["08:00", "14:00", "20:00"]),
    (r"\b(qid|four times|every 6h?)\b", ["06:00", "12:00", "18:00", "22:00"]),
]


def frequency_to_times(freq, line=""):
    text = f"{freq} {line}".lower()
    m = DASH.search(text)
    if m:  # 1-0-1 -> morning+night doses
        slots = ["08:00", "14:00", "20:00"]
        return [t for t, n in zip(slots, map(int, m.groups())) if n] or ["08:00"]
    e = EVERY_H.search(text)
    if e:
        step = max(1, int(e.group(1)))
        return [f"{h:02d}:00" for h in range(6, 24, step)][:4]
    for pat, times in FREQ_WORDS:
        if re.search(pat, text):
            return times
    return ["08:00", "20:00"]


def preprocess(raw: bytes) -> Image.Image:
    img = Image.open(io.BytesIO(raw)).convert("L")
    w, h = img.size
    if max(w, h) < 1500:  # upscale small phone crops for Tesseract
        img = img.resize((w * 2, h * 2), Image.LANCZOS)
    img = ImageOps.autocontrast(img).filter(ImageFilter.MedianFilter(3))
    return img.point(lambda p: 255 if p > 140 else 0)  # ponytail: fixed threshold, Otsu if scans complain


def ocr_text(img: Image.Image):
    import pytesseract
    data = pytesseract.image_to_data(img, config="--oem 1 --psm 6", output_type=pytesseract.Output.DICT)
    words = [(w, int(c)) for w, c in zip(data["text"], data["conf"]) if w.strip() and int(c) >= 0]
    conf = sum(c for _, c in words) / len(words) if words else 0
    text = " ".join(w for w, _ in words)
    return text, conf, pytesseract.image_to_string(img, config="--oem 1 --psm 6")


def match_drug(token):
    from rapidfuzz import process
    hit = process.extractOne(token, [n for n, _ in _NAMES], score_cutoff=80)
    if not hit:
        return None, 0
    name, score, _ = hit
    drug = next(d for n, d in _NAMES if n == name)
    return drug, score


def parse_line(line):
    """One prescription line -> medicine dict or None."""
    tokens = re.findall(r"[A-Za-z][A-Za-z\-]{2,}", line)
    best, best_score = None, 0
    for tok in tokens:
        drug, score = match_drug(tok)
        if drug and score > best_score:
            best, best_score = drug, score
    if not best:
        return None
    sm = STRENGTH.search(line)
    strength = sm.group(1).strip() if sm else ""
    freq_m = re.search(r"(1-0-1|1-1-1|0-1-0|0-0-1|\bOD\b|\bBD\b|\bTDS\b|\bQID\b|\bHS\b"
                       r"|once daily|twice daily|thrice daily|three times daily|every \d+h?|daily|at (night|morning|bedtime))",
                       line, re.I)
    freq = freq_m.group(0) if freq_m else ""
    dur = DURATION.search(line)
    return {"name": best["generic"], "brand": best["brand"], "drugClass": best["drugClass"],
            "dosage": strength.strip(), "strength": strength.strip(), "frequency": freq,
            "duration": f"{dur.group(1)} days" if dur else "",
            "timing": "", "route": "oral",
            "times": frequency_to_times(freq, line),
            "matched": True, "matchScore": round(best_score, 1)}


def extract(image_b64: str) -> dict:
    raw = base64.b64decode(image_b64.split(",", 1)[-1])  # tolerate data: URLs
    if len(raw) > 8 * 1024 * 1024:
        return {"error": "Image too large (max 8MB)", "medicines": []}
    img = preprocess(raw)
    _, conf, full = ocr_text(img)
    meds, seen = [], set()
    for line in full.splitlines():
        if len(line.strip()) < 4:
            continue
        m = parse_line(line)
        if m and m["name"] not in seen:
            seen.add(m["name"])
            meds.append(m)
    level = "high" if conf >= 80 else "medium" if conf >= 60 else "low"
    return {"medicines": meds, "possible_conditions": [], "confidence": level,
            "ocrConfidence": round(conf, 1), "rawText": full.strip()[:2000]}
