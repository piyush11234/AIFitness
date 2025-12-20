import { User } from "../models/userModel.js";
import { WorkoutPlan } from "../models/workoutPlanModel.js";
import { generateWorkoutPlan } from "../utils/workoutGenerator.js";



export const createAIPlan = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const plan = await generateWorkoutPlan(user);

    const workoutPlan = await WorkoutPlan.create({
      user: user._id,
      preferences: {
        goal: user.goal,
        activityLevel: user.activityLevel,
        bmiCategory: user.bmiCategory,
      },
      plan,
      source: "AI",
    });

    res.status(200).json({
      success: true,
      workoutPlan,
    });

  } catch (error) {
    console.error("❌ Workout AI Error:", error);
    res.status(500).json({
      success: false,
      error: "AI workout plan generation failed",
    });
  }
};

export const getUserWorkoutPlans = async (req, res) => {
  try {
    const { userId } = req.params;

    const plans = await WorkoutPlan.find({ user: userId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      plans, // ✅ THIS KEY NAME IS IMPORTANT
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch workout plans",
    });
  }
};




// export const createAIPlan = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.userId);

//     if (!user) return res.status(404).json({ message: "User not found" });

//     const plan = await generateWorkoutPlan(user);

//     user.aiRecommendations.push({ date: new Date(), plan });

//     await user.save();

//     res.status(200).json({ success: true, plan });

//   } catch (error) {
//     console.error("❌ AI Plan Error:", error.message);
//     res.status(500).json({ success: false, error: "AI plan generation failed" });
//   }
// };
