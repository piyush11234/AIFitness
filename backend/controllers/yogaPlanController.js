import { YogaPlan } from "../models/yogaPlanModel.js";
import { User } from "../models/userModel.js";
import { callDeepSeekAI } from "../utils/aiClient.js";
import { yogaLibrary } from "../utils/YogaLibrary.js";

// ----------------------------
// Fuzzy match helper to attach media
// ----------------------------
function findClosestYogaMedia(poseName) {
  const input = poseName.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();
  let bestMatch = null;
  let bestScore = 0;

  yogaLibrary.forEach((pose) => {
    const name = pose.name.toLowerCase().replace(/[^a-z0-9 ]/g, "");
    const score = similarity(name, input);

    if (score > bestScore) {
      bestScore = score;
      bestMatch = pose.media;
    }
  });

  // Only accept matches above 0.45 similarity
  return bestScore >= 0.45 ? bestMatch : null;
}

// Simple similarity based on word overlap
function similarity(a, b) {
  const aWords = a.split(" ");
  const bWords = b.split(" ");

  let matchCount = 0;
  aWords.forEach((aw) => {
    bWords.forEach((bw) => {
      if (aw.startsWith(bw) || bw.startsWith(aw)) matchCount++;
    });
  });

  return matchCount / Math.max(aWords.length, bWords.length);
}

// ----------------------------
// Save user preferences
// ----------------------------
export const saveYogaPreferences = async (req, res) => {
  try {
    const { userId } = req.params;
    const preferences = req.body;

    res.status(200).json({ success: true, preferences });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to save yoga preferences" });
  }
};

// ----------------------------
// Generate AI Yoga Plan
// ----------------------------
export const generateYogaPlan = async (req, res) => {
  try {
    const { userId } = req.params;
    const wizardPreferences = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const { name, age, gender, weight, height } = user;

    const prompt = `
You are a certified yoga instructor.  
Generate a personalized yoga session based on the user's profile and preferences.

### USER DETAILS:
- Name: ${name}
- Age: ${age}
- Gender: ${gender}
- Weight: ${weight} kg
- Height: ${height} cm

### PREFERENCES:
- Fitness Level: ${wizardPreferences.fitnessLevel}
- Goal: ${wizardPreferences.goal}
- Duration: ${wizardPreferences.duration}
- Focus Areas: ${wizardPreferences.focusAreas.join(", ")}
- Session Time: ${wizardPreferences.sessionTime}

### REQUIREMENTS:
Return a **full yoga session plan in JSON** including:
{
  "totalDuration": "minutes",
  "poses": [
    {
      "name": "",
      "category": "",
      "focusArea": "",
      "duration": "",
      "media": "",
      "description": "",
      "instructions": ""
    }
  ],
  "notes": []
}

For each pose:
- Provide a detailed **description** of the pose, its benefits, and which muscles it targets.
- Provide **step-by-step instructions** on how to perform the pose safely.
- Include **tips, common mistakes to avoid**, and modifications for beginners or advanced users.
- Include **duration** for how long to hold the pose.
- Suggest **variations or alternative poses** if relevant.

Include **notes** for the session like breathing tips, warm-up/cool-down suggestions, or safety precautions.

Return **only valid JSON**, and ensure every field is filled with detailed, meaningful information.
`;


    const aiResponse = await callDeepSeekAI(prompt);
    let yogaPlan;

    try {
      yogaPlan = JSON.parse(aiResponse);
    } catch (err) {
      console.log("AI returned invalid JSON. Attempting auto-fix...");
      const fixed = await callDeepSeekAI(`Fix JSON only:\n${aiResponse}`);
      yogaPlan = JSON.parse(fixed);
    }

    // ----------------------------
    // AUTO-ATTACH MEDIA FROM yogaLibrary
    // ----------------------------
    yogaPlan.poses = yogaPlan.poses.map((pose) => {
      const mediaUrl = findClosestYogaMedia(pose.name);
      return {
        ...pose,
        media: mediaUrl || null, // attach gif if found, otherwise null
      };
    });

    // Save plan
    const newPlan = await YogaPlan.create({
      user: userId,
      preferences: wizardPreferences,
      plan: yogaPlan,
    });

    res.status(200).json({ success: true, yogaPlan: newPlan });
  } catch (err) {
    console.error("Yoga Plan Generation Error:", err);
    res.status(500).json({ success: false, error: "Failed to generate yoga plan" });
  }
};

// ----------------------------
// Get all yoga plans for a user
// ----------------------------
export const getUserYogaPlans = async (req, res) => {
  try {
    const { userId } = req.params;
    const plans = await YogaPlan.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, plans });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to fetch yoga plans" });
  }
};
