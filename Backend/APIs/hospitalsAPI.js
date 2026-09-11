import { Router } from 'express'
import { verifyToken } from '../middlewares/verifyToken.js'
import { search } from '../controllers/hospitalscontroller.js'

export const hospitalsApp = Router()

hospitalsApp.post('/search', verifyToken(), search)
