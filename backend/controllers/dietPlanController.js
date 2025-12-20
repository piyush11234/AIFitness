import { DietPlan } from "../models/dietPlansModel.js";
import { User } from "../models/userModel.js";
import { callDeepSeekAI } from "../utils/aiClient.js";


// Save user preferences from wizard
export const saveDietPreferences = async (req, res) => {
  try {
    const { userId } = req.params;
    const preferences = req.body;

    // Optionally, validate preferences here

    res.status(200).json({ success: true, preferences });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to save diet preferences" });
  }
};


export const generateDietPlan = async (req, res) => {
  try {
    const { userId } = req.params;
    const wizardPreferences = req.body;

    // 1️⃣ Fetch User
    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    // Extract user details
    const {
      name,
      age,
      gender,
      weight,
      height,
      goal,
      activityLevel,
      dietType,
      allergies,
    } = user;

    // 2️⃣ Optimized Prompt (Very Important)
    const prompt = `
You are a certified nutritionist and fitness expert.  
Generate a **detailed, personalized diet plan** based on user profile and preferences.

### USER DETAILS:
- Name: ${name}
- Age: ${age}
- Gender: ${gender}
- Weight: ${weight} kg
- Height: ${height} cm
- Goal: ${goal} (e.g., Weight Loss, Muscle Gain, Maintenance)
- Activity Level: ${activityLevel}
- Diet Type: ${dietType} (e.g., Vegan, Keto, Vegetarian, High Protein, Balanced Diet)
- Allergies: ${allergies?.length ? allergies.join(", ") : "None"}

### USER PREFERENCES:
- Meals per day: ${wizardPreferences.mealsPerDay}
- Cooking Skill: ${wizardPreferences.cookingSkill}
- Budget: ${wizardPreferences.budget}
- Favorite Foods: ${wizardPreferences.favoriteFoods.join(", ")}
- Beverage Preference: ${wizardPreferences.beveragePreference}

### REQUIREMENTS:
Generate a **full-day diet plan** structured as JSON:
{
  "totalCalories": number,
  "macros": {
     "protein": "grams",
     "carbs": "grams",
     "fats": "grams"
  },
  "mealTimings": {
       "breakfast": "8:00 AM",
       "lunch": "1:00 PM",
       "dinner": "8:00 PM",
       "snacks": ["11:00 AM", "5:00 PM"]
  },
  "meals": [
      {
         "name": "",
         "calories": "",
         "ingredients": [],
         "instructions": "",
         "alternatives": []
      }
  ],
  "hydrationPlan": {
      "waterIntakeLiters": "",
      "preferredBeverages": []
  },
  "notes": []
}

### CONDITIONS:
- Follow the chosen **Diet Type strictly**.
- Avoid all allergens.
- Include foods the user likes.
- Adapt plan to cooking skill (simple meals for beginners).
- Stay inside user's budget.
- Include alternatives for each meal.
- Make JSON valid, strict, and without any extra text.

Return **only valid JSON**, no explanations.
`;

    // 3️⃣ AI Call
    const aiResponse = await callDeepSeekAI(prompt);

    // 4️⃣ JSON Validation + Auto Fix
    let dietPlan;

    try {
      dietPlan = JSON.parse(aiResponse);
    } catch (err) {
      console.log("Invalid JSON From AI, attempting auto-fix...");
      const fixPrompt = `
The following response is supposed to be JSON but contains errors.
Fix it and return VALID JSON ONLY:

${aiResponse}
`;
      const fixed = await callDeepSeekAI(fixPrompt);
      dietPlan = JSON.parse(fixed);
    }

    // 5️⃣ Save to DB
    const newPlan = await DietPlan.create({
      user: userId,
      preferences: wizardPreferences,
      plan: dietPlan,
    });

    res.status(200).json({
      success: true,
      dietPlan: newPlan,
    });
  } catch (err) {
    console.error("Diet Plan Generation Error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to generate diet plan",
    });
  }
};



// Generate AI diet plan
// export const generateDietPlan = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const wizardPreferences = req.body; // mealsPerDay, cookingSkill, budget, favoriteFoods, beveragePreference

//     // 1️⃣ Fetch user info
//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ success: false, message: "User not found" });

//     // 2️⃣ Build AI prompt using user info + wizard preferences
//     const prompt = `
//       Create a personalized diet plan in detailed in JSON for the following user:
//       Name: ${user.name}
//       Age: ${user.age}
//       Gender: ${user.gender}
//       Weight: ${user.weight}kg
//       Height: ${user.height}cm
//       Goal: ${user.goal}
//       Activity Level: ${user.activityLevel}
//       Diet Type: ${user.dietType}
//       Allergies: ${user.allergies.join(", ")}
//       Meals per day: ${wizardPreferences.mealsPerDay}
//       Cooking Skill: ${wizardPreferences.cookingSkill}
//       Budget: ${wizardPreferences.budget}
//       Favorite Foods: ${wizardPreferences.favoriteFoods.join(", ")}
//       Beverage Preference: ${wizardPreferences.beveragePreference}

//       Output a daily meal plan with calories, macros, and meal timings according to Diet Types in JSON format only.
//     `;

//     // 3️⃣ Call AI service
//     const aiResponse = await callDeepSeekAI(prompt); // returns JSON string
//     let dietPlan;
//     try {
//       dietPlan = JSON.parse(aiResponse);
//     } catch (err) {
//       return res.status(500).json({ message: "AI returned invalid JSON" });
//     }

//     // 4️⃣ Save diet plan in DB
//     const newPlan = await DietPlan.create({
//       user: userId,
//       preferences: wizardPreferences,
//       plan: dietPlan,
//     });

//     res.status(200).json({ success: true, dietPlan: newPlan });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, error: "Failed to generate diet plan" });
//   }
// };

// Fetch all diet plans for a user
export const getUserDietPlans = async (req, res) => {
  try {
    const { userId } = req.params;
    const plans = await DietPlan.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, plans });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to fetch diet plans" });
  }
};



