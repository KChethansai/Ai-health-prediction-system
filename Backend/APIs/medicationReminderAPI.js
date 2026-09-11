import { Router } from 'express'
import { verifyToken } from '../middlewares/verifyToken.js'
import { list, create, getOne, update, remove } from '../controllers/medicationRemindercontroller.js'

export const reminderApp = Router()

reminderApp.get('/', verifyToken(), list);
reminderApp.post('/', verifyToken(), create);
reminderApp.get('/:id', verifyToken(), getOne);
reminderApp.patch('/:id', verifyToken(), update);
reminderApp.delete('/:id', verifyToken(), remove);
