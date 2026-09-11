# MediPredict — AI Health Assistant (MERN + FastAPI)

Symptom checker, health-risk analysis, prescription OCR with reminder schedules,
medicine database, and hospital finder. Plain JavaScript throughout — no TypeScript.

## Architecture

```
Vercel (Vite + React, JS) ──axios, httpOnly cookie──▶ Render: Express API ──▶ Atlas (MongoDB)
                                                          │
                                              proxy (never browser-direct)
                                                          ▼
                                              Render: FastAPI ML (15 MB joblibs + Tesseract)
```

- **Frontend** (`src/`, `vercel.json`): Apple Light theme + dark `#050505/#ff4d67`
  diagnostic views. Zustand auth, react-hook-form, react-hot-toast, axios
  `withCredentials`. Centralized classes in `src/styles/common.js`.
- **Backend** (`Backend/`, Express ESM): per-resource `*API.js` routers, Mongoose
  `*Model.js` (`strict:"throw"`), `verifyToken(...roles)` auth, `err.name` error
  handler, Socket.IO singleton, node-cron reminder ticker. Cookie session
  (`SameSite=None; Secure` in production, `trust proxy` for Render TLS).
- **ML service** (`ml-service/`, FastAPI): RandomForest symptom classifier
  (41 diseases × 132 symptoms), three calibrated risk models
  (diabetes/heart/stroke), Tesseract OCR + rapidfuzz drug matching, live SHAP
  explanations. Versioned joblibs in `ml-service/models/`, metrics JSONs beside
  them, training scripts in `ml-service/scripts/`, raw data gitignored
  (`ml-service/data/`, see `MANIFEST.json` after fetching).

## Model performance (held-out test, not training accuracy)

Symptom classifier (4,961 rows, stratified 70/15/15, 5-fold CV, winner by macro-F1):

| Model | CV macro-F1 | Notes |
|---|---|---|
| RandomForest (shipped, v1) | 1.0000 ± 0.0000 | test macro-F1 1.0000 |
| MLP baseline | 1.0000 ± 0.0000 | beat on inference cost + SHAP support |
| XGBoost (Optuna 30) | 0.9980 ± 0.0028 | |
| GradientBoosting (grid) | 0.9980 ± 0.0028 | |

Per-class precision/recall/F1 for all 41 diseases: `ml-service/models/symptom_metrics_v1.json`.
Caveat: this dataset's binary symptom signatures are near-separable — perfect
scores reflect clean data, not real-world symptom-entry noise.

Risk models (stratified 70/15/15, sigmoid-calibrated, test-once):

| Risk | Algo | ROC-AUC | PR-AUC | Brier |
|---|---|---|---|---|
| Diabetes (n=768) | XGBoost | 0.841 | 0.675 | 0.147 |
| Heart (n=303) | LogReg + class weights | 0.939 | 0.914 | 0.103 |
| Stroke (n=5,110, 4.9% positive) | LogReg + SMOTE | 0.830 | **0.235** | 0.041 |

The stroke PR-AUC is the honest number — ROC flatters imbalanced data. Heart n=303
means wide confidence intervals. Pima diabetes cohort is all-female Pima Indian;
expect population bias. Full details: `ml-service/models/metrics_risk_v1.json`.

## Local setup

Prereqs: Node 22, Python 3.12, Tesseract (`tesseract-ocr` + `eng` data), MongoDB
(local mongod or Atlas URI).

```bash
# 1. data + models (one time; needs network)
cd ml-service
python3 -m venv .venv && . .venv/bin/activate
pip install -r requirements.txt
python scripts/fetch_data.py        # real public datasets -> data/ (gitignored)
python scripts/build_drug_list.py   # OCR gazetteer from src/data/medicines
python scripts/train_symptoms.py    # -> models/symptom_*_v1.joblib + metrics
python scripts/train_metrics.py     # -> models/{diabetes,heart,stroke}_v1.joblib

# 2. ML service (terminal 1)
uvicorn main:app --port 8000
# host tesseract missing eng data? TESSDATA_PREFIX=~/.tessdata uvicorn ...

# 3. backend (terminal 2)
cd ../Backend
cp .env.example .env   # set MONGO_URI, JWT_SECRET
npm install && npm start

# 4. frontend (terminal 3)
cd ..
cp .env.example .env
npm install && npm run dev   # http://localhost:5173 (vite proxies nothing; CORS allowlists it)
```

Health: `GET localhost:5000/health` (mongo + ML status, 503 when mongo down),
`GET localhost:8000/health` (model versions, SHAP count, tesseract probe).

## Deploy

1. **Atlas**: cluster, DB user, Network Access `0.0.0.0/0` (Render free has no
   static IP). `family: 4` is already set in `connectDB()`.
2. **ML → Render**: Docker deploy from `ml-service/` (tesseract-eng baked in).
   Free tier fits the 15 MB models; expect cold starts (model + SHAP load).
3. **Backend → Render**: Docker from `Backend/` or `render.yaml` blueprint.
   Set `MONGO_URI`, `JWT_SECRET` (`openssl rand -hex 32`), `ML_SERVICE_URL`
   (ML origin), `FRONTEND_URL` (Vercel URL), `NODE_ENV=production`.
4. **Frontend → Vercel**: root `vercel.json` handles SPA rewrites.
   Set `VITE_API_URL=https://<backend>.onrender.com/api`.
5. Back in backend: confirm `FRONTEND_URL` matches, redeploy. Login should set a
   `Secure; SameSite=None` cookie; `/auth/me` must succeed cross-site.

## Known ceilings

- Render free sleeps: cron reminder ticks and cold-start latency pause on idle.
- Atlas free pauses after inactivity (first request slow).
- OCR is print-only; handwriting degrades to low-confidence + manual confirm.
- Reminder times are server-local; per-user timezones not yet stored.
- In-process cron double-fires if ever scaled multi-instance (split to worker then).
