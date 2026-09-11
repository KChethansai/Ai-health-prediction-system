// API index: single router aggregating every resource router under /api/v1.
import { Router } from 'express'
import { authApp } from './authAPI.js'
import { userApp } from './userAPI.js'
import { symptomCheckApp } from './symptomCheckAPI.js'
import { healthMetricApp } from './healthMetricRecordAPI.js'
import { prescriptionApp } from './prescriptionAPI.js'
import { reminderApp } from './medicationReminderAPI.js'
import { predictApp } from './predictAPI.js'
import { trackerApp } from './trackerAPI.js'
import { hospitalsApp } from './hospitalsAPI.js'

const router = Router()

router.use('/auth', authApp)
router.use('/users', userApp)
router.use('/symptom-checks', symptomCheckApp)
router.use('/health-metrics', healthMetricApp)
router.use('/prescriptions', prescriptionApp)
router.use('/reminders', reminderApp)
router.use('/predict', predictApp)
router.use('/', trackerApp)
router.use('/hospitals', hospitalsApp)

export default router
