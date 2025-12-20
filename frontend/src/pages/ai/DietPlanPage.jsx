import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Utensils, Droplets, Flame, Apple, Coffee, Clock, ChevronRight, PlusCircle, RefreshCw, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const DietPlanPage = () => {
  const { user, accessToken } = useSelector((state) => state.auth);
  const [dietPlans, setDietPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedPlan, setExpandedPlan] = useState(null);
  const navigate = useNavigate();

  const userId = user?._id;

  const fetchDietPlans = async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);

    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/user/auth/dietPlan/${userId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setDietPlans(res.data.plans || []);
      if (res.data.plans?.length > 0) {
        setExpandedPlan(0); // Auto-expand first plan
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch diet plans.");
      toast.error("Failed to load diet plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDietPlans();
  }, [userId]);

  const hasPlan = dietPlans.length > 0;

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

  const getMealIcon = (mealName) => {
    if (mealName.toLowerCase().includes('breakfast')) return <Coffee className="w-5 h-5" />;
    if (mealName.toLowerCase().includes('lunch')) return <Utensils className="w-5 h-5" />;
    if (mealName.toLowerCase().includes('dinner')) return <Utensils className="w-5 h-5" />;
    if (mealName.toLowerCase().includes('snack')) return <Apple className="w-5 h-5" />;
    return <Utensils className="w-5 h-5" />;
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

  if (loading) {
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
      <div className="fixed top-1/4 left-1/4 w-72 h-72 bg-green-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="fixed bottom-1/4 right-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-linear-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
              <Utensils className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">My Nutrition Plans</h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Personalized diet plans for{" "}
            <span className="font-semibold text-green-400">{user?.name || "Your"}</span>'s fitness journey
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
            onClick={() => navigate("/plans/diet")}
            className="bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-6 py-6 text-lg"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Generate New Diet Plan
          </Button>
          
          <Button
            onClick={fetchDietPlans}
            variant="outline"
            className="border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-white px-6 py-6 text-lg"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
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
        {!hasPlan && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gray-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Utensils className="w-12 h-12 text-gray-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-400 mb-4">No Diet Plans Yet</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              Generate a personalized diet plan based on your fitness goals and preferences
            </p>
            <Button
              onClick={() => navigate("/plans/diet")}
              className="bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-8 py-6 text-lg"
            >
              <PlusCircle className="w-6 h-6 mr-2" />
              Create Your First Diet Plan
            </Button>
          </motion.div>
        )}

        {/* Diet Plans List */}
        <div className="space-y-6 max-w-4xl mx-auto">
          <AnimatePresence>
            {dietPlans.map((item, idx) => {
              const plan = item.plan;
              const isExpanded = expandedPlan === idx;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  layout
                >
                  <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 shadow-2xl overflow-hidden">
                    {/* Plan Header (Always Visible) */}
                    <CardHeader 
                      className="cursor-pointer hover:bg-gray-700/50 transition-colors"
                      onClick={() => togglePlan(idx)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-white text-xl flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-green-400" />
                            Diet Plan {idx + 1}
                          </CardTitle>
                          <CardDescription className="text-gray-400 flex items-center gap-2 mt-1">
                            <Clock className="w-4 h-4" />
                            Created {formatDate(item.createdAt)}
                          </CardDescription>
                        </div>
                        <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      </div>

                      {/* Quick Stats */}
                      <div className="flex flex-wrap gap-3 mt-4">
                        {plan.totalCalories && (
                          <Badge className="bg-linear-to-r from-orange-500/20 to-orange-600/20 text-orange-400 border-orange-500/30">
                            <Flame className="w-3 h-3 mr-1" />
                            {plan.totalCalories} Calories
                          </Badge>
                        )}
                        {plan.macros?.protein && (
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                            {plan.macros.protein} Protein
                          </Badge>
                        )}
                        {plan.meals?.length > 0 && (
                          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                            <Utensils className="w-3 h-3 mr-1" />
                            {plan.meals.length} Meals
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
                            {/* Daily Overview */}
                            {plan.totalCalories && (
                              <Card className="bg-gray-900/50 border-gray-600">
                                <CardHeader>
                                  <CardTitle className="text-white flex items-center gap-2">
                                    <Flame className="w-5 h-5 text-orange-400" />
                                    Daily Overview
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="text-sm text-gray-400 mb-2">Total Calories</h4>
                                      <div className="text-2xl font-bold text-orange-400">{plan.totalCalories}</div>
                                    </div>
                                    <div>
                                      <h4 className="text-sm text-gray-400 mb-2">Macronutrients</h4>
                                      <div className="space-y-1">
                                        <div className="flex justify-between">
                                          <span className="text-gray-300">Protein</span>
                                          <span className="text-blue-400 font-semibold">{plan.macros?.protein}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-300">Carbs</span>
                                          <span className="text-green-400 font-semibold">{plan.macros?.carbs}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-300">Fats</span>
                                          <span className="text-yellow-400 font-semibold">{plan.macros?.fats}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            )}

                            {/* Meals */}
                            {plan.meals?.length > 0 && (
                              <Card className="bg-gray-900/50 border-gray-600">
                                <CardHeader>
                                  <CardTitle className="text-white flex items-center gap-2">
                                    <Utensils className="w-5 h-5 text-green-400" />
                                    Daily Meals
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  {plan.meals.map((meal, i) => (
                                    <div key={i} className="border-l-4 border-green-500/50 pl-4 py-2">
                                      <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                          {getMealIcon(meal.name)}
                                          <h4 className="font-semibold text-white">{meal.name}</h4>
                                        </div>
                                        <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                                          {meal.calories} cal
                                        </Badge>
                                      </div>
                                      
                                      {meal.ingredients?.length > 0 && (
                                        <div className="mb-2">
                                          <p className="text-sm text-gray-400 mb-1">Ingredients:</p>
                                          <div className="flex flex-wrap gap-2">
                                            {meal.ingredients.map((ing, j) => (
                                              <Badge key={j} variant="outline" className="bg-gray-800/50 text-gray-300">
                                                {ing}
                                              </Badge>
                                            ))}
                                          </div>
                                        </div>
                                      )}

                                      {meal.instructions && (
                                        <div className="mb-2">
                                          <p className="text-sm text-gray-400 mb-1">Instructions:</p>
                                          <p className="text-gray-300 text-sm">{meal.instructions}</p>
                                        </div>
                                      )}

                                      {meal.alternatives?.length > 0 && (
                                        <div>
                                          <p className="text-sm text-gray-400 mb-1">Alternatives:</p>
                                          <div className="flex flex-wrap gap-2">
                                            {meal.alternatives.map((alt, j) => (
                                              <Badge key={j} variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/30">
                                                {alt}
                                              </Badge>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </CardContent>
                              </Card>
                            )}

                            {/* Hydration Plan */}
                            {plan.hydrationPlan && (
                              <Card className="bg-gray-900/50 border-gray-600">
                                <CardHeader>
                                  <CardTitle className="text-white flex items-center gap-2">
                                    <Droplets className="w-5 h-5 text-blue-400" />
                                    Hydration Plan
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-4">
                                    <div>
                                      <p className="text-sm text-gray-400">Daily Water Intake</p>
                                      <p className="text-2xl font-bold text-blue-400">
                                        {plan.hydrationPlan.waterIntakeLiters}L
                                      </p>
                                    </div>
                                    {plan.hydrationPlan.preferredBeverages?.length > 0 && (
                                      <div>
                                        <p className="text-sm text-gray-400 mb-2">Preferred Beverages</p>
                                        <div className="flex flex-wrap gap-2">
                                          {plan.hydrationPlan.preferredBeverages.map((beverage, i) => (
                                            <Badge key={i} variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                                              {beverage}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            )}

                            {/* Meal Timings */}
                            {plan.mealTimings && (
                              <Card className="bg-gray-900/50 border-gray-600">
                                <CardHeader>
                                  <CardTitle className="text-white flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-yellow-400" />
                                    Meal Schedule
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-3">
                                    {plan.mealTimings.breakfast && (
                                      <div className="flex justify-between items-center py-2 border-b border-gray-700">
                                        <span className="text-gray-300">Breakfast</span>
                                        <span className="text-white font-medium">{plan.mealTimings.breakfast}</span>
                                      </div>
                                    )}
                                    {plan.mealTimings.lunch && (
                                      <div className="flex justify-between items-center py-2 border-b border-gray-700">
                                        <span className="text-gray-300">Lunch</span>
                                        <span className="text-white font-medium">{plan.mealTimings.lunch}</span>
                                      </div>
                                    )}
                                    {plan.mealTimings.dinner && (
                                      <div className="flex justify-between items-center py-2">
                                        <span className="text-gray-300">Dinner</span>
                                        <span className="text-white font-medium">{plan.mealTimings.dinner}</span>
                                      </div>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            )}

                            {/* Notes */}
                            {plan.notes?.length > 0 && (
                              <Card className="bg-gray-900/50 border-gray-600">
                                <CardHeader>
                                  <CardTitle className="text-white flex items-center gap-2">
                                    <Apple className="w-5 h-5 text-pink-400" />
                                    Important Notes
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <ul className="space-y-2">
                                    {plan.notes.map((note, i) => (
                                      <li key={i} className="flex items-start gap-2 text-gray-300">
                                        <div className="w-2 h-2 bg-pink-400 rounded-full mt-2 shrink-0" />
                                        {note}
                                      </li>
                                    ))}
                                  </ul>
                                </CardContent>
                              </Card>
                            )}
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

export default DietPlanPage;