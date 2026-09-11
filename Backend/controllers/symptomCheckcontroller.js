import { SymptomCheckModel as SymptomCheck } from '../models/SymptomCheckModel.js'

export const list = async (req, res, next) => {
  try {
    res.json(await SymptomCheck.find({ userId: req.userId }).sort({ createdAt: -1 }).lean());
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    res.status(201).json(await SymptomCheck.create({ ...req.body, userId: req.userId }));
  } catch (err) {
    next(err);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const doc = await SymptomCheck.findOne({ _id: req.params.id, userId: req.userId }).lean();
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const doc = await SymptomCheck.findOneAndUpdate(
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
    await SymptomCheck.deleteOne({ _id: req.params.id, userId: req.userId });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
