export const calculateBMI = (weight, height) => {
  weight = Number(weight);
  height = Number(height);

  if (!weight || !height) {
    return { bmi: null, bmiCategory: "Unknown" };
  }

  const heightMeters = height / 100;
  const bmi = weight / (heightMeters * heightMeters);

  let category;
  if (bmi < 18.5) category = "Underweight";
  else if (bmi < 24.9) category = "Normal";
  else if (bmi < 29.9) category = "Overweight";
  else category = "Obese";

  return {
    bmi: parseFloat(bmi.toFixed(1)),
    bmiCategory: category
  };
};
