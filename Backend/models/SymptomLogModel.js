import { Schema, model } from 'mongoose'
import { userRef, modelOpts } from './common.js'

export const SymptomLogModel = model('SymptomLog', new Schema({
  userId: userRef,
  symptom: { type: String, required: true },
  severity: { type: String, default: 'Moderate' },
  notes: { type: String, default: null },
  loggedDate: { type: String, default: () => new Date().toISOString().slice(0, 10) }
}, modelOpts))
