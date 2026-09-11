import bcrypt from 'bcryptjs'
import { UserModel as User } from '../models/UserModel.js'
import { signToken } from '../middlewares/verifyToken.js'

const sameSite =
  process.env.COOKIE_SAME_SITE || (process.env.NODE_ENV === 'production' ? 'none' : 'lax')

const COOKIE_OPTS = {
  httpOnly: true,
  sameSite,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/'
}

const session = (res, user, status = 200) => {
  const token = signToken(user)
  res.cookie('token', token, COOKIE_OPTS)
  // ponytail: token also in body for non-browser clients; browsers ignore it (cookie wins)
  res.status(status).json({ token, user: { id: user._id, email: user.email, fullName: user.fullName } })
}

export const signup = async (req, res, next) => {
  try {
    const { email, password, fullName = '' } = req.body
    if (!email || !password) return res.status(400).json({ error: 'email+password required' })
    if (await User.findOne({ email })) return res.status(409).json({ error: 'Email taken' })
    const user = await User.create({ email, passwordHash: await bcrypt.hash(password, 10), fullName })
    session(res, user, 201)
  } catch (err) {
    next(err)
  }
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    session(res, user)
  } catch (err) {
    next(err)
  }
}

export const logout = async (_req, res, next) => {
  try {
    res.clearCookie('token', { path: '/' })
    res.status(204).end()
  } catch (err) {
    next(err)
  }
}

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).lean()
    if (!user) return res.status(404).json({ error: 'Not found' })
    res.json({ id: user._id, email: user.email, fullName: user.fullName })
  } catch (err) {
    next(err)
  }
}
