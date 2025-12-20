// models/exerciseModel.js
import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String }, // Cardio / Strength / Yoga
  goal: { type: String }, // Lose Weight / Muscle Gain / Maintain
  minBMI: { type: Number, default: 0 },
  maxBMI: { type: Number, default: 100 },
  activityLevel: { type: String }, // Beginner / Intermediate / Advanced
  mediaUrl: { type: String }, // GIF / Video / Image
  reps: { type: String }, // e.g., "10-15" or duration "30s"
});

export const Exercise = mongoose.model("Exercise", exerciseSchema);
