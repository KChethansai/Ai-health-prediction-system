import { Schema, model } from "mongoose";

const scheduleEntry = new Schema(
  {
    medicineName: { type: String, required: true },
    dosage: { type: String, default: null },
    times: { type: [String], default: [] },
  },
  { _id: false },
);

const prescriptionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    imageUrl: { type: String, default: null },
    medicines: { type: Schema.Types.Mixed, required: true },
    reminderSchedule: { type: [scheduleEntry], default: [] },
  },
  { strict: "throw", timestamps: true, versionKey: false },
);

export const Prescription = model("Prescription", prescriptionSchema);
