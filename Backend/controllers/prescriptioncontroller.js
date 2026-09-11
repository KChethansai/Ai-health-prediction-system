import { PrescriptionModel as Prescription } from '../models/PrescriptionModel.js'
import { MedicationReminderModel as MedicationReminder } from '../models/MedicationReminderModel.js'

// Full pipeline: image -> Python OCR -> Prescription + per-slot MedicationReminders.
export const scan = async (req, res, next) => {
  try {
    const { imageBase64 } = req.body
    if (!imageBase64) return res.status(400).json({ error: 'imageBase64 required' })
    let ocr
    try {
      const r = await fetch(`${process.env.ML_SERVICE_URL}/ml/extract-prescription`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64 }), signal: AbortSignal.timeout(120000)
      })
      ocr = await r.json()
      if (!r.ok || ocr.error) throw new Error(ocr.error || 'OCR failed')
    } catch {
      return res.status(502).json({ error: 'OCR service unavailable' })
    }
    const meds = Array.isArray(ocr.medicines) ? ocr.medicines : []
    const prescription = await Prescription.create({
      userId: req.userId,
      medicines: meds,
      reminderSchedule: meds.map((m) => ({ medicineName: m.name, dosage: m.dosage || null, times: m.times || [] }))
    })
    const reminders = await MedicationReminder.insertMany(
      meds.flatMap((m) => (m.times || []).map((t) => ({
        userId: req.userId, medicineName: m.name,
        dosage: [m.dosage, m.frequency].filter(Boolean).join(' ') || null,
        reminderTime: t
      })))
    )
    res.status(201).json({ prescription, reminders, confidence: ocr.confidence || 'low',
      ocrConfidence: ocr.ocrConfidence ?? null, rawText: ocr.rawText || '' })
  } catch (err) {
    next(err)
  }
}

export const list = async (req, res, next) => {
  try {
    res.json(await Prescription.find({ userId: req.userId }).sort({ createdAt: -1 }).lean())
  } catch (err) {
    next(err)
  }
}

export const create = async (req, res, next) => {
  try {
    res.status(201).json(await Prescription.create({ ...req.body, userId: req.userId }))
  } catch (err) {
    next(err)
  }
}

export const getOne = async (req, res, next) => {
  try {
    const doc = await Prescription.findOne({ _id: req.params.id, userId: req.userId }).lean()
    if (!doc) return res.status(404).json({ error: 'Not found' })
    res.json(doc)
  } catch (err) {
    next(err)
  }
}

export const update = async (req, res, next) => {
  try {
    const doc = await Prescription.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId }, req.body, { new: true, runValidators: true }
    ).lean()
    if (!doc) return res.status(404).json({ error: 'Not found' })
    res.json(doc)
  } catch (err) {
    next(err)
  }
}

export const remove = async (req, res, next) => {
  try {
    await Prescription.deleteOne({ _id: req.params.id, userId: req.userId })
    res.status(204).end()
  } catch (err) {
    next(err)
  }
}
