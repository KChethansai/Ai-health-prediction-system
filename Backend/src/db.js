import mongoose from "mongoose";

export const connectDB = async (uri) => {
  if (!uri) throw new Error("MONGO_URI missing");
  await mongoose.connect(uri, { family: 4 });
};
