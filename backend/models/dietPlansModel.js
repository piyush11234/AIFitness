import mongoose from "mongoose";

const dietPlanSchema = new mongoose.Schema(
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
      goal: { type: String, enum: ["Lose Weight", "Gain Muscle", "Stay Fit", "Build Endurance"] },
      activityLevel: { type: String, enum: ["Beginner", "Intermediate", "Advanced"] },
      dietType: String, // Veg / Non-Veg / Vegan
      allergies: { type: [String], default: [] },
      mealsPerDay: Number,
      cookingSkill: { type: String, enum: ["Beginner", "Intermediate", "Advanced"] },
      budget: { type: String },
      favoriteFoods: { type: [String], default: [] },
      beveragePreference: String
    },
    plan: {
      type: Object, // AI-generated diet plan JSON
      required: true,
    }
  },
  { timestamps: true }
);

export const DietPlan = mongoose.model("DietPlan", dietPlanSchema);
