import { MeditationPlan } from "../models/meditationPlanModel.js";
import { User } from "../models/userModel.js";
import { callDeepSeekAI } from "../utils/aiClient.js";
import { meditationLibrary } from "../utils/MeditationLibrary.js";


// Helper to attach media
const findClosestMeditationMedia = (name) => {
  const match = meditationLibrary.find(
    (m) => m.name.toLowerCase() === name.toLowerCase()
  );
  return match ? match.media : null;
};

// Save meditation preferences
export const saveMeditationPreferences = async (req, res) => {
  try {
    const { userId } = req.params;
    const preferences = req.body;

    res.status(200).json({ success: true, preferences });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to save meditation preferences" });
  }
};

// Generate AI Meditation Plan
export const generateMeditationPlan = async (req, res) => {
  try {
    const { userId } = req.params;
    const wizardPreferences = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const { name, age, gender, stressLevel } = user;

    const prompt = `
You are a certified meditation instructor.
Generate a personalized meditation session based on the user's profile and preferences.

### USER DETAILS:
- Name: ${name}
- Age: ${age}
- Gender: ${gender}
- Stress Level: ${stressLevel || "Moderate"}

### PREFERENCES:
- Goal: ${wizardPreferences.goal}
- Duration: ${wizardPreferences.duration} minutes
- Focus Areas: ${wizardPreferences.focusAreas.join(", ")}

### REQUIREMENTS:
Return a **full meditation session plan in JSON** including:
{
  "totalDuration": "minutes",
  "sessions": [
    {
      "name": "",
      "duration": "",
      "media": "",
      "description": "",
      "instructions": ""
    }
  ],
  "notes": []
}

Include clear step-by-step instructions, tips, and variations for each session.
Return only valid JSON.
`;

    const aiResponse = await callDeepSeekAI(prompt);
    let meditationPlan;

    try {
      meditationPlan = JSON.parse(aiResponse);
    } catch (err) {
      console.log("AI returned invalid JSON. Attempting auto-fix...");
      const fixed = await callDeepSeekAI(`Fix JSON only:\n${aiResponse}`);
      meditationPlan = JSON.parse(fixed);
    }

    // Attach media if exists
    meditationPlan.sessions = meditationPlan.sessions.map((session) => ({
      ...session,
      media: findClosestMeditationMedia(session.name),
    }));

    const newPlan = await MeditationPlan.create({
      user: userId,
      preferences: wizardPreferences,
      plan: meditationPlan,
    });

    res.status(200).json({ success: true, meditationPlan: newPlan });
  } catch (err) {
    console.error("Meditation Plan Generation Error:", err);
    res.status(500).json({ success: false, error: "Failed to generate meditation plan" });
  }
};

// Get all meditation plans for a user
export const getUserMeditationPlans = async (req, res) => {
  try {
    const { userId } = req.params;
    const plans = await MeditationPlan.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, plans });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to fetch meditation plans" });
  }
};
