import { Schema, model } from "mongoose";

const symptomCheckSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    symptoms: { type: [String], required: true },
    severity: { type: String, default: "Moderate" },
    result: { type: Schema.Types.Mixed, required: true },
  },
  { strict: "throw", timestamps: true, versionKey: false },
);

export const SymptomCheck = model("SymptomCheck", symptomCheckSchema);
