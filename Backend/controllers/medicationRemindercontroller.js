import { MedicationReminderModel as MedicationReminder } from '../models/MedicationReminderModel.js'

export const list = async (req, res, next) => {
  try {
    res.json(await MedicationReminder.find({ userId: req.userId }).sort({ reminderTime: 1 }).lean());
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    res.status(201).json(await MedicationReminder.create({ ...req.body, userId: req.userId }));
  } catch (err) {
    next(err);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const doc = await MedicationReminder.findOne({ _id: req.params.id, userId: req.userId }).lean();
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const doc = await MedicationReminder.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId }, req.body, { new: true, runValidators: true },
    ).lean();
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    await MedicationReminder.deleteOne({ _id: req.params.id, userId: req.userId });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
