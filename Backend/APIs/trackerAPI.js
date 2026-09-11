import { Router } from 'express'
import { verifyToken } from '../middlewares/verifyToken.js'
import { SymptomLogModel as SymptomLog } from '../models/SymptomLogModel.js'
import { HealthGoalModel as HealthGoal } from '../models/HealthGoalModel.js'
import { SavedMedicineModel as SavedMedicine } from '../models/SavedMedicineModel.js'
import { HealthProfileModel as HealthProfile } from '../models/HealthProfileModel.js'
import { crud, getHealthProfile, putHealthProfile } from '../controllers/trackercontroller.js'

export const trackerApp = Router()

trackerApp.use('/symptom-logs', crud(SymptomLog))
trackerApp.use('/goals', crud(HealthGoal))
trackerApp.use('/saved-medicines', crud(SavedMedicine))

// Health profile is singleton-per-user: PUT upserts.
trackerApp.get('/health-profile', verifyToken(), getHealthProfile(HealthProfile))
trackerApp.put('/health-profile', verifyToken(), putHealthProfile(HealthProfile))
