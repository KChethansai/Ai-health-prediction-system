import { Router } from 'express'
import { verifyToken } from '../middlewares/verifyToken.js'
import { scan, list, create, getOne, update, remove } from '../controllers/prescriptioncontroller.js'

export const prescriptionApp = Router()

prescriptionApp.post('/scan', verifyToken(), scan)
prescriptionApp.get('/', verifyToken(), list)
prescriptionApp.post('/', verifyToken(), create)
prescriptionApp.get('/:id', verifyToken(), getOne)
prescriptionApp.patch('/:id', verifyToken(), update)
prescriptionApp.delete('/:id', verifyToken(), remove)
