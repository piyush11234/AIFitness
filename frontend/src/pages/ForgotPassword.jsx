import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axios from 'axios';
import { CheckCircle, Loader2, Mail, Shield, ArrowLeft } from 'lucide-react';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const navigate = useNavigate();

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            setError('');
            const res = await axios.post(`http://localhost:8000/api/v1/user/auth/forgot-password`, { email });
            if (res.data.success) {
                setIsSubmitted(true);
                navigate(`/verify-otp/${email}`);
                toast.success(res.data.message);
                setEmail('');
                
            }
        } catch (error) {
            console.log(error);
            setError(error.response?.data?.message || 'Failed to send reset link. Please try again.');
            toast.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-black to-gray-900 p-4">
            {/* Background Effects */}
            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl animate-pulse" />
            
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md"
            >
                {/* Back Button */}
                <Button
                    variant="ghost"
                    onClick={() => navigate('/login')}
                    className="mb-6 text-gray-400 hover:text-black transition-colors -ml-2"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Login
                </Button>

                <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800 shadow-2xl">
                    <CardHeader className="text-center space-y-4 pb-6">
                        {/* Logo Icon */}
                        <div className="flex justify-center">
                            <div className="w-16 h-16 bg-linear-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                                <Shield className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <CardTitle className="text-2xl font-bold text-white">
                                Reset Your Password
                            </CardTitle>
                            <CardDescription className="text-gray-400 text-base">
                                {isSubmitted 
                                    ? "Check your email for reset instructions" 
                                    : "Enter your email to receive a secure reset link"
                                }
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {error && (
                            <Alert variant="destructive" className="bg-red-500/10 border-red-500/50">
                                <AlertDescription className="text-red-400">{error}</AlertDescription>
                            </Alert>
                        )}

                        {isSubmitted ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="py-4 flex flex-col items-center justify-center text-center space-y-4"
                            >
                                <div className="relative">
                                    <CheckCircle className="h-14 w-14 text-green-500 animate-bounce" />
                                    <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
                                </div>
                                
                                <div className="space-y-3">
                                    <h3 className="font-bold text-white text-lg">Check Your Email</h3>
                                    <p className="text-gray-400">
                                        We've sent a password reset link to:
                                    </p>
                                    <p className="text-purple-400 font-semibold text-base">{email}</p>
                                    
                                    <div className="space-y-2 text-sm text-gray-500 pt-2">
                                        <p>• The link will expire in 1 hour</p>
                                        <p>• Check your spam folder if you don't see it</p>
                                        <p>• Contact support if you need help</p>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsSubmitted(false)}
                                        className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
                                    >
                                        <Mail className="w-4 h-4 mr-2" />
                                        Try Different Email
                                    </Button>
                                    <Button
                                        onClick={() => navigate('/login')}
                                        className="bg-gray-700 hover:bg-gray-600 text-white hover:text-gray-900"
                                    >
                                        Back to Login
                                    </Button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.form
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                onSubmit={handleForgotPassword}
                                className="space-y-5"
                            >
                                <div className="space-y-3">
                                    <Label htmlFor="email" className="text-gray-300 text-sm font-medium">
                                        Email Address
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="Enter your email address"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all h-12 pl-10"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        Enter the email address you used to create your FitAI account
                                    </p>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isLoading || !email}
                                    className="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Sending Reset Link...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center space-x-2">
                                            <Shield className="w-4 h-4" />
                                            <span>Send Secure Reset Link</span>
                                        </div>
                                    )}
                                </Button>
                            </motion.form>
                        )}
                    </CardContent>

                    <CardFooter className="flex justify-center border-t border-gray-800 pt-6">
                        <p className="text-gray-400 text-center text-sm">
                            Remember your password?{" "}
                            <Link
                                to="/login"
                                className="font-semibold text-purple-400 hover:text-purple-300 transition-colors"
                            >
                                Sign in here
                            </Link>
                        </p>
                    </CardFooter>
                </Card>

                {/* Security Note */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50 text-center"
                >
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                        <Shield className="w-4 h-4 text-purple-400" />
                        <span>Your security is our priority. All reset links are encrypted and expire after 1 hour.</span>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;