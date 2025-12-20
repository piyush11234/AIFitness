import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, Check, Sparkles, Users, Target, Zap } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Register = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);
        try {
            setIsLoading(true);
            const res = await axios.post(`http://localhost:8000/api/v1/user/auth/register`, formData, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (res.data.success) {
                navigate('/verify');
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Registration failed");
        } finally {
            setIsLoading(false);
        }
    };

    const features = [
        {
            icon: <Target className="w-5 h-5" />,
            text: "AI-Powered Workout Plans"
        },
        {
            icon: <Zap className="w-5 h-5" />,
            text: "Personalized Fitness Tracking"
        },
        {
            icon: <Users className="w-5 h-5" />,
            text: "Join 50K+ Fitness Enthusiasts"
        },
        {
            icon: <Sparkles className="w-5 h-5" />,
            text: "Smart Progress Analytics"
        }
    ];

    return (
        <div className="min-h-screen flex bg-linear-to-br from-gray-900 via-black to-gray-900">
            {/* Left Side - Brand & Features */}
            <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-linear-to-br from-cyan-500/10 to-green-500/10" />
                <div className="absolute top-1/4 -left-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 -right-10 w-72 h-72 bg-green-500/20 rounded-full blur-3xl animate-pulse" />
                
                <div className="relative z-10 flex flex-col justify-center px-16 xl:px-24 w-full">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-lg"
                    >
                        {/* Logo/Brand */}
                        <div className="mb-16">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-10 h-10 bg-linear-to-r from-cyan-500 to-green-500 rounded-xl flex items-center justify-center">
                                    <Sparkles className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-2xl font-bold bg-linear-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
                                    FitAI
                                </span>
                            </div>
                            <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
                                Transform Your{" "}
                                <span className="bg-linear-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
                                    Fitness Journey
                                </span>
                            </h1>
                            <p className="text-xl text-gray-300 leading-relaxed">
                                Join the future of fitness with AI-powered personal training, smart analytics, 
                                and a community that motivates you to achieve your goals.
                            </p>
                        </div>

                        {/* Features List */}
                        <div className="space-y-4 mb-65">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={feature.text}
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 + 0.5 }}
                                    className="flex items-center space-x-4"
                                >
                                    <div className="w-10 h-10 bg-linear-to-r from-cyan-500/20 to-green-500/20 rounded-lg flex items-center justify-center border border-cyan-500/30">
                                        {feature.icon}
                                    </div>
                                    <span className="text-gray-200 text-lg font-medium">{feature.text}</span>
                                </motion.div>
                            ))}
                        </div>

                        {/* Stats */}
                        {/* <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 }}
                            className="flex space-x-8 text-center"
                        >
                            <div>
                                <div className="text-2xl font-bold text-cyan-400">50K+</div>
                                <div className="text-gray-400 text-sm">Active Users</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-green-400">98%</div>
                                <div className="text-gray-400 text-sm">Success Rate</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-cyan-400">24/7</div>
                                <div className="text-gray-400 text-sm">AI Support</div>
                            </div>
                        </motion.div> */}

                    </motion.div>
                </div>
            </div>

            {/* Right Side - Registration Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-full max-w-md"
                >
                    <Card className="w-full shadow-2xl border-gray-800 bg-gray-900/50 backdrop-blur-sm">
                        <CardHeader className="space-y-3 text-center pb-8">
                            <div className="flex justify-center mb-4">
                                <div className="w-16 h-16 bg-linear-to-r from-cyan-500 to-green-500 rounded-2xl flex items-center justify-center">
                                    <Sparkles className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <CardTitle className="text-3xl font-bold text-white">
                                Join FitAI
                            </CardTitle>
                            <CardDescription className="text-gray-400 text-lg">
                                Start your personalized fitness journey today
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            {/* Full Name */}
                            <div className="space-y-3">
                                <Label htmlFor="fullname" className="text-gray-300 text-sm font-medium">
                                    Full Name
                                </Label>
                                <Input
                                    id="fullname"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    type="text"
                                    placeholder="Enter your full name"
                                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all h-12"
                                    required
                                />
                            </div>

                            {/* Email */}
                            <div className="space-y-3">
                                <Label htmlFor="email" className="text-gray-300 text-sm font-medium">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all h-12"
                                    required
                                />
                            </div>

                            {/* Password */}
                            <div className="space-y-3">
                                <Label htmlFor="password" className="text-gray-300 text-sm font-medium">
                                    Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all h-12 pr-12"
                                        required
                                    />
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-gray-700/50"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={isLoading}
                                        type="button"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5 text-gray-400" />
                                        ) : (
                                            <Eye className="w-5 h-5 text-gray-400" />
                                        )}
                                    </Button>
                                </div>
                            </div>

                            {/* Password Requirements */}
                            <div className="bg-gray-800/50 rounded-lg p-4 space-y-2">
                                <p className="text-sm text-gray-400 font-medium">Password must contain:</p>
                                <div className="flex items-center space-x-2 text-xs text-gray-500">
                                    <Check className="w-3 h-3 text-green-500" />
                                    <span>At least 8 characters</span>
                                </div>
                                <div className="flex items-center space-x-2 text-xs text-gray-500">
                                    <Check className="w-3 h-3 text-green-500" />
                                    <span>Uppercase & lowercase letters</span>
                                </div>
                                <div className="flex items-center space-x-2 text-xs text-gray-500">
                                    <Check className="w-3 h-3 text-green-500" />
                                    <span>Numbers or special characters</span>
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="flex flex-col gap-4 pt-6">
                            <Button
                                onClick={handleSubmit}
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-linear-to-r from-cyan-600 to-green-600 hover:from-cyan-700 hover:to-green-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating Your Account...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="mr-2 h-4 w-4" />
                                        Start Fitness Journey
                                    </>
                                )}
                            </Button>

                            <p className="text-sm text-gray-400 text-center">
                                Already have an account?{" "}
                                <a
                                    href="/login"
                                    className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                                >
                                    Sign in here
                                </a>
                            </p>

                            {/* Terms */}
                            <p className="text-xs text-gray-500 text-center px-4">
                                By signing up, you agree to our{" "}
                                <a href="#" className="text-cyan-400 hover:text-cyan-300">Terms</a> and{" "}
                                <a href="#" className="text-cyan-400 hover:text-cyan-300">Privacy Policy</a>
                            </p>
                        </CardFooter>
                    </Card>
                </motion.div>
            </div>

            {/* Mobile Background Effects */}
            <div className="lg:hidden absolute top-10 left-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="lg:hidden absolute bottom-10 right-10 w-72 h-72 bg-green-500/20 rounded-full blur-3xl animate-pulse" />
        </div>
    );
};

export default Register;