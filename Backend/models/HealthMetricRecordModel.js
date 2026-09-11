import { Schema, model } from 'mongoose';

const healthMetricRecordSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    age: { type: Number, default: null },
    systolicBp: { type: Number, default: null },
    diastolicBp: { type: Number, default: null },
    glucose: { type: Number, default: null },
    heightCm: { type: Number, default: null },
    weightKg: { type: Number, default: null },
    bmi: { type: Number, default: null },
    conditions: { type: [String], default: [] },
    riskResult: { type: Schema.Types.Mixed, default: null },
  },
  { strict: 'throw', timestamps: true, versionKey: false },
);

export const HealthMetricRecordModel = model('HealthMetricRecord', healthMetricRecordSchema);
