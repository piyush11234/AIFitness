// models/meditationPlanModel.js
import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  duration: { type: String, required: true }, // e.g., "5 min"
  media: { type: String, default: null }, // optional audio/image URL
  description: { type: String, required: true },
  instructions: { type: String, required: true },
});

const meditationPlanSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    preferences: { type: Object, required: true }, // store wizard preferences
    plan: {
      totalDuration: { type: String },
      sessions: [sessionSchema],
      notes: [String],
    },
  },
  { timestamps: true }
);

export const MeditationPlan = mongoose.model(
  "MeditationPlan",
  meditationPlanSchema
);
