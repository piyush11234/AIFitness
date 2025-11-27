import { User } from "../models/userModel.js";

export const saveOnboardingData = async (req, res) => {
  try {
    const userId = req.userId;
    const {
      age,
      gender,
      height,
      weight,
      goal,
      activityLevel,
      preferredWorkoutType,
      dietType,
      allergies
    } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.age = age;
    user.gender = gender;
    user.height = height;
    user.weight = weight;
    user.goal = goal;
    user.activityLevel = activityLevel;
    user.preferredWorkoutType = preferredWorkoutType;
    user.dietType = dietType || null;
    user.allergies = allergies || [];
    user.hasCompletedOnboarding = true;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Onboarding completed successfully",
      user
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
