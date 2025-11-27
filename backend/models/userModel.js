import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"],

        },

        hasCompletedOnboarding: { type: Boolean, default: false },
        dietType: { type: String, default: null },
        allergies: { type: [String], default: [] },



        // ✅ Basic Info
        age: { type: Number },
        gender: { type: String, enum: ["Male", "Female", "Other"] },
        height: { type: Number }, // in cm
        weight: { type: Number }, // in kg
        goal: {
            type: String,
            enum: ["Lose Weight", "Gain Muscle", "Stay Fit", "Build Endurance"],
            default: "Stay Fit",
        },

        // ✅ Fitness Data
        activityLevel: {
            type: String,
            enum: ["Beginner", "Intermediate", "Advanced"],
            default: "Beginner",
        },
        targetCalories: { type: Number }, // optional AI recommendation
        workoutsCompleted: { type: Number, default: 0 },
        totalWorkoutTime: { type: Number, default: 0 }, // in minutes
        preferredWorkoutType: {
            type: [String], // e.g. ["Yoga", "Cardio", "Strength"]
            default: [],
        },

        // ✅ Progress Tracking
        progressHistory: [
            {
                date: { type: Date, default: Date.now },
                weight: Number,
                caloriesBurned: Number,
                workoutMinutes: Number,
            },
        ],

        // ✅ AI Recommendations
        aiRecommendations: [
            {
                date: { type: Date, default: Date.now },
                recommendation: String,
                focusArea: String, // e.g. "Legs", "Cardio", "Core"
            },
        ],

        // ✅ Profile Image
        profilePic: {
            type: String,
        },

        // ✅ Account Meta
        role: { type: String, enum: ["user", "admin"], default: "user" },


        isVerified: { type: Boolean, default: false },
        isLoggedIn: { type: Boolean, default: false },
        token: { type: String, default: null },
        otp: { type: String, default: null },
        otpExpiry: { type: Date, default: null },
    },
    { timestamps: true }
);

export const User = mongoose.model("User", userSchema);

