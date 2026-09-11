import { Router } from 'express'
import { verifyToken } from '../middlewares/verifyToken.js'

export const crud = (Model, sort = { createdAt: -1 }) => {
  const r = Router()
  r.get('/', verifyToken(), async (req, res, next) => {
    try {
      res.json(await Model.find({ userId: req.userId }).sort(sort).lean())
    } catch (err) {
      next(err)
    }
  })
  r.post('/', verifyToken(), async (req, res, next) => {
    try {
      res.status(201).json(await Model.create({ ...req.body, userId: req.userId }))
    } catch (err) {
      next(err)
    }
  })
  r.patch('/:id', verifyToken(), async (req, res, next) => {
    try {
      const doc = await Model.findOneAndUpdate(
        { _id: req.params.id, userId: req.userId }, req.body, { new: true, runValidators: true }
      ).lean()
      if (!doc) return res.status(404).json({ error: 'Not found' })
      res.json(doc)
    } catch (err) {
      next(err)
    }
  })
  r.delete('/:id', verifyToken(), async (req, res, next) => {
    try {
      await Model.deleteOne({ _id: req.params.id, userId: req.userId })
      res.status(204).end()
    } catch (err) {
      next(err)
    }
  })
  return r
}

export const getHealthProfile = (Model) => async (req, res, next) => {
  try {
    const p = await Model.findOne({ userId: req.userId }).lean()
    if (!p) return res.status(404).json({ error: 'Not found' })
    res.json(p)
  } catch (err) {
    next(err)
  }
}

export const putHealthProfile = (Model) => async (req, res, next) => {
  try {
    const p = await Model.findOneAndUpdate(
      { userId: req.userId }, req.body, { upsert: true, new: true, runValidators: true }
    ).lean()
    res.json(p)
  } catch (err) {
    next(err)
  }
}
