import exp from "express";
import { MedicationReminder } from "../models/MedicationReminderModel.js";
import { verifyToken } from "../middleware/verifyToken.js";

export const reminderApp = exp.Router();

reminderApp.get("/", verifyToken(), async (req, res, next) => {
  try {
    res.json(await MedicationReminder.find({ userId: req.userId }).sort({ reminderTime: 1 }).lean());
  } catch (err) {
    next(err);
  }
});

reminderApp.post("/", verifyToken(), async (req, res, next) => {
  try {
    res.status(201).json(await MedicationReminder.create({ ...req.body, userId: req.userId }));
  } catch (err) {
    next(err);
  }
});

reminderApp.get("/:id", verifyToken(), async (req, res, next) => {
  try {
    const doc = await MedicationReminder.findOne({ _id: req.params.id, userId: req.userId }).lean();
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json(doc);
  } catch (err) {
    next(err);
  }
});

reminderApp.patch("/:id", verifyToken(), async (req, res, next) => {
  try {
    const doc = await MedicationReminder.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId }, req.body, { new: true, runValidators: true },
    ).lean();
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json(doc);
  } catch (err) {
    next(err);
  }
});

reminderApp.delete("/:id", verifyToken(), async (req, res, next) => {
  try {
    await MedicationReminder.deleteOne({ _id: req.params.id, userId: req.userId });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});
