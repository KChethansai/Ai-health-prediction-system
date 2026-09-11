import { Schema, model } from 'mongoose'
import { userRef, modelOpts } from './common.js'

export const HealthGoalModel = model('HealthGoal', new Schema({
  userId: userRef,
  title: { type: String, required: true },
  targetValue: { type: Number, default: null },
  currentValue: { type: Number, default: 0 },
  unit: { type: String, default: null },
  status: { type: String, default: 'active' }
}, modelOpts))
