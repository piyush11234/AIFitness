import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Sparkles, Target, Brain, Users, Shield, TrendingUp, Heart, Dumbbell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export default function About() {
    const navigate = useNavigate();

    const features = [
        {
            icon: <Brain className="w-8 h-8 text-purple-400" />,
            title: "AI-Powered Intelligence",
            description: "Advanced algorithms create personalized workout and nutrition plans",
            gradient: "from-purple-500/10 to-pink-500/10"
        },
        {
            icon: <Target className="w-8 h-8 text-blue-400" />,
            title: "Smart Goal Tracking",
            description: "Real-time progress tracking with adaptive recommendations",
            gradient: "from-blue-500/10 to-cyan-500/10"
        },
        {
            icon: <Sparkles className="w-8 h-8 text-yellow-400" />,
            title: "Personalized Experience",
            description: "Workouts and diet plans tailored to your unique profile",
            gradient: "from-yellow-500/10 to-orange-500/10"
        },
        {
            icon: <TrendingUp className="w-8 h-8 text-green-400" />,
            title: "Progress Analytics",
            description: "Detailed insights into your fitness journey and improvements",
            gradient: "from-green-500/10 to-emerald-500/10"
        },
        {
            icon: <Shield className="w-8 h-8 text-red-400" />,
            title: "Safe & Guided",
            description: "Exercise instructions with safety guidelines and modifications",
            gradient: "from-red-500/10 to-pink-500/10"
        },
        {
            icon: <Users className="w-8 h-8 text-indigo-400" />,
            title: "Community Support",
            description: "Connect with like-minded individuals on similar journeys",
            gradient: "from-indigo-500/10 to-purple-500/10"
        }
    ];

    const stats = [
        { value: "10K+", label: "Active Users", icon: <Users className="w-5 h-5" /> },
        { value: "98%", label: "Satisfaction Rate", icon: <Heart className="w-5 h-5" /> },
        { value: "50K+", label: "Workouts Generated", icon: <Dumbbell className="w-5 h-5" /> },
        { value: "24/7", label: "AI Support", icon: <Zap className="w-5 h-5" /> }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
            {/* Background Effects */}
            <div className="fixed top-1/4 left-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="fixed bottom-1/4 right-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
            
            <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-6 mb-16"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            FitFusion AI
                        </h1>
                    </div>
                    <p className="text-gray-400 text-xl max-w-3xl mx-auto leading-relaxed">
                        Your personal AI-powered fitness companion — intelligent workouts, personalized nutrition, 
                        and measurable results powered by cutting-edge artificial intelligence.
                    </p>
                </motion.div>

                {/* Stats Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-4xl mx-auto"
                >
                    {stats.map((stat, index) => (
                        <Card key={index} className="bg-gray-800/50 backdrop-blur-sm border-gray-700 shadow-lg">
                            <CardContent className="p-6 text-center">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <div className="text-blue-400">
                                        {stat.icon}
                                    </div>
                                    <div className="text-3xl font-bold text-white">{stat.value}</div>
                                </div>
                                <div className="text-gray-400 text-sm">{stat.label}</div>
                            </CardContent>
                        </Card>
                    ))}
                </motion.div>

                {/* Features Grid */}
                <div className="mb-20">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                            Why Choose FitFusion AI?
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            We combine artificial intelligence with exercise science for a revolutionary fitness experience
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className={`bg-gradient-to-br ${feature.gradient} backdrop-blur-sm border-gray-700/50 h-full hover:shadow-xl transition-all duration-300`}>
                                    <CardContent className="p-6">
                                        <div className="flex flex-col items-center text-center space-y-4">
                                            <div className="p-4 bg-gray-900/50 rounded-2xl">
                                                {feature.icon}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-semibold text-white mb-2">
                                                    {feature.title}
                                                </h3>
                                                <p className="text-gray-300">
                                                    {feature.description}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Mission Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="max-w-4xl mx-auto mb-20"
                >
                    <Card className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-700 shadow-2xl">
                        <CardHeader className="text-center">
                            <CardTitle className="text-3xl font-bold text-white mb-4">
                                Our Vision & Mission
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <p className="text-gray-300 text-lg leading-relaxed">
                                Fitness shouldn't be confusing, intimidating, or one-size-fits-all. At FitFusion AI, 
                                we're revolutionizing the way people approach health and wellness by combining 
                                cutting-edge artificial intelligence with proven exercise science.
                            </p>
                            <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-gray-700/50">
                                <div className="space-y-4">
                                    <h4 className="text-xl font-semibold text-blue-400 flex items-center gap-2">
                                        <Target className="w-5 h-5" />
                                        Our Vision
                                    </h4>
                                    <p className="text-gray-400">
                                        To create a world where everyone has access to personalized, effective, 
                                        and enjoyable fitness guidance powered by intelligent technology.
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-xl font-semibold text-purple-400 flex items-center gap-2">
                                        <Zap className="w-5 h-5" />
                                        Our Mission
                                    </h4>
                                    <p className="text-gray-400">
                                        To make premium fitness coaching accessible, affordable, and effective 
                                        through AI-driven personalization and continuous innovation.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Technology Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="mb-20"
                >
                    <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm border-purple-500/30">
                        <CardContent className="p-8">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                                <div className="md:w-1/2">
                                    <h3 className="text-2xl font-bold text-white mb-4">
                                        Powered by Advanced AI
                                    </h3>
                                    <p className="text-gray-300 mb-6">
                                        Our platform uses machine learning algorithms that adapt to your progress, 
                                        learn your preferences, and optimize your journey for maximum results.
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Machine Learning</Badge>
                                        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Personalization</Badge>
                                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Real-time Analytics</Badge>
                                        <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Smart Recommendations</Badge>
                                    </div>
                                </div>
                                <div className="md:w-1/2 text-center">
                                    <div className="inline-block p-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl">
                                        <Brain className="w-16 h-16 text-white opacity-80" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="text-center"
                >
                    <div className="space-y-6 max-w-2xl mx-auto">
                        <h3 className="text-3xl font-bold text-white">
                            Ready to Transform Your Fitness Journey?
                        </h3>
                        <p className="text-gray-400 text-lg">
                            Join thousands of users who have achieved their fitness goals with AI-powered guidance
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <Button
                                onClick={() => navigate('/signup')}
                                size="lg"
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg px-8 py-6 rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all"
                            >
                                Start Free Journey
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                            <Button
                                onClick={() => navigate('/login')}
                                variant="outline"
                                size="lg"
                                className="border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-white text-lg px-8 py-6 rounded-xl"
                            >
                                Already a Member? Sign In
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}