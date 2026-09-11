import { Schema, model } from 'mongoose'

export const userRef = {
  type: Schema.Types.ObjectId,
  ref: 'User',
  required: true,
  index: true
}

export const modelOpts = { strict: 'throw', timestamps: true, versionKey: false }
