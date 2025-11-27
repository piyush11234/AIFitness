import express from 'express'
import { changePassword, forgotPassword, loginUser, logoutUser, registerUser, updateProfile, verification, verifyOTP } from '../controllers/userController.js';
import { isAuthenticated } from '../middleware/isAuthenticated.js';
import { saveOnboardingData } from '../controllers/onboardingController.js';
import { User } from '../models/userModel.js';
import { singleUpload } from '../middleware/multer.js';

const router=express.Router();

router.post('/register', registerUser);
router.post('/verify',verification);
router.post('/login',loginUser);
router.post('/logout',isAuthenticated, logoutUser);
router.post('/forgot-password',forgotPassword);
router.post('/verify-otp/:email',verifyOTP);
router.post('/change-password/:email',changePassword);

router.post('/onboarding', isAuthenticated, saveOnboardingData);

router.put('/profile/update',isAuthenticated,singleUpload, updateProfile);

router.get('/profile', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if(!user) return res.status(404).json({success:false, message:"User not found"});
        res.status(200).json({success:true, user});
    } catch (error) {
        res.status(500).json({success:false, message:error.message});
    }
});

export default router;