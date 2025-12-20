import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Dumbbell, Target, Calendar, Clock, Zap, Sparkles, Play, ChevronDown, ChevronUp, Loader2, Flame, Activity } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const AiWorkoutPlan = () => {
  const { user, accessToken } = useSelector((state) => state.auth);
  const userId = user?._id;

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [expandedDay, setExpandedDay] = useState({});
  const [expandedPlan, setExpandedPlan] = useState(null);

  const fetchWorkoutPlans = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/user/auth/workout/${userId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const fetchedPlans = Array.isArray(res.data?.plans)
        ? res.data.plans
        : [];

      setPlans(fetchedPlans);
      if (fetchedPlans.length > 0) {
        setExpandedPlan(0);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load workout plans.");
      toast.error("Failed to load workout plans");
    } finally {
      setLoading(false);
    }
  };

  const generateAiPlan = async () => {
    if (!userId) return;

    setGenerating(true);
    setError(null);

    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/user/auth/generate/${userId}`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (res.data?.plan) {
        setPlans((prev) => [res.data.plan, ...prev]);
        setExpandedPlan(0);
        toast.success("🎉 New workout plan generated successfully!");
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || "Failed to generate AI plan. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    fetchWorkoutPlans();
  }, [userId]);

  const toggleDay = (planIndex, dayIndex) => {
    const key = `${planIndex}-${dayIndex}`;
    setExpandedDay(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const togglePlan = (index) => {
    setExpandedPlan(expandedPlan === index ? null : index);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const LoadingSkeleton = () => (
    <div className="space-y-6 max-w-4xl mx-auto w-full">
      {[...Array(2)].map((_, i) => (
        <Card key={i} className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  if (loading && plans.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900 p-6">
      {/* Background Effects */}
      <div className="fixed top-1/4 left-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="fixed bottom-1/4 right-1/4 w-72 h-72 bg-green-500/20 rounded-full blur-3xl animate-pulse" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-linear-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
              <Dumbbell className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">AI Workout Plans</h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Smart workout plans personalized for{" "}
            <span className="font-semibold text-green-400">
              {user?.name || "Your"} fitness journey
            </span>
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row justify-center gap-4 mb-8"
        >
          <Button
            onClick={generateAiPlan}
            disabled={generating}
            className="bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-6 py-6 text-lg"
          >
            {generating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating AI Plan...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Generate New AI Plan
              </>
            )}
          </Button>
          
          <Button
            onClick={fetchWorkoutPlans}
            variant="outline"
            className="border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-white px-6 py-6 text-lg"
          >
            <Activity className="w-5 h-5 mr-2" />
            Refresh Plans
          </Button>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6"
          >
            <Card className="bg-red-500/10 border-red-500/50 max-w-2xl mx-auto">
              <CardContent className="p-4">
                <p className="text-red-400 text-center">{error}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* No Plans State */}
        {plans.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gray-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Dumbbell className="w-12 h-12 text-gray-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-400 mb-4">No Workout Plans Yet</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              Generate your first AI-powered workout plan tailored to your fitness goals
            </p>
            <Button
              onClick={generateAiPlan}
              disabled={generating}
              className="bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-8 py-6 text-lg"
            >
              {generating ? (
                <Loader2 className="w-6 h-6 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-6 h-6 mr-2" />
              )}
              {generating ? "Generating..." : "Generate First Plan"}
            </Button>
          </motion.div>
        )}

        {/* Workout Plans */}
        <div className="space-y-6 max-w-4xl mx-auto">
          <AnimatePresence>
            {plans
              .filter((planDoc) => planDoc?.plan)
              .map((planDoc, planIndex) => {
                const plan = planDoc.plan;
                const isExpanded = expandedPlan === planIndex;

                return (
                  <motion.div
                    key={planDoc._id || planIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: planIndex * 0.1 }}
                    layout
                  >
                    <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 shadow-2xl overflow-hidden">
                      {/* Plan Header */}
                      <CardHeader 
                        className="cursor-pointer hover:bg-gray-700/50 transition-colors"
                        onClick={() => togglePlan(planIndex)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-white text-xl flex items-center gap-2">
                              <Target className="w-5 h-5 text-blue-400" />
                              {plan.planName || "Workout Plan"}
                            </CardTitle>
                            <CardDescription className="text-gray-400 flex items-center gap-2 mt-1">
                              <Calendar className="w-4 h-4" />
                              Generated {formatDate(planDoc.createdAt)}
                            </CardDescription>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </div>

                        {/* Quick Stats */}
                        <div className="flex flex-wrap gap-3 mt-4">
                          <Badge className="bg-linear-to-r from-green-500/20 to-emerald-500/20 text-green-400 border-green-500/30">
                            <Target className="w-3 h-3 mr-1" />
                            {plan.goal || "Fitness"}
                          </Badge>
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                            <Zap className="w-3 h-3 mr-1" />
                            {plan.level || "Beginner"} Level
                          </Badge>
                          {plan.days?.length > 0 && (
                            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                              <Calendar className="w-3 h-3 mr-1" />
                              {plan.days.length} Days
                            </Badge>
                          )}
                        </div>
                      </CardHeader>

                      {/* Expandable Content */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <CardContent className="space-y-6 pt-0">
                              {/* Plan Days */}
                              {plan.days?.map((day, dayIndex) => {
                                const dayKey = `${planIndex}-${dayIndex}`;
                                const isDayExpanded = expandedDay[dayKey];

                                return (
                                  <Card key={dayIndex} className="bg-gray-900/50 border-gray-600">
                                    <CardHeader 
                                      className="cursor-pointer"
                                      onClick={() => toggleDay(planIndex, dayIndex)}
                                    >
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <CardTitle className="text-white flex items-center gap-2">
                                            <Calendar className="w-5 h-5 text-purple-400" />
                                            {day.day} • {day.focus}
                                          </CardTitle>
                                        </div>
                                        {isDayExpanded ? (
                                          <ChevronUp className="w-4 h-4 text-gray-400" />
                                        ) : (
                                          <ChevronDown className="w-4 h-4 text-gray-400" />
                                        )}
                                      </div>
                                    </CardHeader>

                                    <AnimatePresence>
                                      {isDayExpanded && (
                                        <motion.div
                                          initial={{ height: 0, opacity: 0 }}
                                          animate={{ height: "auto", opacity: 1 }}
                                          exit={{ height: 0, opacity: 0 }}
                                          transition={{ duration: 0.2 }}
                                        >
                                          <CardContent className="space-y-4">
                                            {/* Warm-up */}
                                            {day.warmup?.length > 0 && (
                                              <div>
                                                <h4 className="font-semibold text-orange-400 mb-2 flex items-center gap-2">
                                                  <Flame className="w-4 h-4" />
                                                  Warm-up
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                  {day.warmup.map((w, j) => (
                                                    <Badge key={j} variant="outline" className="bg-orange-500/10 text-orange-400 border-orange-500/30">
                                                      {w}
                                                    </Badge>
                                                  ))}
                                                </div>
                                              </div>
                                            )}

                                            {/* Exercises */}
                                            {day.exercises?.length > 0 && (
                                              <div>
                                                <h4 className="font-semibold text-blue-400 mb-3 flex items-center gap-2">
                                                  <Dumbbell className="w-4 h-4" />
                                                  Exercises
                                                </h4>
                                                <div className="space-y-4">
                                                  {day.exercises.map((ex, j) => (
                                                    <Card key={j} className="bg-gray-800/50 border-gray-700">
                                                      <CardContent className="p-4">
                                                        <div className="flex flex-col md:flex-row gap-4">
                                                          {ex.media && (
                                                            <div className="md:w-40 md:h-40 w-full h-48 overflow-hidden rounded-lg">
                                                              <img
                                                                src={ex.media}
                                                                alt={ex.name}
                                                                className="w-full h-full object-cover"
                                                              />
                                                            </div>
                                                          )}
                                                          
                                                          <div className="flex-1">
                                                            <div className="flex items-start justify-between mb-2">
                                                              <h5 className="text-lg font-semibold text-white">{ex.name}</h5>
                                                              <Badge className="bg-blue-500/20 text-blue-400">
                                                                {ex.sets} sets × {ex.reps}
                                                              </Badge>
                                                            </div>
                                                            
                                                            {ex.musclesWorked && (
                                                              <div className="mb-2">
                                                                <span className="text-sm text-gray-400">Muscles: </span>
                                                                <span className="text-white text-sm">{ex.musclesWorked}</span>
                                                              </div>
                                                            )}
                                                            
                                                            {ex.description && (
                                                              <p className="text-gray-300 text-sm mb-2">{ex.description}</p>
                                                            )}
                                                            
                                                            {ex.breathing && (
                                                              <div className="mb-2">
                                                                <span className="text-sm text-gray-400">Breathing: </span>
                                                                <span className="text-green-400 text-sm">{ex.breathing}</span>
                                                              </div>
                                                            )}
                                                            
                                                            {ex.commonMistakes && (
                                                              <div className="mb-2">
                                                                <span className="text-sm text-gray-400">Avoid: </span>
                                                                <span className="text-red-400 text-sm">{ex.commonMistakes}</span>
                                                              </div>
                                                            )}
                                                            
                                                            {/* <Button 
                                                              variant="outline" 
                                                              size="sm" 
                                                              className="mt-2 border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                                                            >
                                                              <Play className="w-4 h-4 mr-2" />
                                                              Start Exercise
                                                            </Button> */}
                                                          </div>
                                                        </div>
                                                      </CardContent>
                                                    </Card>
                                                  ))}
                                                </div>
                                              </div>
                                            )}

                                            {/* Cooldown */}
                                            {day.cooldown?.length > 0 && (
                                              <div>
                                                <h4 className="font-semibold text-green-400 mb-2 flex items-center gap-2">
                                                  <Clock className="w-4 h-4" />
                                                  Cooldown
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                  {day.cooldown.map((c, j) => (
                                                    <Badge key={j} variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">
                                                      {c}
                                                    </Badge>
                                                  ))}
                                                </div>
                                              </div>
                                            )}
                                          </CardContent>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </Card>
                                );
                              })}
                            </CardContent>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  </motion.div>
                );
              })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AiWorkoutPlan;