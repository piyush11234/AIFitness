import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Clock, Target, Heart, Sparkles, PlusCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const YogaPlanPage = () => {
  const { user, accessToken } = useSelector((state) => state.auth);
  const [yogaPlans, setYogaPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedPlan, setExpandedPlan] = useState(null);
  const navigate = useNavigate();

  const fetchYogaPlans = async () => {
    if (!user?._id) return;
    setLoading(true);
    setError(null);

    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/user/auth/yogaPlan/${user._id}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setYogaPlans(res.data.plans || []);
      if (res.data.plans?.length > 0) {
        setExpandedPlan(0);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch yoga plans.");
      toast.error("Failed to load yoga plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchYogaPlans();
  }, [user?._id]);

  const togglePlan = (index) => {
    setExpandedPlan(expandedPlan === index ? null : index);
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
              onClick={fetchYogaPlans}
              className="mt-4 bg-linear-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!yogaPlans.length) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900 p-6 flex items-center justify-center">
        <Card className="bg-gray-800/50 border-gray-700 max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-linear-to-r from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Yoga Plans Yet</h3>
            <p className="text-gray-400 mb-6">Generate your personalized yoga plan to start your journey</p>
            <Button
              onClick={() => navigate("/plans/yoga-wizard")}
              className="bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Generate Yoga Plan
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900 p-6">
      {/* Background Effects */}
      <div className="fixed top-1/4 left-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="fixed bottom-1/4 right-1/4 w-72 h-72 bg-green-500/20 rounded-full blur-3xl animate-pulse" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-linear-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">My Yoga Plans</h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Your personalized yoga sequences for mind-body wellness
          </p>
        </div>

        {/* Action Button */}
        <div className="flex justify-center mb-8">
          <Button
            onClick={() => navigate("/plans/yoga-wizard")}
            className="bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 py-6 text-lg"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Generate New Yoga Plan
          </Button>
        </div>

        {/* Yoga Plans */}
        <div className="space-y-6 max-w-4xl mx-auto">
          <AnimatePresence>
            {yogaPlans.map((item, idx) => {
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
                            <Sparkles className="w-5 h-5 text-purple-400" />
                            Yoga Plan {idx + 1}
                          </CardTitle>
                          <CardDescription className="text-gray-400 flex items-center gap-2 mt-1">
                            <Clock className="w-4 h-4" />
                            Created {new Date(item.createdAt).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>

                      {/* Quick Stats */}
                      <div className="flex wrap gap-3 mt-4">
                        {plan.totalDuration && (
                          <Badge className="bg-linear-to-r from-green-500/20 to-emerald-500/20 text-green-400 border-green-500/30">
                            <Clock className="w-3 h-3 mr-1" />
                            {plan.totalDuration}
                          </Badge>
                        )}
                        {plan.poses?.length > 0 && (
                          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                            <Leaf className="w-3 h-3 mr-1" />
                            {plan.poses.length} Poses
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
                            {/* Poses */}
                            {plan.poses?.map((pose, i) => (
                              <Card key={i} className="bg-gray-900/50 border-gray-600">
                                <CardHeader>
                                  <CardTitle className="text-white flex items-center gap-2">
                                    <Target className="w-5 h-5 text-purple-400" />
                                    {pose.name}
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="flex items-center gap-2">
                                      <Leaf className="w-4 h-4 text-green-400" />
                                      <div>
                                        <div className="text-xs text-gray-400">Category</div>
                                        <div className="text-white">{pose.category}</div>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Heart className="w-4 h-4 text-red-400" />
                                      <div>
                                        <div className="text-xs text-gray-400">Focus</div>
                                        <div className="text-white">{pose.focusArea}</div>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Clock className="w-4 h-4 text-blue-400" />
                                      <div>
                                        <div className="text-xs text-gray-400">Duration</div>
                                        <div className="text-white">{pose.duration}</div>
                                      </div>
                                    </div>
                                  </div>

                                  {pose.description && (
                                    <div>
                                      <div className="text-sm text-gray-400 mb-1">Description</div>
                                      <p className="text-gray-300 text-sm">{pose.description}</p>
                                    </div>
                                  )}

                                  {pose.instructions && (
                                    <div>
                                      <div className="text-sm text-gray-400 mb-1">Instructions</div>
                                      <p className="text-gray-300 text-sm">{pose.instructions}</p>
                                    </div>
                                  )}

                                  {pose.media && (
                                    <div className="mt-4">
                                      <img 
                                        src={pose.media} 
                                        alt={pose.name} 
                                        className="rounded-lg w-full max-w-sm"
                                      />
                                    </div>
                                  )}
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

export default YogaPlanPage;




// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";

// const YogaPlanPage = () => {
//   const { user, accessToken } = useSelector((state) => state.auth);
//   const [yogaPlans, setYogaPlans] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const navigate=useNavigate()

//   const fetchYogaPlans = async () => {
//     if (!user?._id) return;
//     setLoading(true);
//     setError(null);

//     try {
//       const res = await axios.get(
//         `http://localhost:8000/api/v1/user/auth/yogaPlan/${user._id}`,
//         { headers: { Authorization: `Bearer ${accessToken}` } }
//       );
//       setYogaPlans(res.data.plans);
//     } catch (err) {
//       console.error(err);
//       setError("⚠️ Failed to fetch yoga plans.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchYogaPlans();
//   }, [user?._id]);

//   if (loading) return <p className="text-gray-400 mt-4 text-center">Loading...</p>;
//   if (error) return <p className="text-red-500 mt-4 text-center">{error}</p>;
//   if (!yogaPlans.length) return <p className="text-gray-400 mt-4 text-center">No yoga plan yet. Generate one!</p>;

//   return (
//     <div className="min-h-screen bg-gray-900 text-gray-100 p-6 flex col items-center space-y-6">
//       <h1 className="text-4xl font-bold text-white text-center">My Yoga Plan</h1>
//       <button
//             onClick={() =>navigate("/plans/yoga-wizard")
                
//             }
            
//             className={`w-fit bg-blue-600 hover:bg-blue-500 px-5 py-3 border  rounded-lg font-medium transition-colors duration-200 `}
//           >
//             Generate New Yoga Plan
//           </button>

//       {yogaPlans.map((item, idx) => {
//         const plan = item.plan;
//         return (
//           <div key={idx} className="w-full max-w-4xl border border-gray-700 rounded-xl p-6 bg-gray-800 shadow-lg space-y-6">
//             <h2 className="text-2xl font-semibold text-purple-400">Yoga Plan</h2>
//             <p className="text-gray-400 text-sm">Generated on: {new Date(item.createdAt).toLocaleString()}</p>

//             {/* Total Duration */}
//             {plan.totalDuration && (
//               <p className="text-gray-300 mt-2 font-semibold">Total Duration: {plan.totalDuration}</p>
//             )}

//             {/* Poses */}
//             {plan.poses?.map((pose, i) => (
//               <div key={i} className="border border-gray-700 p-4 rounded-lg mt-4 bg-gray-900">
//                 <h4 className="text-lg font-bold text-white">{pose.name}</h4>
//                 <p className="text-gray-300 mt-1"><strong>Category:</strong> {pose.category}</p>
//                 <p className="text-gray-300 mt-1"><strong>Focus Area:</strong> {pose.focusArea}</p>
//                 <p className="text-gray-300 mt-1"><strong>Duration:</strong> {pose.duration}</p>
//                 <p className="text-gray-300 mt-2"><strong>Description:</strong> {pose.description}</p>
//                 <p className="text-gray-300 mt-2"><strong>Instructions:</strong> {pose.instructions}</p>
//                 {pose.media && (
//                   <img src={pose.media} alt={pose.name} className="mt-2 rounded-md w-full max-w-sm" />
//                 )}
//               </div>
//             ))}

//             {/* Notes */}
//             {plan.notes?.length > 0 && (
//               <div className="bg-gray-700 p-4 rounded-lg">
//                 <h3 className="text-xl font-semibold text-pink-400">Notes</h3>
//                 <ul className="list-disc ml-6 text-gray-300 mt-2">
//                   {plan.notes.map((n, i) => <li key={i}>{n}</li>)}
//                 </ul>
//               </div>
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default YogaPlanPage;
