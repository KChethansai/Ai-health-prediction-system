import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    fullName: { type: String, default: "" },
    avatarUrl: { type: String, default: null },
    role: { type: String, default: "user" },
  },
  { strict: "throw", timestamps: true, versionKey: false },
);

export const User = model("User", userSchema);
