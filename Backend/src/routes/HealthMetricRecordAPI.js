import exp from "express";
import { HealthMetricRecord } from "../models/HealthMetricRecordModel.js";
import { verifyToken } from "../middleware/verifyToken.js";

export const healthMetricApp = exp.Router();

healthMetricApp.get("/", verifyToken(), async (req, res, next) => {
  try {
    res.json(await HealthMetricRecord.find({ userId: req.userId }).sort({ createdAt: -1 }).lean());
  } catch (err) {
    next(err);
  }
});

healthMetricApp.post("/", verifyToken(), async (req, res, next) => {
  try {
    const body = { ...req.body };
    if (body.weightKg && body.heightCm && !body.bmi) {
      const m = body.heightCm / 100;
      body.bmi = Math.round((body.weightKg / (m * m)) * 10) / 10;
    }
    res.status(201).json(await HealthMetricRecord.create({ ...body, userId: req.userId }));
  } catch (err) {
    next(err);
  }
});

healthMetricApp.get("/:id", verifyToken(), async (req, res, next) => {
  try {
    const doc = await HealthMetricRecord.findOne({ _id: req.params.id, userId: req.userId }).lean();
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json(doc);
  } catch (err) {
    next(err);
  }
});

healthMetricApp.patch("/:id", verifyToken(), async (req, res, next) => {
  try {
    const doc = await HealthMetricRecord.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId }, req.body, { new: true, runValidators: true },
    ).lean();
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json(doc);
  } catch (err) {
    next(err);
  }
});

healthMetricApp.delete("/:id", verifyToken(), async (req, res, next) => {
  try {
    await HealthMetricRecord.deleteOne({ _id: req.params.id, userId: req.userId });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});
