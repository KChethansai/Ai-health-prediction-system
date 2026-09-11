import { Router } from 'express'
import { verifyToken } from '../middlewares/verifyToken.js'
import { list, create, getOne, update, remove } from '../controllers/healthMetricRecordcontroller.js'

export const healthMetricApp = Router()

healthMetricApp.get('/', verifyToken(), list)
healthMetricApp.post('/', verifyToken(), create)
healthMetricApp.get('/:id', verifyToken(), getOne)
healthMetricApp.patch('/:id', verifyToken(), update)
healthMetricApp.delete('/:id', verifyToken(), remove)
