import mongoose from "mongoose";

const workoutPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // User preferences at generation time
    preferences: {
      goal: String,
      activityLevel: String,
      bmiCategory: String,
    },

    // Full AI-generated workout plan
    plan: {
      type: Object,
      required: true,
    },

    // Meta
    source: {
      type: String,
      enum: ["AI", "Fallback"],
      default: "AI",
    },
  },
  { timestamps: true }
);

export const WorkoutPlan = mongoose.model("WorkoutPlan", workoutPlanSchema);
