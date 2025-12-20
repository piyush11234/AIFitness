import express from "express";
import { generateDietPlan, getUserDietPlans, saveDietPreferences } from "../controllers/dietPlanController.js";


const router = express.Router();

// Save wizard preferences temporarily
router.post("/preferences/:userId", saveDietPreferences);

// Generate AI diet plan
router.post("/generate/:userId", generateDietPlan);

// Get all diet plans for a user
router.get("/:userId", getUserDietPlans);

export default router;
