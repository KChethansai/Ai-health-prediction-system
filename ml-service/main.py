"""FastAPI ML microservice. Express proxies here; frontend never calls this directly.

Models (trained by scripts/train_*.py, versioned joblibs in models/):
- symptom_<algo>_v1.joblib: 41-disease classifier over 132 binary symptoms
- {diabetes,heart,stroke}_v1.joblib: calibrated binary risk classifiers
"""
import glob
import os
import time
from contextlib import asynccontextmanager

import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI
from pydantic import BaseModel

BOOT_AT = time.time()

MODELS = os.path.join(os.path.dirname(__file__), "models")
B = {}  # bundles
SHAP_EXP = None  # TreeExplainer for symptom model (built once)


def _latest(pattern):
    files = sorted(glob.glob(os.path.join(MODELS, pattern)))
    if not files:
        raise RuntimeError(f"no model matching {pattern} — run scripts/train_*.py first")
    return files[-1]


@asynccontextmanager
async def lifespan(app: FastAPI):
    global SHAP_EXP
    B["symptom"] = joblib.load(_latest("symptom_*_v1.joblib"))
    for k in ("diabetes", "heart", "stroke"):
        B[k] = joblib.load(_latest(f"{k}_v1.joblib"))
    # ponytail: SHAP built once at startup; per-request cost is one predict row
    try:
        import shap
        from xgboost import XGBClassifier
        from sklearn.ensemble import HistGradientBoostingClassifier, RandomForestClassifier
        m = B["symptom"]["model"]
        base = m.named_steps["clf"] if hasattr(m, "named_steps") else m  # unwrap Pipeline only (RF supports [i] -> trees!)
        if isinstance(base, (XGBClassifier, HistGradientBoostingClassifier, RandomForestClassifier)):
            bg = shap.sample(pd.DataFrame(np.zeros((50, len(B["symptom"]["symptoms"]))),
                                          columns=B["symptom"]["symptoms"]), 50)
            SHAP_EXP = shap.TreeExplainer(base, data=bg)
    except Exception:
        SHAP_EXP = None  # serve degrades to importance-weighted contributions
    yield


app = FastAPI(title="medipredict-ml", lifespan=lifespan)


class SymptomsIn(BaseModel):
    symptoms: list[str]
    severity: str = "Moderate"
    topN: int = 5


class MetricsIn(BaseModel):
    age: float | None = None
    systolicBp: float | None = None
    diastolicBp: float | None = None
    glucose: float | None = None
    heightCm: float | None = None
    weightKg: float | None = None
    bmi: float | None = None
    # passthrough extras (smoking, family history...) ignored by models, kept for future
    extra: dict = {}


class ExtractIn(BaseModel):
    imageBase64: str


@app.get("/health")
def health():
    try:
        import pytesseract
        tess = True
        try:
            pytesseract.get_tesseract_version()
        except Exception:
            tess = "binary-missing-data"
    except ImportError:
        tess = False
    return {"ok": True, "uptime": round(time.time() - BOOT_AT),
            "models": {k: v.get("version") for k, v in B.items()},
            "diseases": len(B["symptom"]["labels"]) if "symptom" in B else 0,
            "tesseract": tess}


def _norm(s):
    return s.strip().lower().replace(" ", "_")


@app.post("/predict/symptoms")
def predict_symptoms(body: SymptomsIn):
    syms, labels = B["symptom"]["symptoms"], B["symptom"]["labels"]
    idx = {_norm(s): s for s in syms}
    vec = np.zeros(len(syms))
    seen, unknown = [], []
    for s in body.symptoms:
        key = idx.get(_norm(s))
        if key is None:
            unknown.append(s)
        else:
            vec[syms.index(key)] = 1
            seen.append(key)
    if vec.sum() < 2:
        return {"error": "At least 2 recognized symptoms required", "unrecognized": unknown}
    row = pd.DataFrame([vec], columns=syms)
    proba = B["symptom"]["model"].predict_proba(row)[0]
    top = np.argsort(proba)[::-1][: max(1, min(body.topN, len(labels)))]
    out = []
    for i in top:
        contrib = _symptom_contrib(row, seen, int(i))
        out.append({"disease": labels[i], "probability": round(float(proba[i]) * 100, 1),
                    "description": "", "treatment": "Consult a healthcare professional.",
                    "medicines": ["Consult doctor for prescription"], "preventiveMeasures": [],
                    "contributingSymptoms": contrib})
    return {"predictions": out, "unrecognized": unknown,
            "ensemble": {"method": B["symptom"]["algo"], "version": B["symptom"]["version"]},
            "modelVersion": B["symptom"]["version"]}


def _symptom_contrib(row, seen, cls):
    if SHAP_EXP is not None:
        try:
            sv = SHAP_EXP.shap_values(row)
            sv = sv[:, :, cls] if getattr(sv, "ndim", 2) == 3 else (sv[cls] if isinstance(sv, list) else sv)
            w = dict(zip(B["symptom"]["symptoms"], np.abs(np.asarray(sv).ravel())))
            ranked = sorted(seen, key=lambda s: -w.get(s, 0))[:5]
            return [{"symptom": s, "weight": round(float(w.get(s, 0)), 4)} for s in ranked]
        except Exception:
            pass
    # fallback: global importance restricted to reported symptoms
    imp = dict(B.get("top_features_fallback", []) or [])
    return [{"symptom": s, "weight": float(imp.get(s, 1.0))} for s in seen[:5]]


def _risk_row(bundle, mapping):
    row = {}
    for col in bundle["num"] + bundle["cat"]:
        row[col] = mapping.get(col)
    return pd.DataFrame([row])


@app.post("/predict/metrics")
def predict_metrics(body: MetricsIn):
    d = body.model_dump()
    bmi = d.get("bmi") or (d["weightKg"] and d["heightCm"] and d["weightKg"] / (d["heightCm"] / 100) ** 2)
    hyper = (d.get("systolicBp") or 0) >= 140 or (d.get("diastolicBp") or 0) >= 90
    base = {"age": d.get("age"), "bmi": bmi,
            "glucose": d.get("glucose"), "avg_glucose_level": d.get("glucose"),
            "bloodpressure": d.get("systolicBp"), "trestbps": d.get("systolicBp"),
            "hypertension": int(hyper)}
    risks = {}
    for key, label in (("diabetes", "diabetes"), ("heart", "heartDisease"), ("stroke", "stroke")):
        b = B[key]
        proba = float(b["model"].predict_proba(_risk_row(b, base))[0, 1])
        risks[label] = {"probability": round(proba * 100, 1),
                        "level": "high" if proba >= 0.6 else "moderate" if proba >= 0.3 else "low",
                        "topFeatures": _risk_contrib(b, base)}
    return {"risks": risks, "modelVersion": B["diabetes"]["version"],
            "note": "Screening support only — consult a healthcare professional."}


def _risk_contrib(bundle, mapping):
    # coef-weighted provided values (LR) or gain-weighted (XGB); approximate but faithful to model
    try:
        pipe = bundle["model"].calibrated_classifiers_[0].estimator
        pre = pipe.named_steps["pre"]
        clf = pipe.named_steps["clf"]
        fn = list(pre.get_feature_names_out())
        w = getattr(clf, "coef_", None)
        w = np.abs(np.asarray(w).ravel()) if w is not None else np.asarray(clf.feature_importances_)
        row = _risk_row(bundle, mapping)
        vals = np.nan_to_num(pre.transform(row)[0])
        scored = sorted(zip(fn, w * np.abs(vals)), key=lambda x: -x[1])
        return [{"feature": f.split("__")[-1], "weight": round(float(v), 4)} for f, v in scored[:3]]
    except Exception:
        provided = [k for k, v in mapping.items() if v is not None]
        return [{"feature": k, "weight": 1.0} for k in provided[:3]]


@app.post("/ml/extract-prescription")
def extract(body: ExtractIn):
    from ocr import extract as run_ocr
    try:
        return run_ocr(body.imageBase64)
    except Exception as e:  # never 500 on bad images; Express maps shape safely
        return {"error": str(e)[:200], "medicines": [], "confidence": "low"}
