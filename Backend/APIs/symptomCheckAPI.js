import { Router } from 'express'
import { verifyToken } from '../middlewares/verifyToken.js'
import { list, create, getOne, update, remove } from '../controllers/symptomCheckcontroller.js'

export const symptomCheckApp = Router()

symptomCheckApp.get('/', verifyToken(), list);
symptomCheckApp.post('/', verifyToken(), create);
symptomCheckApp.get('/:id', verifyToken(), getOne);
symptomCheckApp.patch('/:id', verifyToken(), update);
symptomCheckApp.delete('/:id', verifyToken(), remove);
