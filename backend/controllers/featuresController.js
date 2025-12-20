import { User } from "../models/userModel.js";
import { exercisesLibrary } from "../utils/exerciseLibrary.js";



export const getRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Filter exercises based on user goal & activity level
    const recommendations = exercisesLibrary.filter(
      (ex) =>
        ex.goal === user.goal &&
        ex.activityLevel === user.activityLevel
    );

    return res.status(200).json({ success: true, recommendations });

    /*
    // Future AI-based recommendations (commented for now)
    import OpenAI from "openai";
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    */
    
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};



