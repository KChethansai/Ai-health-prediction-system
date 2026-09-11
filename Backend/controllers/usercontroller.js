import { UserModel as User } from '../models/UserModel.js'

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).lean();
    if (!user) return res.status(404).json({ error: 'Not found' });
    res.json({ id: user._id, email: user.email, fullName: user.fullName, avatarUrl: user.avatarUrl });
  } catch (err) {
    next(err);
  }
};

export const updateMe = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.userId,
      { fullName: req.body.fullName, avatarUrl: req.body.avatarUrl },
      { new: true, runValidators: true },
    ).lean();
    if (!user) return res.status(404).json({ error: 'Not found' });
    res.json({ id: user._id, email: user.email, fullName: user.fullName, avatarUrl: user.avatarUrl });
  } catch (err) {
    next(err);
  }
};
