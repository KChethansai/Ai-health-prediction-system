"""MODEL 2: three calibrated binary risk classifiers (diabetes / heart / stroke).

Disjoint public datasets -> three separate models (no joint rows exist).
Shared factory: impute -> scale -> imbalance fix -> classify -> sigmoid calibrate.
Imbalance: class_weight vs SMOTE compared by CV PR-AUC, winner kept.
Tuning: Optuna (~20 trials) for XGB, small GridSearchCV for LR.
Stratified 70/15/15, 5-fold CV on train, test scored once.
Saves models/{diabetes,heart,stroke}_v1.joblib + models/metrics_risk_v1.json.
"""
import json
import warnings
from pathlib import Path

import joblib
import numpy as np
import optuna
import pandas as pd
from imblearn.over_sampling import SMOTE
from imblearn.pipeline import Pipeline as ImbPipeline
from sklearn.calibration import CalibratedClassifierCV
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import average_precision_score, brier_score_loss, roc_auc_score
from sklearn.model_selection import StratifiedKFold, cross_val_score, GridSearchCV, train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from xgboost import XGBClassifier

warnings.filterwarnings("ignore")
SEED = 42
HERE = Path(__file__).resolve().parent.parent
DATA, MODELS = HERE / "data", HERE / "models"
VERSION = "v1"
optuna.logging.set_verbosity(optuna.logging.WARNING)


def load_diabetes():
    df = pd.read_csv(DATA / "diabetes.csv")
    df.columns = [c.strip().lower() for c in df.columns]
    target = "outcome" if "outcome" in df.columns else df.columns[-1]
    for c in ["glucose", "bloodpressure", "skinthickness", "insulin", "bmi"]:
        if c in df.columns:
            df[c] = df[c].replace(0, np.nan)  # zeros are missing, not measurements
    num = [c for c in df.columns if c != target]
    return df[num], df[target].astype(int), num, []


def load_heart():
    cols = ["age", "sex", "cp", "trestbps", "chol", "fbs", "restecg", "thalach",
            "exang", "oldpeak", "slope", "ca", "thal", "num"]
    df = pd.read_csv(DATA / "heart_cleveland.data", header=None, names=cols, na_values="?")
    y = (df["num"] > 0).astype(int)
    num = [c for c in cols if c not in ("num",)]
    return df[num], y, num, []


def load_stroke():
    df = pd.read_csv(DATA / "stroke.csv")
    df = df.drop(columns=["id"])
    df["bmi"] = pd.to_numeric(df["bmi"], errors="coerce")
    num = ["age", "hypertension", "heart_disease", "avg_glucose_level", "bmi"]
    cat = ["gender", "ever_married", "work_type", "Residence_type", "smoking_status"]
    return df[num + cat], df["stroke"].astype(int), num, cat


def make_pre(num, cat):
    steps = [( "n", Pipeline([("imp", SimpleImputer(strategy="median")), ("sc", StandardScaler())]), num)]
    if cat:
        steps.append(("c", Pipeline([("imp", SimpleImputer(strategy="most_frequent")),
                                     ("oh", OneHotEncoder(handle_unknown="ignore"))]), cat))
    return ColumnTransformer(steps)


def cv_pr_auc(pipe, X, y):
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=SEED)
    return cross_val_score(pipe, X, y, cv=cv, scoring="average_precision", n_jobs=-1)


def tune_xgb(pre, X_tr, y_tr):
    def obj(t):
        clf = XGBClassifier(n_estimators=t.suggest_int("n_est", 100, 300),
                            max_depth=t.suggest_int("depth", 2, 6),
                            learning_rate=t.suggest_float("lr", 0.03, 0.3, log=True),
                            subsample=t.suggest_float("sub", 0.6, 1.0),
                            scale_pos_weight=t.suggest_float("spw", 1.0, 5.0),
                            n_jobs=-1, random_state=SEED, eval_metric="logloss")
        return cross_val_score(ImbPipeline([("pre", pre), ("clf", clf)]), X_tr, y_tr,
                               cv=StratifiedKFold(3, shuffle=True, random_state=SEED),
                               scoring="average_precision", n_jobs=1).mean()
    st = optuna.create_study(direction="maximize", sampler=optuna.samplers.TPESampler(seed=SEED))
    st.optimize(obj, n_trials=20)
    p = st.best_params
    return XGBClassifier(n_estimators=p["n_est"], max_depth=p["depth"], learning_rate=p["lr"],
                         subsample=p["sub"], scale_pos_weight=p["spw"],
                         n_jobs=-1, random_state=SEED, eval_metric="logloss")


def train_one(name, X, y, num, cat):
    print(f"--- {name}: {X.shape}, pos_rate={y.mean():.3f}")
    X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.15, stratify=y, random_state=SEED)
    X_tr, X_va, y_tr, y_va = train_test_split(X_tr, y_tr, test_size=0.176, stratify=y_tr, random_state=SEED)
    pre = make_pre(num, cat)

    cands = {}
    # LR + class_weight (GridSearchCV on C)
    lr = GridSearchCV(ImbPipeline([("pre", pre), ("clf", LogisticRegression(class_weight="balanced", max_iter=2000))]),
                      {"clf__C": [0.1, 1.0, 10.0]},
                      cv=StratifiedKFold(3, shuffle=True, random_state=SEED), scoring="average_precision", n_jobs=-1)
    lr.fit(X_tr, y_tr)
    cands["logreg_weighted"] = (lr.best_estimator_, cv_pr_auc(lr.best_estimator_, X_tr, y_tr))
    # LR + SMOTE
    lr_sm = ImbPipeline([("pre", pre), ("sm", SMOTE(random_state=SEED)),
                         ("clf", LogisticRegression(max_iter=2000, C=lr.best_params_["clf__C"]))])
    cands["logreg_smote"] = (lr_sm, cv_pr_auc(lr_sm, X_tr, y_tr))
    # XGB tuned
    xgb = ImbPipeline([("pre", pre), ("clf", tune_xgb(pre, X_tr, y_tr))])
    cands["xgb"] = (xgb, cv_pr_auc(xgb, X_tr, y_tr))

    scored = {k: (float(np.mean(v[1])), float(np.std(v[1]))) for k, v in cands.items()}
    for k, (m, s) in scored.items():
        print(f"  {k:16s} CV PR-AUC {m:.4f} ± {s:.4f}")
    best = max(scored, key=lambda k: scored[k][0])
    print(f"  winner: {best}")

    # refit winner on train+val, calibrate, score once on test
    X_fit = pd.concat([X_tr, X_va])
    y_fit = np.concatenate([y_tr, y_va])
    final = CalibratedClassifierCV(cands[best][0], method="sigmoid", cv=3)
    final.fit(X_fit, y_fit)
    proba = final.predict_proba(X_te)[:, 1]
    rep = {"roc_auc": float(roc_auc_score(y_te, proba)),
           "pr_auc": float(average_precision_score(y_te, proba)),
           "brier": float(brier_score_loss(y_te, proba))}
    print(f"  test: {rep}")
    joblib.dump({"model": final, "num": num, "cat": cat, "algo": best, "version": VERSION},
                MODELS / f"{name}_{VERSION}.joblib")
    return {"algo": best, "cv": scored, "test": rep, "pos_rate": float(y.mean()), "n": int(len(y))}


def main():
    MODELS.mkdir(exist_ok=True)
    out = {"version": VERSION}
    out["diabetes"] = train_one("diabetes", *load_diabetes())
    out["heart"] = train_one("heart", *load_heart())
    out["stroke"] = train_one("stroke", *load_stroke())
    (MODELS / f"metrics_risk_{VERSION}.json").write_text(json.dumps(out, indent=2))
    print("saved diabetes/heart/stroke v1.joblib + metrics_risk_v1.json")
    print("NOTE: Pima cohort is all-female Pima Indian — document population bias for users.")


if __name__ == "__main__":
    main()
