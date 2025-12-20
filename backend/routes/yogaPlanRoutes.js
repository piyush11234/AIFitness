import express from "express";
import { generateYogaPlan, getUserYogaPlans, saveYogaPreferences } from "../controllers/yogaPlanController.js";


const router = express.Router();

// Save wizard preferences temporarily
router.post("/preferences/:userId", saveYogaPreferences);

// Generate AI yoga plan
router.post("/generate/:userId", generateYogaPlan);

// Get all yoga plans for a user
router.get("/:userId", getUserYogaPlans);

export default router;
