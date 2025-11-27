import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, Mail, ArrowRight, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const Verify = () => {
    const navigate = useNavigate();
    const { token } = useParams();
    const [status, setStatus] = useState("verifying");
    const [message, setMessage] = useState("Verifying your email...");

    useEffect(() => {
        const VerifyEmail = async () => {
            try {
                const res = await axios.post(`http://localhost:8000/api/v1/user/auth/verify`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                if (res.data.success) {
                    setStatus("success");
                    setMessage("Email verified successfully!");
                    toast.success("Welcome to FitAI! Your email has been verified.");
                    setTimeout(() => {
                        navigate('/login');
                    }, 3000);
                } else {
                    setStatus("error");
                    setMessage("Invalid or expired verification link");
                    toast.error("Verification failed. Please try again.");
                }

            } catch (error) {
                console.log(error);
                setStatus("error");
                setMessage("Verification failed. Please try again.");
                toast.error("Verification failed. Please try again.");
            }
        };
        VerifyEmail();
    }, [token, navigate]);

    const getStatusContent = () => {
        switch (status) {
            case "verifying":
                return {
                    icon: <Loader2 className="w-16 h-16 animate-spin" />,
                    title: "Verifying Your Email",
                    description: "Please wait while we confirm your email address",
                    color: "text-blue-400",
                    bglinear: "from-blue-500 to-cyan-500",
                    button: null
                };
            case "success":
                return {
                    icon: <CheckCircle className="w-16 h-16" />,
                    title: "Email Verified Successfully!",
                    description: "Your email has been verified and your account is now active",
                    color: "text-green-400",
                    bglinear: "from-green-500 to-emerald-500",
                    button: (
                        <Button
                            onClick={() => navigate('/login')}
                            className="bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-green-500/25 transform hover:scale-105"
                        >
                            <ArrowRight className="w-4 h-4 mr-2" />
                            Continue to Login
                        </Button>
                    )
                };
            case "error":
                return {
                    icon: <XCircle className="w-16 h-16" />,
                    title: "Verification Failed",
                    description: "The verification link is invalid or has expired",
                    color: "text-red-400",
                    bglinear: "from-red-500 to-pink-500",
                    button: (
                        <div className="flex gap-3">
                            <Button
                                onClick={() => navigate('/signup')}
                                variant="outline"
                                className="border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white"
                            >
                                Sign Up Again
                            </Button>
                            <Button
                                onClick={() => navigate('/login')}
                                className="bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold"
                            >
                                Go to Login
                            </Button>
                        </div>
                    )
                };
            default:
                return {
                    icon: <Loader2 className="w-16 h-16 animate-spin" />,
                    title: "Verifying...",
                    description: "Please wait",
                    color: "text-blue-400",
                    bglinear: "from-blue-500 to-cyan-500",
                    button: null
                };
        }
    };

    const content = getStatusContent();

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-black to-gray-900 p-4">
            {/* Background Effects */}
            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
            
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md"
            >
                <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800 shadow-2xl">
                    <CardHeader className="text-center space-y-4 pb-6">
                        {/* Status Icon */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ 
                                type: "spring",
                                stiffness: 200,
                                damping: 15,
                                delay: 0.2
                            }}
                            className={`flex justify-center`}
                        >
                            <div className={`w-24 h-24 bg-linear-to-r ${content.bglinear} rounded-2xl flex items-center justify-center ${status === "success" ? "animate-bounce" : ""}`}>
                                <div className={content.color}>
                                    {content.icon}
                                </div>
                            </div>
                        </motion.div>
                        
                        <div className="space-y-3">
                            <CardTitle className={`text-2xl font-bold ${content.color}`}>
                                {content.title}
                            </CardTitle>
                            <CardDescription className="text-gray-400 text-base leading-relaxed">
                                {content.description}
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Loading Bar for Verifying State */}
                        {status === "verifying" && (
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 2, ease: "easeInOut" }}
                                className="h-1 bg-linear-to-r from-blue-500 to-cyan-500 rounded-full"
                            />
                        )}

                        {/* Success Countdown */}
                        {status === "success" && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="flex items-center justify-center space-x-2 bg-gray-800/50 p-3 rounded-lg"
                            >
                                <Loader2 className="w-4 h-4 animate-spin text-green-400" />
                                <span className="text-sm text-gray-300">
                                    Redirecting to login in 3 seconds...
                                </span>
                            </motion.div>
                        )}

                        {/* Action Buttons */}
                        {content.button && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex justify-center"
                            >
                                {content.button}
                            </motion.div>
                        )}
                    </CardContent>

                    {/* Additional Information */}
                    <CardFooter className="flex justify-center border-t border-gray-800 pt-6">
                        <div className="text-center space-y-2">
                            <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                                <Shield className="w-4 h-4 text-blue-400" />
                                <span>Secure email verification</span>
                            </div>
                            <p className="text-xs text-gray-500">
                                {status === "error" 
                                    ? "Please ensure you're using the latest verification link from your email"
                                    : "Thank you for verifying your email address with FitAI"
                                }
                            </p>
                        </div>
                    </CardFooter>
                </Card>

                {/* Support Message */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-6 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50 text-center"
                >
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                        <Mail className="w-4 h-4 text-blue-400" />
                        <span>
                            Need help? Contact{' '}
                            <a 
                                href="mailto:support@fitai.com" 
                                className="text-blue-400 hover:text-blue-300 transition-colors"
                            >
                                support@fitai.com
                            </a>
                        </span>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Verify;