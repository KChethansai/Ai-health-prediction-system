import { Schema, model } from "mongoose";

const userRef = { type: Schema.Types.ObjectId, ref: "User", required: true, index: true };
const opts = { strict: "throw", timestamps: true, versionKey: false };

export const SymptomLog = model("SymptomLog", new Schema({
  userId: userRef,
  symptom: { type: String, required: true },
  severity: { type: String, default: "Moderate" },
  notes: { type: String, default: null },
  loggedDate: { type: String, default: () => new Date().toISOString().slice(0, 10) },
}, opts));

export const HealthGoal = model("HealthGoal", new Schema({
  userId: userRef,
  title: { type: String, required: true },
  targetValue: { type: Number, default: null },
  currentValue: { type: Number, default: 0 },
  unit: { type: String, default: null },
  status: { type: String, default: "active" },
}, opts));

export const SavedMedicine = model("SavedMedicine", new Schema({
  userId: userRef,
  medicineId: { type: String, required: true },
  medicineName: { type: String, required: true },
  drugClass: { type: String, default: "" },
}, opts));
SavedMedicine.schema.index({ userId: 1, medicineId: 1 }, { unique: true });

export const HealthProfile = model("HealthProfile", new Schema({
  userId: { ...userRef, unique: true },
  age: { type: Number, default: null },
  gender: { type: String, default: null },
  heightCm: { type: Number, default: null },
  weightKg: { type: Number, default: null },
  conditions: { type: [String], default: [] },
}, opts));
