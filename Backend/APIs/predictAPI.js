import { Router } from 'express'
import { verifyToken } from '../middlewares/verifyToken.js'
import { predictSymptoms, predictMetrics } from '../controllers/predictcontroller.js'

export const predictApp = Router()

predictApp.post('/symptoms', verifyToken(), predictSymptoms)
predictApp.post('/metrics', verifyToken(), predictMetrics)
