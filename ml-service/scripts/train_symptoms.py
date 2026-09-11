"""MODEL 1: symptom -> disease classifier.

Data: Kaggle mirror, 41 diseases x 132 binary symptoms (data/symptom_train.csv +
data/symptom_test.csv merged, then stratified 70/15/15 train/val/test).
Contenders: XGBoost + HistGradientBoosting (primary, winner by CV macro-F1),
RandomForest + MLP baselines. Winner refit on train+val, scored once on test.
Saves models/symptom_<algo>_v1.joblib + models/symptom_metrics_v1.json.
"""
import json
import warnings
from pathlib import Path

import joblib
import numpy as np
import optuna
import pandas as pd
from sklearn.ensemble import HistGradientBoostingClassifier, RandomForestClassifier
from sklearn.metrics import classification_report, f1_score
from sklearn.model_selection import StratifiedKFold, cross_val_score, GridSearchCV, train_test_split
from sklearn.neural_network import MLPClassifier
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import LabelEncoder, StandardScaler
from xgboost import XGBClassifier

warnings.filterwarnings("ignore")
SEED = 42
HERE = Path(__file__).resolve().parent.parent
DATA, MODELS = HERE / "data", HERE / "models"
VERSION = "v1"
optuna.logging.set_verbosity(optuna.logging.WARNING)


def load():
    train = pd.read_csv(DATA / "symptom_train.csv")
    test = pd.read_csv(DATA / "symptom_test.csv")
    df = pd.concat([train, test], ignore_index=True).dropna()
    X = df.drop(columns=["prognosis"]).astype(int)
    le = LabelEncoder()
    y = le.fit_transform(df["prognosis"])
    return X, y, le, list(X.columns)


def cv_macro_f1(est, X, y):
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=SEED)
    return cross_val_score(est, X, y, cv=cv, scoring="f1_macro", n_jobs=-1)


def main():
    MODELS.mkdir(exist_ok=True)
    X, y, le, symptoms = load()
    print(f"data: {X.shape}, classes: {len(le.classes_)}")
    X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.15, stratify=y, random_state=SEED)
    X_tr, X_va, y_tr, y_va = train_test_split(X_tr, y_tr, test_size=0.176, stratify=y_tr, random_state=SEED)  # 70/15/15

    results = {}

    # --- XGBoost (Optuna, 30 trials) ---
    def xgb_obj(t):
        p = dict(n_estimators=t.suggest_int("n_est", 100, 400), max_depth=t.suggest_int("depth", 3, 8),
                 learning_rate=t.suggest_float("lr", 0.03, 0.3, log=True),
                 subsample=t.suggest_float("sub", 0.6, 1.0), colsample_bytree=t.suggest_float("col", 0.6, 1.0),
                 reg_lambda=t.suggest_float("lam", 1e-3, 10.0, log=True),
                 n_jobs=-1, random_state=SEED, eval_metric="mlogloss")
        return cross_val_score(XGBClassifier(**p), X_tr, y_tr,
                               cv=StratifiedKFold(3, shuffle=True, random_state=SEED),
                               scoring="f1_macro", n_jobs=1).mean()
    st = optuna.create_study(direction="maximize", sampler=optuna.samplers.TPESampler(seed=SEED))
    st.optimize(xgb_obj, n_trials=30)
    xgb = XGBClassifier(**st.best_params, n_jobs=-1, random_state=SEED, eval_metric="mlogloss")
    results["xgboost"] = {"cv_macro_f1": cv_macro_f1(xgb, X_tr, y_tr).tolist(), "params": st.best_params}

    # --- Gradient Boosting = sklearn HistGradientBoosting (GridSearchCV) ---
    gb_grid = {"max_depth": [5, 8, None], "learning_rate": [0.05, 0.1], "max_iter": [200, 400]}
    gb = GridSearchCV(HistGradientBoostingClassifier(random_state=SEED), gb_grid,
                      cv=StratifiedKFold(3, shuffle=True, random_state=SEED), scoring="f1_macro", n_jobs=-1)
    gb.fit(X_tr, y_tr)
    gb = gb.best_estimator_
    results["gradboost"] = {"cv_macro_f1": cv_macro_f1(gb, X_tr, y_tr).tolist(), "params": dict(gb.get_params())}

    # --- RandomForest baseline (small grid) ---
    rf = GridSearchCV(RandomForestClassifier(random_state=SEED, n_jobs=-1),
                      {"n_estimators": [200, 400], "max_depth": [None, 20], "min_samples_leaf": [1, 2]},
                      cv=StratifiedKFold(3, shuffle=True, random_state=SEED), scoring="f1_macro", n_jobs=-1)
    rf.fit(X_tr, y_tr)
    rf = rf.best_estimator_
    results["randomforest"] = {"cv_macro_f1": cv_macro_f1(rf, X_tr, y_tr).tolist()}

    # --- MLP baseline (scaled, small grid) ---
    mlp = GridSearchCV(make_pipeline(StandardScaler(), MLPClassifier(random_state=SEED, max_iter=800)),
                       {"mlpclassifier__hidden_layer_sizes": [(128,), (128, 64)], "mlpclassifier__alpha": [1e-4, 1e-3]},
                       cv=StratifiedKFold(3, shuffle=True, random_state=SEED), scoring="f1_macro", n_jobs=-1)
    mlp.fit(X_tr, y_tr)
    mlp = mlp.best_estimator_
    results["mlp"] = {"cv_macro_f1": cv_macro_f1(mlp, X_tr, y_tr).tolist()}

    for name, r in results.items():
        r["cv_mean"] = float(np.mean(r["cv_macro_f1"]))
        r["cv_std"] = float(np.std(r["cv_macro_f1"]))
        print(f"{name:12s} CV macro-F1 {r['cv_mean']:.4f} ± {r['cv_std']:.4f}")

    # --- winner refit on train+val, honest score on held-out test ---
    winner_name = max(results, key=lambda n: results[n]["cv_mean"])
    winner = {"xgboost": xgb, "gradboost": gb, "randomforest": rf, "mlp": mlp}[winner_name]
    X_fit = pd.concat([X_tr, X_va])
    y_fit = np.concatenate([y_tr, y_va])
    winner.fit(X_fit, y_fit)
    y_pred = winner.predict(X_te)
    report = classification_report(y_te, y_pred, target_names=list(le.classes_), output_dict=True, zero_division=0)
    test_macro = float(f1_score(y_te, y_pred, average="macro"))
    print(f"WINNER {winner_name} test macro-F1 {test_macro:.4f}")

    # feature importance (winner-native; MLP falls back to zeros — never wins ties here)
    if hasattr(winner, "feature_importances_"):
        imp = winner.feature_importances_
    elif hasattr(winner, "coef_"):
        imp = np.abs(winner.coef_).mean(axis=0)
    else:
        imp = np.zeros(len(symptoms))
    top_imp = sorted(zip(symptoms, [float(v) for v in imp]), key=lambda x: -x[1])[:20]

    joblib.dump({"model": winner, "labels": list(le.classes_), "symptoms": symptoms,
                 "algo": winner_name, "version": VERSION}, MODELS / f"symptom_{winner_name}_{VERSION}.joblib")
    metrics = {"version": VERSION, "algo": winner_name, "n_classes": len(le.classes_),
               "n_features": len(symptoms), "contenders": results,
               "test_macro_f1": test_macro, "per_class": report,
               "top_features": [{"symptom": s, "importance": v} for s, v in top_imp]}
    (MODELS / f"symptom_metrics_{VERSION}.json").write_text(json.dumps(metrics, indent=2))
    print(f"saved models/symptom_{winner_name}_{VERSION}.joblib + metrics")


if __name__ == "__main__":
    main()
