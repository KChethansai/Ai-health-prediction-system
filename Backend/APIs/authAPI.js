import { Router } from 'express'
import { verifyToken } from '../middlewares/verifyToken.js'
import { signup, login, logout, getMe } from '../controllers/authcontroller.js'

export const authApp = Router()

authApp.post('/signup', signup)
authApp.post('/login', login)
authApp.post('/logout', logout)
authApp.get('/me', verifyToken(), getMe)
