import exp from "express";
import { SymptomLog, HealthGoal, SavedMedicine, HealthProfile } from "../models/TrackerModel.js";
import { verifyToken } from "../middleware/verifyToken.js";

export const trackerApp = exp.Router();

const crud = (Model, sort = { createdAt: -1 }) => {
  const r = exp.Router();
  r.get("/", verifyToken(), async (req, res, next) => {
    try {
      res.json(await Model.find({ userId: req.userId }).sort(sort).lean());
    } catch (err) {
      next(err);
    }
  });
  r.post("/", verifyToken(), async (req, res, next) => {
    try {
      res.status(201).json(await Model.create({ ...req.body, userId: req.userId }));
    } catch (err) {
      next(err);
    }
  });
  r.patch("/:id", verifyToken(), async (req, res, next) => {
    try {
      const doc = await Model.findOneAndUpdate(
        { _id: req.params.id, userId: req.userId }, req.body, { new: true, runValidators: true },
      ).lean();
      if (!doc) return res.status(404).json({ error: "Not found" });
      res.json(doc);
    } catch (err) {
      next(err);
    }
  });
  r.delete("/:id", verifyToken(), async (req, res, next) => {
    try {
      await Model.deleteOne({ _id: req.params.id, userId: req.userId });
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  });
  return r;
};

trackerApp.use("/symptom-logs", crud(SymptomLog));
trackerApp.use("/goals", crud(HealthGoal));
trackerApp.use("/saved-medicines", crud(SavedMedicine));

// Health profile is singleton-per-user: PUT upserts.
trackerApp.get("/health-profile", verifyToken(), async (req, res, next) => {
  try {
    const p = await HealthProfile.findOne({ userId: req.userId }).lean();
    if (!p) return res.status(404).json({ error: "Not found" });
    res.json(p);
  } catch (err) {
    next(err);
  }
});
trackerApp.put("/health-profile", verifyToken(), async (req, res, next) => {
  try {
    const p = await HealthProfile.findOneAndUpdate(
      { userId: req.userId }, req.body, { upsert: true, new: true, runValidators: true },
    ).lean();
    res.json(p);
  } catch (err) {
    next(err);
  }
});
