import mongoose from "mongoose";

const yogaPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    preferences: {
      age: Number,
      gender: { type: String, enum: ["Male", "Female", "Other"] },
      weight: Number,
      height: Number,
      fitnessLevel: { type: String, enum: ["Beginner", "Intermediate", "Advanced"] },
      goal: {
        type: String,
        enum: ["Flexibility", "Strength", "Balance", "Relaxation", "Stress Relief", "Mindfulness"]
      },
      duration: String, // e.g., "20 min"
      focusAreas: { type: [String], default: [] },
      sessionTime: String, // Morning, Evening, Anytime
    },
    plan: {
      type: Object, // AI-generated yoga session JSON
      required: true,
    }
  },
  { timestamps: true }
);

export const YogaPlan = mongoose.model("YogaPlan", yogaPlanSchema);
