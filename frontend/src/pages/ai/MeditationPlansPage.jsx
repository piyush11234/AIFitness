import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Moon, Headphones, Sparkles, Clock, Calendar, Heart, Play, ChevronDown, ChevronUp, PlusCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const MeditationPlanPage = () => {
  const { user, accessToken } = useSelector((state) => state.auth);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedPlan, setExpandedPlan] = useState(null);
  const navigate = useNavigate();

  const fetchMeditationPlans = async () => {
    if (!user?._id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/user/auth/meditationPlan/${user._id}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setPlans(res.data.plans || []);
      if (res.data.plans?.length > 0) {
        setExpandedPlan(0);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch meditation plans.");
      toast.error("Failed to load meditation plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeditationPlans();
  }, [user?._id]);

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

  const getSessionIcon = (sessionName) => {
    const name = sessionName.toLowerCase();
    if (name.includes('sleep') || name.includes('bedtime')) return <Moon className="w-5 h-5 text-indigo-400" />;
    if (name.includes('focus') || name.includes('concentration')) return <Brain className="w-5 h-5 text-blue-400" />;
    if (name.includes('stress') || name.includes('anxiety')) return <Heart className="w-5 h-5 text-pink-400" />;
    if (name.includes('guided')) return <Headphones className="w-5 h-5 text-green-400" />;
    return <Brain className="w-5 h-5 text-purple-400" />;
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

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900 p-6 flex items-center justify-center">
        <Card className="bg-red-500/10 border-red-500/50 max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-red-400">{error}</p>
            <Button 
              onClick={fetchMeditationPlans}
              className="mt-4 bg-linear-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900 p-6 flex items-center justify-center">
        <Card className="bg-gray-800/50 border-gray-700 max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-linear-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Meditation Plans Yet</h3>
            <p className="text-gray-400 mb-6">Create your personalized meditation journey</p>
            <Button
              onClick={() => navigate("/plans/meditation-wizard")}
              className="bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Generate Meditation Plan
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900 p-6">
      {/* Background Effects */}
      <div className="fixed top-1/4 left-1/4 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="fixed bottom-1/4 right-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-linear-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">My Meditation Plans</h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Your personalized mindfulness and meditation sessions
          </p>
        </div>

        {/* Action Button */}
        <div className="flex justify-center mb-8">
          <Button
            onClick={() => navigate("/plans/meditation-wizard")}
            className="bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-6 py-6 text-lg"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Generate New Meditation Plan
          </Button>
        </div>

        {/* Meditation Plans */}
        <div className="space-y-6 max-w-4xl mx-auto">
          <AnimatePresence>
            {plans.map((item, idx) => {
              const plan = item.plan;
              const isExpanded = expandedPlan === idx;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 shadow-2xl overflow-hidden">
                    {/* Plan Header */}
                    <CardHeader 
                      className="cursor-pointer hover:bg-gray-700/50 transition-colors"
                      onClick={() => togglePlan(idx)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-white text-xl flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-indigo-400" />
                            Meditation Plan {idx + 1}
                          </CardTitle>
                          <CardDescription className="text-gray-400 flex items-center gap-2 mt-1">
                            <Calendar className="w-4 h-4" />
                            Created {formatDate(item.createdAt)}
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
                        {plan.totalDuration && (
                          <Badge className="bg-linear-to-r from-green-500/20 to-emerald-500/20 text-green-400 border-green-500/30">
                            <Clock className="w-3 h-3 mr-1" />
                            {plan.totalDuration} min Total
                          </Badge>
                        )}
                        {plan.sessions?.length > 0 && (
                          <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30">
                            <Brain className="w-3 h-3 mr-1" />
                            {plan.sessions.length} Sessions
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
                            {/* Sessions */}
                            {plan.sessions?.map((session, i) => (
                              <Card key={i} className="bg-gray-900/50 border-gray-600">
                                <CardHeader>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      {getSessionIcon(session.name)}
                                      <div>
                                        <CardTitle className="text-white">{session.name}</CardTitle>
                                        <CardDescription className="text-gray-400 flex items-center gap-1">
                                          <Clock className="w-4 h-4" />
                                          {session.duration} min
                                        </CardDescription>
                                      </div>
                                    </div>
                                  </div>
                                </CardHeader>
                                
                                <CardContent className="space-y-4">
                                  {session.media && (
                                    <div className="rounded-lg overflow-hidden">
                                      <img 
                                        src={session.media} 
                                        alt={session.name}
                                        className="w-full h-48 object-cover"
                                      />
                                    </div>
                                  )}

                                  <div className="space-y-3">
                                    {session.description && (
                                      <div>
                                        <div className="text-sm text-gray-400 mb-1">Description</div>
                                        <p className="text-gray-300 text-sm leading-relaxed">{session.description}</p>
                                      </div>
                                    )}

                                    {session.instructions && (
                                      <div>
                                        <div className="text-sm text-gray-400 mb-1">Instructions</div>
                                        <p className="text-gray-300 text-sm leading-relaxed">{session.instructions}</p>
                                      </div>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            ))}

                            {/* Notes */}
                            {plan.notes?.length > 0 && (
                              <Card className="bg-gray-900/50 border-gray-600">
                                <CardHeader>
                                  <CardTitle className="text-white flex items-center gap-2">
                                    <Heart className="w-5 h-5 text-pink-400" />
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

export default MeditationPlanPage;




// import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const MeditationPlanPage = () => {
//   const { user, accessToken } = useSelector((state) => state.auth);
//   const [plans, setPlans] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   const fetchMeditationPlans = async () => {
//     if (!user?._id) return;
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await axios.get(
//         `http://localhost:8000/api/v1/user/auth/meditationPlan/${user._id}`,
//         { headers: { Authorization: `Bearer ${accessToken}` } }
//       );
//       setPlans(res.data.plans);
//     } catch (err) {
//       console.error(err);
//       setError("Failed to fetch meditation plans.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMeditationPlans();
//   }, [user?._id]);

//   if (loading) return <p className="text-gray-400">Loading...</p>;
//   if (error) return <p className="text-red-500">{error}</p>;
//   if (plans.length === 0)
//     return <p className="text-gray-400">No meditation plan found. Generate one!</p>;

//   return (
//     <div className="min-h-screen bg-gray-900 text-gray-100 p-6 flex flex-col items-center space-y-6">
//       <h1 className="text-4xl font-bold text-center">My Meditation Plan</h1>
//       <button
//             onClick={() =>navigate("/plans/meditation-wizard")
                
//             }
            
//             className={`w-fit bg-blue-600 hover:bg-blue-500 px-5 py-3 border  rounded-lg font-medium transition-colors duration-200 `}
//           >
//             Generate New Meditation Plan
//           </button>

//       {plans.map((item, idx) => (
//         <div
//           key={idx}
//           className="w-full max-w-4xl border border-gray-700 rounded-xl p-6 bg-gray-800 shadow-lg space-y-4"
//         >
//           <p className="text-gray-400">Generated on: {new Date(item.createdAt).toLocaleString()}</p>
//           <p className="text-xl font-semibold text-green-400">Total Duration: {item.plan.totalDuration} min</p>

//           {item.plan.sessions.map((session, i) => (
//             <div key={i} className="border border-gray-700 p-4 rounded-lg bg-gray-900">
//               <h3 className="text-lg font-bold text-white">{session.name}</h3>
//               <p className="text-gray-300 mt-1"><strong>Duration:</strong> {session.duration} min</p>
//               {session.media && <img src={session.media} alt={session.name} className="mt-2 w-full max-w-xs rounded" />}
//               <p className="text-gray-300 mt-2"><strong>Description:</strong> {session.description}</p>
//               <p className="text-gray-300 mt-1"><strong>Instructions:</strong> {session.instructions}</p>
//             </div>
//           ))}

//           {item.plan.notes?.length > 0 && (
//             <div className="bg-gray-700 p-4 rounded-lg">
//               <h3 className="text-xl font-semibold text-pink-400">Notes</h3>
//               <ul className="list-disc ml-6 text-gray-300 mt-2">
//                 {item.plan.notes.map((n, i) => (
//                   <li key={i}>{n}</li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default MeditationPlanPage;
