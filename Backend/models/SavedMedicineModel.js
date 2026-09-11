import { Schema, model } from 'mongoose'
import { userRef, modelOpts } from './common.js'

const savedMedicineSchema = new Schema({
  userId: userRef,
  medicineId: { type: String, required: true },
  medicineName: { type: String, required: true },
  drugClass: { type: String, default: '' }
}, modelOpts)

savedMedicineSchema.index({ userId: 1, medicineId: 1 }, { unique: true })

export const SavedMedicineModel = model('SavedMedicine', savedMedicineSchema)
