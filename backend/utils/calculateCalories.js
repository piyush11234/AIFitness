

export const calculateCalories = (gender, weight, height, age, activityLevel, goal) => {

  // BMR using Mifflin-St Jeor Formula
  let bmr;
  
  if (gender === "Male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  // Activity factor
  const activityFactor = {
    Beginner: 1.2,
    Intermediate: 1.55,
    Advanced: 1.725,
  };

  let tdee = bmr * (activityFactor[activityLevel] || 1.2);

  // Adjust based on goal
  if (goal === "Lose Weight") tdee -= 300;
  else if (goal === "Gain Muscle") tdee += 300;

  return Math.round(tdee);
};
