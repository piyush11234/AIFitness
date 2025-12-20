import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Target, Clock, Activity, Zap, TrendingUp, Filter } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGoal, setSelectedGoal] = useState("All");

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const { data } = await axios.get(
          "http://localhost:8000/api/v1/features/recommendations",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRecommendations(data.recommendations || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  // Extract unique goals for filtering
  const goals = ["All", ...new Set(recommendations.map(rec => rec.goal).filter(Boolean))];

  // Filter recommendations based on selected goal
  const filteredRecommendations = selectedGoal === "All" 
    ? recommendations 
    : recommendations.filter(rec => rec.goal === selectedGoal);

  const RecommendationCard = ({ rec, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 shadow-2xl hover:shadow-purple-500/10 transition-all group cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start mb-2">
            <CardTitle className="text-white text-lg group-hover:text-purple-400 transition-colors line-clamp-2">
              {rec.name}
            </CardTitle>
            <Badge variant="outline" className="border-green-500/50 text-green-400">
              <TrendingUp className="w-3 h-3 mr-1" />
              AI Recommended
            </Badge>
          </div>
          <CardDescription className="text-gray-400 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {rec.duration}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pb-3">
          {/* Media Section */}
          <div className="relative w-full h-48 mb-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl overflow-hidden group-hover:from-purple-500/20 group-hover:to-pink-500/20 transition-all">
            {rec.media ? (
              <>
                {rec.media.match(/\.(gif|webp|png|jpg|jpeg)$/i) ? (
                  <img
                    src={rec.media}
                    alt={rec.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : rec.media.match(/\.(mp4|webm)$/i) ? (
                  <video 
                    src={rec.media} 
                    controls 
                    className="w-full h-full object-cover"
                    poster={rec.thumbnail}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Zap className="w-12 h-12 text-purple-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center">
                <Activity className="w-12 h-12 text-purple-400 mb-2" />
                <p className="text-gray-400 text-sm">No media available</p>
              </div>
            )}
          </div>

          {/* Description */}
          {rec.description && (
            <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
              {rec.description}
            </p>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <Target className="w-4 h-4 text-purple-400" />
              <div>
                <div className="text-gray-400 text-xs">Focus</div>
                <div className="text-white font-medium">{rec.focusArea}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Activity className="w-4 h-4 text-blue-400" />
              <div>
                <div className="text-gray-400 text-xs">Type</div>
                <div className="text-white font-medium">{rec.type}</div>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {rec.goal && (
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                {rec.goal}
              </Badge>
            )}
            {rec.difficulty && (
              <Badge className={
                rec.difficulty === "Beginner" ? "bg-green-500/20 text-green-400 border-green-500/30" :
                rec.difficulty === "Intermediate" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" :
                "bg-red-500/20 text-red-400 border-red-500/30"
              }>
                {rec.difficulty}
              </Badge>
            )}
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            variant="outline" 
            className="w-full border-purple-500/50 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300 group"
          >
            <Zap className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
            Start This Exercise
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, index) => (
        <Card key={index} className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-6">
            <Skeleton className="h-6 w-3/4 mb-4" />
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-48 w-full mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3 mb-4" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
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
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">AI Exercise Recommendations</h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Personalized workouts tailored to your fitness goals and preferences, powered by AI
          </p>
        </motion.div>

        {/* Filter Section */}
        {goals.length > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mb-8"
          >
            <div className="flex items-center gap-2 text-gray-400">
              <Filter className="w-4 h-4" />
              <span className="text-sm">Filter by goal:</span>
            </div>
            {goals.map(goal => (
              <Button
                key={goal}
                variant={selectedGoal === goal ? "default" : "outline"}
                onClick={() => setSelectedGoal(goal)}
                className={
                  selectedGoal === goal 
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 border-0" 
                    : "border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-white"
                }
                size="sm"
              >
                {goal}
              </Button>
            ))}
          </motion.div>
        )}

        {/* Recommendations Grid */}
        {filteredRecommendations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gray-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-12 h-12 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No Recommendations Found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {selectedGoal === "All" 
                ? "Complete your profile to get personalized exercise recommendations!"
                : `No recommendations found for "${selectedGoal}" goal. Try selecting a different filter.`
              }
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {filteredRecommendations.map((rec, index) => (
                <RecommendationCard key={index} rec={rec} index={index} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Stats Footer */}
        {filteredRecommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-white mb-2">
                🎯 Personalized Just For You
              </h3>
              <p className="text-gray-400 text-sm">
                These {filteredRecommendations.length} exercises are specifically recommended based on your fitness level, goals, and preferences.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Recommendations;









// import { useEffect, useState } from "react";
// import axios from "axios";

// const Recommendations = () => {
//   const [recommendations, setRecommendations] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchRecommendations = async () => {
//       try {
//         const token = localStorage.getItem("accessToken");
//         const { data } = await axios.get(
//           "http://localhost:8000/api/v1/features/recommendations",
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         setRecommendations(data.recommendations || []);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRecommendations();
//   }, []);

//   if (loading)
//     return (
//       <div className="flex justify-center items-center h-[60vh]">
//         <p className="text-lg font-semibold animate-pulse">Loading recommendations...</p>
//       </div>
//     );

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
//         Your Exercise Recommendations
//       </h1>

//       {recommendations.length === 0 ? (
//         <p className="text-center text-gray-500 text-lg">No recommendations yet.</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {recommendations.map((rec, index) => (
//             <div
//               key={index}
//               className="border rounded-2xl p-4 shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1 hover:scale-105 bg-white"
//             >
//               {/* Exercise Media */}
//               <div className="w-full h-48 mb-4 flex justify-center items-center bg-gray-100 rounded-xl overflow-hidden">
//                 {rec.media?.endsWith(".gif") ||  rec.media?.endsWith(".webp") || rec.media?.endsWith(".png") ? (
//                   <img
//                     src={rec.media}
//                     alt={rec.name}
//                     className="w-full h-full object-contain"
//                   />
//                 ) : rec.media?.endsWith(".mp4") ? (
//                   <video src={rec.media} controls className="w-full h-full object-contain" />
//                 ) : (
//                   <p className="text-gray-400 text-sm">Media unavailable</p>
//                 )}
//               </div>

//               {/* Exercise Info */}
//               <h2 className="font-semibold text-xl mb-1 text-gray-800">{rec.name}</h2>
//               <p className="text-sm text-gray-500 mb-2">{rec.duration}</p>
//               <p className="text-gray-600 text-sm mb-3">{rec.description}</p>

//               {/* Badges */}
//               <div className="flex flex-wrap gap-2">
//                 <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
//                   {rec.goal}
//                 </span>
//                 <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
//                   {rec.type}
//                 </span>
//                 <span className="px-2 py-1 text-xs font-semibold bg-purple-100 text-purple-800 rounded-full">
//                   {rec.focusArea}
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Recommendations;






