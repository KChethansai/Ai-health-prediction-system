import "dotenv/config";
import { createServer } from "http";
import exp from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { connectDB } from "./src/db.js";
import { initSocket } from "./src/socket.js";
import { startReminders } from "./src/reminders.js";
import { notFound, errorHandler } from "./src/middleware/errorHandler.js";
import { authApp } from "./src/routes/AuthAPI.js";
import { userApp } from "./src/routes/UserAPI.js";
import { symptomCheckApp } from "./src/routes/SymptomCheckAPI.js";
import { healthMetricApp } from "./src/routes/HealthMetricRecordAPI.js";
import { prescriptionApp } from "./src/routes/PrescriptionAPI.js";
import { reminderApp } from "./src/routes/MedicationReminderAPI.js";
import { predictApp } from "./src/routes/PredictAPI.js";
import { trackerApp } from "./src/routes/TrackerAPI.js";
import { hospitalsApp } from "./src/routes/HospitalsAPI.js";

const app = exp();
app.set("trust proxy", 1); // Render terminates TLS upstream
app.use(helmet());
const frontendUrls = (process.env.FRONTEND_URL || "").split(",").map((o) => o.trim()).filter(Boolean);
if (process.env.NODE_ENV === "production" && frontendUrls.length === 0) {
  throw new Error("FRONTEND_URL must be set in production (comma-separated allowlist)");
}
app.use(cors({ origin: frontendUrls.length ? frontendUrls : true, credentials: true }));
app.use(exp.json({ limit: "12mb" })); // base64 prescriptions
app.use(cookieParser());
app.use("/api/", rateLimit({ windowMs: 60_000, max: 120 }));
const bootAt = Date.now();
app.get("/health", async (_req, res) => {
  const mongo = mongoose.connection.readyState === 1 ? "up" : "down";
  let ml = "unknown";
  if (process.env.ML_SERVICE_URL) {
    try {
      const r = await fetch(`${process.env.ML_SERVICE_URL}/health`, { signal: AbortSignal.timeout(5000) });
      ml = r.ok ? "up" : "down";
    } catch {
      ml = "down";
    }
  }
  const body = { ok: mongo === "up", uptime: Math.round((Date.now() - bootAt) / 1000),
    version: "1.0.0", mongo, ml };
  res.status(mongo === "up" ? 200 : 503).json(body);
});

app.use("/api/auth", authApp);
app.use("/api/users", userApp);
app.use("/api/symptom-checks", symptomCheckApp);
app.use("/api/health-metrics", healthMetricApp);
app.use("/api/prescriptions", prescriptionApp);
app.use("/api/reminders", reminderApp);
app.use("/api/predict", predictApp);
app.use("/api", trackerApp);
app.use("/api/hospitals", hospitalsApp);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
const server = createServer(app);
await connectDB(process.env.MONGO_URI);
initSocket(server);
startReminders();
server.listen(port, () => console.log(`Backend :${port}`));
