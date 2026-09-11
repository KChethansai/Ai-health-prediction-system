"""Download + validate real public medical datasets into ml-service/data/.

Sources (all no-auth, verified live):
- Symptom train/test: Kaggle "Disease Prediction Using Machine Learning" mirror,
  41 diseases x 132 binary symptoms (4920 train rows + 41 test rows).
- Diabetes: Pima Indians Diabetes Dataset mirror (768x9).
- Heart: UCI Cleveland Heart Disease (303x14, no header).
- Stroke: Kaggle stroke prediction mirror (5110x12).

Usage: python scripts/fetch_data.py [--verify-only]
Writes data/MANIFEST.json with URLs + sha256 + row/col counts.
"""
import csv
import hashlib
import json
import sys
import urllib.request
from pathlib import Path

DATA = Path(__file__).resolve().parent.parent / "data"

SOURCES = {
    "symptom_train.csv": [
        "https://raw.githubusercontent.com/yaswanthpalaghat/Disease-prediction-using-Machine-Learning/master/Training.csv",
        "https://raw.githubusercontent.com/parthsompura/Disease-prediction-using-Machine-Learning/master/Training.csv",
    ],
    "symptom_test.csv": [
        "https://raw.githubusercontent.com/yaswanthpalaghat/Disease-prediction-using-Machine-Learning/master/Testing.csv",
        "https://raw.githubusercontent.com/parthsompura/Disease-prediction-using-Machine-Learning/master/Testing.csv",
    ],
    "diabetes.csv": ["https://raw.githubusercontent.com/plotly/datasets/master/diabetes.csv"],
    "heart_cleveland.data": [
        "https://archive.ics.uci.edu/ml/machine-learning-databases/heart-disease/processed.cleveland.data"
    ],
    "stroke.csv": [
        "https://raw.githubusercontent.com/Aduomas/stroke_prediction/main/healthcare-dataset-stroke-data.csv",
        "https://raw.githubusercontent.com/asif7695/healthcare_dataset_stroke_prediction/main/healthcare-dataset-stroke-data.csv",
    ],
}

# name -> (min_rows, min_cols, must_contain_column_or_None)
EXPECT = {
    "symptom_train.csv": (4000, 100, "prognosis"),
    "symptom_test.csv": (30, 100, "prognosis"),
    "diabetes.csv": (700, 8, None),
    "heart_cleveland.data": (290, 14, None),
    "stroke.csv": (5000, 12, "stroke"),
}


def download(url, dest):
    req = urllib.request.Request(url, headers={"User-Agent": "medipredict-ml/1.0"})
    with urllib.request.urlopen(req, timeout=120) as r, open(dest, "wb") as f:
        f.write(r.read())


def sha256(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def validate(name, path):
    min_rows, min_cols, must_col = EXPECT[name]
    with open(path, newline="") as f:
        reader = csv.reader(f)
        header = next(reader)
        rows = list(reader)
    # headerless files (cleveland .data) have numeric first row
    has_header = not all(c.replace(".", "", 1).replace("-", "", 1).isdigit() for c in header)
    n_cols = len(header)
    if not has_header:  # count cols from data row instead
        n_cols = len(header)
    assert len(rows) >= min_rows, f"{name}: only {len(rows)} rows (want >={min_rows})"
    assert n_cols >= min_cols, f"{name}: only {n_cols} cols (want >={min_cols})"
    if must_col:
        assert must_col in header, f"{name}: missing column {must_col}"
    return len(rows), n_cols, has_header


def main():
    verify_only = "--verify-only" in sys.argv
    DATA.mkdir(exist_ok=True)
    manifest_path = DATA / "MANIFEST.json"
    manifest = json.loads(manifest_path.read_text()) if manifest_path.exists() else {}
    for name, urls in SOURCES.items():
        dest = DATA / name
        if verify_only:
            if not dest.exists():
                sys.exit(f"MISSING: {name} (run without --verify-only first)")
        else:
            for url in urls:
                try:
                    print(f"fetch {name} <- {url}")
                    download(url, dest)
                    break
                except Exception as e:  # try next mirror
                    print(f"  mirror failed: {e}")
            else:
                sys.exit(f"ALL MIRRORS FAILED for {name}")
        rows, cols, has_header = validate(name, dest)
        manifest[name] = {
            "sha256": sha256(dest),
            "rows": rows,
            "cols": cols,
            "has_header": has_header,
            "mirrors": urls,
        }
        print(f"  ok: {rows} rows x {cols} cols, sha256={manifest[name]['sha256'][:12]}...")
    manifest_path.write_text(json.dumps(manifest, indent=2))
    print(f"manifest -> {manifest_path}")


if __name__ == "__main__":
    main()
