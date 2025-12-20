import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";
import { Eye, EyeOff, Sparkles, Dumbbell, Target, Zap, Activity } from "lucide-react";
import { motion } from "framer-motion";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/auth/login",
        input,
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );

      if (res.data.success) {
        const user = res.data.user;

        // Update Redux state safely
        dispatch(setUser({
          user: user || null,
          accessToken: res.data.accessToken || null,
          refreshToken: res.data.refreshToken || null,
        }));

        // Optionally store accessToken in localStorage for API calls
        if (res.data.accessToken) {
          localStorage.setItem("accessToken", res.data.accessToken);
        }

        // Conditional redirect
        if (user.hasCompletedOnboarding) {
          navigate('/dashboard');
        } else {
          navigate('/onboarding');
        }

        toast.success(res.data.message);
      } else {
        toast.error(res.data.message || "Something went wrong");
      }

    } catch (error) {
      console.error("Login error:", error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: <Dumbbell className="w-6 h-6" />,
      text: "AI-Powered Workouts",
      desc: "Personalized training plans"
    },
    {
      icon: <Target className="w-6 h-6" />,
      text: "Smart Progress Tracking",
      desc: "Real-time analytics"
    },
    {
      icon: <Activity className="w-6 h-6" />,
      text: "Community Support",
      desc: "Join 50K+ fitness enthusiasts"
    }
  ];

  return (
    <div className="min-h-screen flex bg-linear-to-br from-gray-900 via-black to-gray-900">
      {/* Left Side - Brand & Features */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 to-cyan-500/10" />
        <div className="absolute top-1/4 -left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        
        <div className="relative z-10 flex flex-col justify-center px-16 xl:px-24 w-full">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-lg"
          >
            {/* Logo/Brand */}
            <div className="mb-12">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-linear-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-3xl font-bold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  FitAI
                </span>
              </div>
              <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
                Welcome Back to{" "}
                <span className="bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Your Fitness Journey
                </span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Continue your transformation with AI-powered workouts, personalized insights, 
                and the support of our fitness community.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-6 mb-12">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.text}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                  className="flex items-center space-x-4 p-4 rounded-xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/50"
                >
                  <div className="w-12 h-12 bg-linear-to-r from-blue-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center border border-blue-500/30">
                    {feature.icon}
                  </div>
                  <div>
                    <div className="text-white font-semibold text-lg">{feature.text}</div>
                    <div className="text-gray-400">{feature.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>

          
          </motion.div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4 lg:hidden">
                <div className="w-16 h-16 bg-linear-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-400 text-lg">
                Sign in to continue your fitness journey
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div className="space-y-3">
                <Label htmlFor="email" className="text-gray-300 text-sm font-medium">
                  Email Address
                </Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={input.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all h-12"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Password */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-gray-300 text-sm font-medium">
                    Password
                  </Label>
                  <Link
                    className="text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                    to="/forgot-password"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={input.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all h-12 pr-12"
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-gray-700/50"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-400" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing In...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Continue to FitAI</span>
                  </div>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-8">
              <hr className="flex-1 border-gray-700" />
              <span className="mx-4 text-gray-500 text-sm">OR</span>
              <hr className="flex-1 border-gray-700" />
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-gray-400">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Create account
                </Link>
              </p>
            </div>

            {/* Security Note */}
            <div className="mt-6 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Your data is securely encrypted and protected</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mobile Background Effects */}
      <div className="lg:hidden absolute top-10 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="lg:hidden absolute bottom-10 right-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
    </div>
  );
};

export default Login;