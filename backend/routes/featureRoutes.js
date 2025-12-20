import express from 'express'

import { isAuthenticated } from '../middleware/isAuthenticated.js';
import { getRecommendations } from '../controllers/featuresController.js';
import { getExercises, getMeditations, getYoga } from '../controllers/exercisesController.js';




const router=express.Router();

// router.post("/bmi", isAuthenticated, completeOnboarding);
router.get("/recommendations", isAuthenticated, getRecommendations);

router.get("/", getExercises);

// yoga route
router.get("/yoga", getYoga);

// meditation route
router.get("/meditations", getMeditations);

export default router;