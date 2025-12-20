import express from "express";
import { generateMeditationPlan, getUserMeditationPlans, saveMeditationPreferences } from "../controllers/meditationController.js";


const router = express.Router();

// Save wizard preferences temporarily
router.post("/preferences/:userId", saveMeditationPreferences);

// Generate AI yoga plan
router.post("/generate/:userId", generateMeditationPlan);

// Get all yoga plans for a user
router.get("/:userId", getUserMeditationPlans);

export default router;
