import { User } from "../models/userModel.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { verifyMail } from "../emailVerify/verifyMail.js";
import { Session } from "../models/sessionModel.js";
import { sendOtpMail } from "../emailVerify/sendOtpMail.js";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";


// export const registerUser = async (req, res) => {
//     try {
//         const { name, email, password } = req.body;
//         if (!name || !email || !password) {
//             return res.status(400).json({
//                 success: false,
//                 message: "All fields are required."
//             })
//         }

//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({
//                 success: false,
//                 message: "User already exist."
//             })
//         }
//         // hassed password
//         const hassedPassword = await bcrypt.hash(password, 10);


//         const newUser = await User.create({
//             name,
//             email,
//             password: hassedPassword
//         });

//         const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, { expiresIn: '10m' })
//         verifyMail(token, email);
//         newUser.token = token;
//         await newUser.save();



//         return res.status(201).json({
//             success: true,
//             message: "User registered successfully. Please verify your email to continue.",
//             data: newUser
//         })


//     } catch (err) {
//         return res.status(500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }




// export const verification = async (req, res) => {
//   try {
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith("Bearer")) {
//       return res.status(401).json({ success: false, message: "Authorization token is missing or invalid" });
//     }

//     const token = authHeader.split(" ")[1];
//     let decoded;

//     try {
//       decoded = jwt.verify(token, process.env.SECRET_KEY);
//     } catch (err) {
//       if (err.name === "TokenExpiredError") {
//         return res.status(400).json({ success: false, message: "The registration token has expired" });
//       }
//       return res.status(400).json({ success: false, message: "Token verification failed" });
//     }

//     const user = await User.findById(decoded.id);
//     if (!user) return res.status(404).json({ success: false, message: "User not found" });

//     user.token = null;
//     user.isVerified = true;
//     await user.save();

//     // ✅ Generate access & refresh tokens for auto-login
//     const accessToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "7d" });
//     const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_SECRET_KEY, { expiresIn: "30d" });

//     return res.status(200).json({
//       success: true,
//       message: "Email verified successfully",
//       user,
//       accessToken,
//       refreshToken
//     });

//   } catch (error) {
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };


export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exist."
            });
        }

        const hassedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hassedPassword
        });

        // Generate verification token
        const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, { expiresIn: '10m' });
        verifyMail(token, email);
        newUser.token = token;
        await newUser.save();

        // SANITIZE output
        const { password: p, otp, otpExpiry, token: t, __v, ...publicUser } = newUser.toObject();

        return res.status(201).json({
            success: true,
            message: "User registered successfully. Please verify your email to continue.",
            user: publicUser
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};




export const verification = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer")) {
            return res.status(401).json({
                success: false,
                message: "Authorization token is missing or invalid"
            })
        }
        const token = authHeader.split(" ")[1];

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(400).json({
                    success: false,
                    message: "The registration token has expired"
                })
            }
            return res.status(400).json({
                success: false,
                message: "Token verification failed"
            })
        }

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        user.token = null
        user.isVerified = true
        await user.save()

        return res.status(200).json({
            success: true,
            message: "Email verified successfully"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })

    }
}

export const loginUser = async (req, res) => {
    try {
        // to getting email and password for login
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        // check user exist or not
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access"
            })
        }

        // user present but  check correct password or not
        const passwordCheck = await bcrypt.compare(password, user.password);
        if (!passwordCheck) {
            return res.status(401).json({
                success: false,
                message: "Incorrect Password"
            })
        }

        // check user is verified or not 
        if (user.isVerified !== true) {
            return res.status(403).json({
                success: false,
                message: "Verify your account than login"
            })
        }

        //check for existing session and delete it

        const existingSession = await Session.findOne({ userId: user._id });
        if (existingSession) {
            await Session.deleteOne({ userId: user._id });
        }

        // create new session
        await Session.create({ userId: user._id });

        //generate token
        const accessToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '10d' });
        const refreshToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '30d' });

        user.isLoggedIn = true;
        await user.save();


        const { password:pass, otp, otpExpiry, token, __v, ...publicUser } = user.toObject();

        return res.status(200).json({
            success: true,
            message: `Welcome back ${user.name}`,
            accessToken,
            refreshToken,
            user: publicUser
        });


        // return res.status(200).json({
        //     success: true,
        //     message: `Welcome back ${user.name}`,
        //     accessToken,
        //     refreshToken,
        //     user
        // })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })

    }
}

export const logoutUser = async (req, res) => {
    try {
        const userId = req.userId;
        await Session.deleteMany({ userId });
        await User.findByIdAndUpdate(userId, { isLoggedIn: false });
        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}



export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        // generate 6 digit otp
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = new Date(Date.now() + 10 * 60 * 1000);
        user.otp = otp;
        user.otpExpiry = expiry;
        await user.save();

        await sendOtpMail(email, otp);
        return res.status(200).json({
            success: true,
            message: "Otp sent successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


export const verifyOTP = async (req, res) => {
    const { otp } = req.body;
    const email = req.params.email;
    if (!otp) {
        return res.status(400).json({
            success: false,
            message: "OTP is required"
        })
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        if (!user.otp || !user.otpExpiry) {
            return res.status(400).json({
                success: false,
                message: "OTP not generated or already verified"
            })
        }

        if (user.otpExpiry < new Date()) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired. Please request a new one"
            })
        }

        if (otp !== user.otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            })
        }

        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "OTP verified successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export const changePassword = async (req, res) => {
    const { newPassword, confirmPassword } = req.body;
    const email = req.params.email;

    if (!newPassword || !confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        })
    }

    if (newPassword !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "Password do not match"
        })
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        const hashedpassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedpassword;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password changed successsfully"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}



export const updateProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { name, age, gender, height, weight, goal, activityLevel, dietType, allergies, preferredWorkoutType } = req.body;
        const file = req.file;

        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Upload profile picture if file is provided
        if (file) {
            const fileUri = getDataUri(file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri);
            user.profilePic = cloudResponse.secure_url;
        }

        // Update other fields if provided
        if (name) user.name = name;
        if (age) user.age = age;
        if (gender) user.gender = gender;
        if (height) user.height = height;
        if (weight) user.weight = weight;
        if (goal) user.goal = goal;
        if (activityLevel) user.activityLevel = activityLevel;
        if (dietType) user.dietType = dietType;
        if (allergies) user.allergies = allergies;
        if (preferredWorkoutType) user.preferredWorkoutType = preferredWorkoutType;

        await user.save();

        return res.status(200).json({ 
            success: true, 
            message: "Profile updated successfully", 
            user 
        });

    } catch (error) {
        console.error("Update profile error:", error);
        return res.status(500).json({ 
            success: false, 
            message:  "Failed to update profile" 
        });
    }
};
