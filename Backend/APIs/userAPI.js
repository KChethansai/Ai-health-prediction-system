import { Router } from 'express'
import { verifyToken } from '../middlewares/verifyToken.js'
import { getMe, updateMe } from '../controllers/usercontroller.js'

export const userApp = Router()

userApp.get('/me', verifyToken(), getMe);
userApp.patch('/me', verifyToken(), updateMe);
