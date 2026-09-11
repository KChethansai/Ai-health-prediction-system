import { Schema, model } from 'mongoose'
import { userRef, modelOpts } from './common.js'

export const HealthProfileModel = model('HealthProfile', new Schema({
  userId: { ...userRef, unique: true },
  age: { type: Number, default: null },
  gender: { type: String, default: null },
  heightCm: { type: Number, default: null },
  weightKg: { type: Number, default: null },
  conditions: { type: [String], default: [] }
}, modelOpts))
