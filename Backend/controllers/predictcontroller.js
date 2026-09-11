import { SymptomCheckModel as SymptomCheck } from '../models/SymptomCheckModel.js'
import { HealthMetricRecordModel as HealthMetricRecord } from '../models/HealthMetricRecordModel.js'

const callML = async (path, body) => {
  const r = await fetch(`${process.env.ML_SERVICE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(process.env.ML_SERVICE_TOKEN ? { Authorization: `Bearer ${process.env.ML_SERVICE_TOKEN}` } : {})
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(60000)
  })
  const data = await r.json().catch(() => ({}))
  if (!r.ok) {
    const err = new Error(data.error || 'ML service error')
    err.status = r.status
    throw err
  }
  return data
}

// Frontend never talks to Python directly; Express proxies + persists.
export const predictSymptoms = async (req, res, next) => {
  try {
    const { symptoms, severity = 'Moderate' } = req.body
    if (!Array.isArray(symptoms) || symptoms.length < 2) {
      return res.status(400).json({ error: 'At least 2 symptoms required' })
    }
    const result = await callML('/predict/symptoms', { symptoms, severity })
    const saved = await SymptomCheck.create({ userId: req.userId, symptoms, severity, result })
    res.status(201).json(saved)
  } catch (err) {
    if (err instanceof TypeError) return res.status(502).json({ error: 'ML service unavailable' })
    next(err)
  }
}

export const predictMetrics = async (req, res, next) => {
  try {
    const result = await callML('/predict/metrics', req.body)
    const saved = await HealthMetricRecord.create({ ...req.body, userId: req.userId, riskResult: result })
    res.status(201).json(saved)
  } catch (err) {
    if (err instanceof TypeError) return res.status(502).json({ error: 'ML service unavailable' })
    next(err)
  }
}
