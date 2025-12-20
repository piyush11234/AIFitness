import mongoose from "mongoose";
import dotenv from "dotenv";
import { Exercise } from "../models/exerciseModel.js";


dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const exercises = [
  {
    name: "Jumping Jacks",
    goal: "Lose Weight",
    minBMI: 0,
    maxBMI: 100,
    activityLevel: "Beginner",
    category: "Cardio",
    mediaUrl: "https://example.com/jumping-jacks.gif",
    reps: "30 seconds"
  },
  {
    name: "Squats",
    goal: "Lose Weight",
    minBMI: 25,
    maxBMI: 40,
    activityLevel: "Beginner",
    category: "Strength",
    mediaUrl: "https://example.com/squats.gif",
    reps: "10-15 reps"
  }
  // add more exercises
];

const seedDB = async () => {
  await Exercise.deleteMany({});
  await Exercise.insertMany(exercises);
  console.log("Exercises seeded successfully!");
  mongoose.disconnect();
};

seedDB();
