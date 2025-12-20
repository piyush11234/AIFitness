import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Dumbbell, Utensils, Sparkles, Coffee, Brain, Target, Zap, CheckCircle, Loader2, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const PlansPage = () => {
  const navigate = useNavigate();
  const { user, accessToken } = useSelector((store) => store.auth);

  const [hasDietPlan, setHasDietPlan] = useState(false);
  const [loadingDiet, setLoadingDiet] = useState(true);

  const [hasYogaPlan, setHasYogaPlan] = useState(false);
  const [loadingYoga, setLoadingYoga] = useState(true);

  const [hasMeditationPlan, setHasMeditationPlan] = useState(false);
  const [loadingMeditation, setLoadingMeditation] = useState(true);

  const hasWorkoutPlan = user?.aiRecommendations?.length > 0;
  const [stats, setStats] = useState({
    activePlans: 0,
    totalGenerated: 0
  });

  const planTypes = [
    {
      id: "workout",
      title: "Workout Plan",
      description: "Personalized fitness routines and exercises",
      icon: Dumbbell,
      color: "from-blue-500 to-cyan-500",
      borderColor: "border-blue-500/30",
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-400",
      hasPlan: hasWorkoutPlan,
      loading: false,
      path: "/plans/workout",
      generatePath: "/plans/workout",
      statusText: "View AI Recommendations"
    },
    {
      id: "diet",
      title: "Nutrition Plan",
      description: "Custom meal plans based on your goals",
      icon: Utensils,
      color: "from-green-500 to-emerald-500",
      borderColor: "border-green-500/30",
      bgColor: "bg-green-500/10",
      textColor: "text-green-400",
      hasPlan: hasDietPlan,
      loading: loadingDiet,
      path: "/plans/diet-plan",
      generatePath: "/plans/diet",
      statusText: "View Diet Plan"
    },
    {
      id: "yoga",
      title: "Yoga & Flexibility",
      description: "Customized yoga sequences and routines",
      icon: Sparkles,
      color: "from-purple-500 to-pink-500",
      borderColor: "border-purple-500/30",
      bgColor: "bg-purple-500/10",
      textColor: "text-purple-400",
      hasPlan: hasYogaPlan,
      loading: loadingYoga,
      path: "/plans/yoga-plan",
      generatePath: "/plans/yoga-wizard",
      statusText: "View Yoga Plan"
    },
    {
      id: "meditation",
      title: "Mindfulness",
      description: "Personalized meditation sessions",
      icon: Brain,
      color: "from-indigo-500 to-violet-500",
      borderColor: "border-indigo-500/30",
      bgColor: "bg-indigo-500/10",
      textColor: "text-indigo-400",
      hasPlan: hasMeditationPlan,
      loading: loadingMeditation,
      path: "/plans/meditation-plan",
      generatePath: "/plans/meditation-wizard",
      statusText: "View Meditation Plan"
    }
  ];

  // Check Diet Plan
  const checkDietPlan = async () => {
    if (!user?._id) return;
    setLoadingDiet(true);
    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/user/auth/dietPlan/${user._id}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setHasDietPlan(res.data.plans?.length > 0);
    } catch (err) {
      console.error("Error fetching diet plans:", err);
      setHasDietPlan(false);
    } finally {
      setLoadingDiet(false);
    }
  };

  // Check Yoga Plan
  const checkYogaPlan = async () => {
    if (!user?._id) return;
    setLoadingYoga(true);
    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/user/auth/yogaPlan/${user._id}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setHasYogaPlan(res.data.plans?.length > 0);
    } catch (err) {
      console.error("Error fetching yoga plans:", err);
      setHasYogaPlan(false);
    } finally {
      setLoadingYoga(false);
    }
  };

  // Check Meditation Plan
  const checkMeditationPlan = async () => {
    if (!user?._id) return;
    setLoadingMeditation(true);
    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/user/auth/meditationPlan/${user._id}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setHasMeditationPlan(res.data.plans?.length > 0);
    } catch (err) {
      console.error("Error fetching meditation plans:", err);
      setHasMeditationPlan(false);
    } finally {
      setLoadingMeditation(false);
    }
  };

  useEffect(() => {
    checkDietPlan();
    checkYogaPlan();
    checkMeditationPlan();
  }, [user?._id]);

  // Calculate stats
  useEffect(() => {
    const activePlans = [hasDietPlan, hasYogaPlan, hasMeditationPlan, hasWorkoutPlan].filter(Boolean).length;
    setStats({
      activePlans,
      totalGenerated: activePlans  // Mock number for total generated
    });
  }, [hasDietPlan, hasYogaPlan, hasMeditationPlan, hasWorkoutPlan]);

  const handlePlanClick = (plan) => {
    if (plan.loading) {
      toast.info("Checking plan availability...");
      return;
    }
    
    if (plan.hasPlan) {
      navigate(plan.path);
    } else {
      navigate(plan.generatePath);
    }
  };

  const LoadingSkeleton = () => (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );

  const PlanCard = ({ plan, index }) => {
    const Icon = plan.icon;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <Card className={`bg-gray-800/50 backdrop-blur-sm border ${plan.borderColor} shadow-2xl hover:shadow-xl transition-all hover:scale-[1.02] group`}>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl bg-linear-to-r ${plan.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white text-xl">{plan.title}</CardTitle>
                  <CardDescription className="text-gray-400 text-sm">
                    {plan.description}
                  </CardDescription>
                </div>
              </div>
              
              {plan.hasPlan && !plan.loading && (
                <Badge className="bg-linear-to-r from-green-500/20 to-emerald-500/20 text-green-400 border-green-500/30">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Active
                </Badge>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="pb-4">
            <div className={`p-4 rounded-lg ${plan.bgColor} mb-4`}>
              <div className="text-sm text-gray-400 mb-1">Current Status</div>
              <div className="flex items-center gap-2">
                {plan.loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-gray-300">Checking availability...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {plan.hasPlan ? (
                      <>
                        <CheckCircle className={`w-4 h-4 ${plan.textColor}`} />
                        <span className={`font-medium ${plan.textColor}`}>Plan Available</span>
                      </>
                    ) : (
                      <>
                        <Target className={`w-4 h-4 ${plan.textColor}`} />
                        <span className={`font-medium ${plan.textColor}`}>Ready to Generate</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          
          <CardFooter>
            <Button
              onClick={() => handlePlanClick(plan)}
              disabled={plan.loading}
              className={`w-full bg-linear-to-r ${plan.color} hover:opacity-90 border-0 group/btn transition-all`}
            >
              {plan.loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Checking...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>{plan.hasPlan ? plan.statusText : "Generate Plan"}</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </div>
              )}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900 p-6">
      {/* Background Effects */}
      <div className="fixed top-1/4 left-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="fixed bottom-1/4 right-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-linear-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">AI-Powered Plans</h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Personalized fitness, nutrition, and wellness plans tailored to your goals
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-2xl mx-auto"
        >
          <Card className="bg-gray-800/50 backdrop-blur-sm border-blue-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Active Plans</div>
                  <div className="text-2xl font-bold text-white">{stats.activePlans}/4</div>
                </div>
                <div className="p-3 bg-blue-500/20 rounded-full">
                  <Target className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 backdrop-blur-sm border-green-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Plans Generated</div>
                  <div className="text-2xl font-bold text-white">{stats.totalGenerated}</div>
                </div>
                <div className="p-3 bg-green-500/20 rounded-full">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <Card className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-linear-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Welcome, {user?.name}!</h3>
                  <p className="text-gray-400 text-sm">
                    Your AI plans are personalized based on your profile and goals. 
                    {stats.activePlans === 0 && " Start by generating your first plan!"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Plan Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl  mx-auto">
          <AnimatePresence >
            {planTypes.map((plan, index) =>
              plan.loading && !plan.hasPlan ? (
                <LoadingSkeleton key={plan.id} />
              ) : (
                <PlanCard key={plan.id} plan={plan} index={index} />
              )
            )}
          </AnimatePresence>
        </div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 text-gray-400 text-sm bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-full">
            <Coffee className="w-4 h-4" />
            <span>💡 Tip: Complete all 4 plans for a comprehensive wellness journey</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PlansPage;