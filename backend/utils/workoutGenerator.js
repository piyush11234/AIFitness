import { callDeepSeekAI } from "./aiClient.js";
import { exercisesLibrary } from "./exerciseLibrary.js";
import { findClosestExercise } from "./workoutMediaMatcher.js";




export const generateWorkoutPlan = async (user) => {
  const exerciseNames = exercisesLibrary.map(e => e.name).join(", ");

  const prompt = `
You are a certified fitness coach and strength & conditioning expert.

Your task is to generate a **high-quality, safe, and effective 5-day workout plan**
based strictly on the user's profile and fitness science principles.

━━━━━━━━━━━━━━━━━━━━
🧠 USER PROFILE
━━━━━━━━━━━━━━━━━━━━
- Age: ${user.age}
- Gender: ${user.gender}
- Height: ${user.height} cm
- Weight: ${user.weight} kg
- Goal: ${user.goal}
- Activity Level: ${user.activityLevel}
- BMI Category: ${user.bmiCategory}

━━━━━━━━━━━━━━━━━━━━
🏋️ EXERCISE CONSTRAINTS
━━━━━━━━━━━━━━━━━━━━
⚠️ VERY IMPORTANT:
- Use **ONLY** exercises from this exact list
- Exercise names must match **word-for-word**
- DO NOT invent new exercises
- DO NOT rename exercises

ALLOWED EXERCISES:
${exerciseNames}

━━━━━━━━━━━━━━━━━━━━
📅 WORKOUT RULES
━━━━━━━━━━━━━━━━━━━━
1. Plan duration: **5 days**
2. Each day must include:
   - Warm-up (2–4 light exercises)
   - Main workout (4–6 exercises)
   - Cool-down (stretching / mobility)
3. Adjust sets & reps based on:
   - Beginner → lower volume
   - Intermediate → moderate volume
   - Advanced → higher intensity
4. Balance muscle groups across days:
   - Upper body
   - Lower body
   - Full body / cardio
   - Core & mobility
5. Keep workouts **safe, progressive, and goal-oriented**

━━━━━━━━━━━━━━━━━━━━
🧩 EXERCISE DETAILS REQUIRED
━━━━━━━━━━━━━━━━━━━━
For each exercise in the main workout:
- Provide **detailed description** of how to perform it safely
- Mention **muscle groups targeted**
- Include **breathing guidance**
- Suggest **common mistakes to avoid**
- Suggest **modifications for beginner/intermediate/advanced**

━━━━━━━━━━━━━━━━━━━━
📦 OUTPUT FORMAT (STRICT JSON ONLY)
━━━━━━━━━━━━━━━━━━━━
Return **VALID JSON ONLY**.
No markdown, no explanations, no comments.

{
  "planName": "Custom 5-Day Workout Plan",
  "goal": "${user.goal}",
  "level": "${user.activityLevel}",
  "days": [
    {
      "day": "Day 1",
      "focus": "Upper Body Strength",
      "warmup": ["Exercise Name"],
      "exercises": [
        {
          "name": "Exercise Name",
          "sets": 3,
          "reps": "10-12",
          "description": "Detailed instructions here...",
          "musclesWorked": "Chest, Shoulders, Triceps",
          "breathing": "Exhale on effort, inhale on return",
          "commonMistakes": "Don't flare elbows",
          "modification": "Easier: reduce weight; Harder: add resistance"
        }
      ],
      "cooldown": ["Exercise Name"]
    }
  ]
}
`;

  try {
    let response = await callDeepSeekAI(prompt);
    response = response.replace(/```json|```/g, "").trim();

    const plan = JSON.parse(response);

    // 🔥 Attach media safely
    plan.days = plan.days.map(day => ({
      ...day,
      exercises: day.exercises.map(ex => {
        const match = findClosestExercise(ex.name);
        return {
          ...ex,
          media: match?.media || null, // keep media from library
          description: ex.description || match?.description || "", // AI description preferred
        };
      }),
    }));

    return plan;

  } catch (error) {
    console.error("❌ Workout AI generation failed:", error.message);
    throw new Error("Workout AI generation failed");
  }
};




// export const generateWorkoutPlan = async (user) => {

//   const prompt = `
// Create a personalized **5-day workout plan** in JSON format.

// 👤 USER:
// - Age: ${user.age}
// - Goal: ${user.goal}
// - Activity Level: ${user.activityLevel}
// - BMI: ${user.bmiCategory}
// - Equipment: Bodyweight only

// 🎯 RULES:
// 1. Respond with VALID JSON ONLY (NO extra text)
// 2. Include: warmup, exercises with sets/reps, cooldown
// 3. Adjust difficulty based on experience level
// 4. Tailor program to user's goal: ${user.goal}

// 📌 JSON FORMAT EXAMPLE:
// {
//   "planName": "Custom 5-Day Workout",
//   "days": [
//     {
//       "day": "Day 1",
//       "focus": "Upper Body",
//       "warmup": ["2 min Jump rope"],
//       "exercises": [
//         {"name": "Push-up", "sets": 3, "reps": "10-15"}
//       ],
//       "cooldown": ["Stretch - 2 min"]
//     }
//   ]
// }`;

//   try {
//     const response = await callDeepSeekAI(prompt);

//     let jsonResponse = response.trim();

//     if (jsonResponse.startsWith("```")) {
//       jsonResponse = jsonResponse.replace(/```json|```/g, "").trim();
//     }

//     return JSON.parse(jsonResponse);

//   } catch (error) {
//     console.warn("⚠️ Failed to parse AI JSON. Using fallback.");
//     return createFallbackWorkout(user);
//   }
// };
