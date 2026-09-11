import { Schema, model } from "mongoose";

const medicationReminderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    medicineName: { type: String, required: true },
    dosage: { type: String, default: null },
    reminderTime: { type: String, default: "08:00" },
    isActive: { type: Boolean, default: true },
    lastFiredAt: { type: Date, default: null },
  },
  { strict: "throw", timestamps: true, versionKey: false },
);

export const MedicationReminder = model("MedicationReminder", medicationReminderSchema);
