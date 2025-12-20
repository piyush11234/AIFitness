import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, Moon, Sun, Clock, Target, Sparkles, Wind, Heart, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const MeditationWizard = () => {
  const { user, accessToken } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    meditationType: "",
    duration: 10,
    goal: "",
    sessionTime: "",
  });

  const [selectedFocusAreas, setSelectedFocusAreas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const meditationTypes = [
    { value: "mindfulness", label: "Mindfulness", icon: Brain, color: "text-indigo-400" },
    { value: "breathing", label: "Breathing", icon: Wind, color: "text-blue-400" },
    { value: "guided", label: "Guided", icon: Sparkles, color: "text-purple-400" },
    { value: "body_scan", label: "Body Scan", icon: Target, color: "text-green-400" },
    { value: "loving_kindness", label: "Loving Kindness", icon: Heart, color: "text-pink-400" }
  ];

  const goals = [
    { value: "stress_relief", label: "Stress Relief", emoji: "😌" },
    { value: "focus", label: "Improve Focus", emoji: "🎯" },
    { value: "sleep", label: "Better Sleep", emoji: "😴" },
    { value: "anxiety", label: "Reduce Anxiety", emoji: "🧘" },
    { value: "clarity", label: "Mental Clarity", emoji: "💡" }
  ];

  const sessionTimes = [
    { value: "morning", label: "Morning", icon: Sun, color: "text-yellow-400" },
    { value: "afternoon", label: "Afternoon", icon: Sun, color: "text-orange-400" },
    { value: "evening", label: "Evening", icon: Moon, color: "text-indigo-400" },
    { value: "bedtime", label: "Bedtime", icon: Moon, color: "text-purple-400" }
  ];

  const focusAreaOptions = [
    { value: "stress_relief", label: "Stress Relief", color: "bg-red-500/20 text-red-400" },
    { value: "focus", label: "Focus", color: "bg-blue-500/20 text-blue-400" },
    { value: "sleep", label: "Sleep", color: "bg-indigo-500/20 text-indigo-400" },
    { value: "mindfulness", label: "Mindfulness", color: "bg-green-500/20 text-green-400" },
    { value: "anxiety", label: "Anxiety", color: "bg-pink-500/20 text-pink-400" },
    { value: "relaxation", label: "Relaxation", color: "bg-purple-500/20 text-purple-400" }
  ];

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleFocusArea = (area) => {
    setSelectedFocusAreas(prev =>
      prev.includes(area)
        ? prev.filter(v => v !== area)
        : [...prev, area]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?._id) {
      toast.error("Please login to continue");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/user/auth/meditationPlan/generate/${user._id}`,
        { 
          ...formData, 
          focusAreas: selectedFocusAreas.map(area => 
            focusAreaOptions.find(f => f.value === area)?.label || area
          )
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (res.data.success) {
        toast.success("🧘 Meditation plan generated successfully!");
        setTimeout(() => {
          navigate("/plans/meditation-plan");
        }, 1500);
      }
    } catch (err) {
      console.error("Meditation Plan Generation Error:", err);
      const errorMessage = err.response?.data?.message || "Failed to generate meditation plan. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900 p-6">
      {/* Background Effects */}
      <div className="fixed top-1/4 left-1/4 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="fixed bottom-1/4 right-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      
      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-linear-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Meditation Planner</h1>
          </div>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Create your personalized meditation journey for mindfulness and peace
          </p>
        </motion.div>

        {/* Main Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                Customize Your Meditation Plan
              </CardTitle>
              <CardDescription className="text-gray-400">
                Answer a few questions to create your perfect meditation routine
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Meditation Type */}
                <div className="space-y-3">
                  <Label className="text-gray-300 text-sm font-medium">
                    Meditation Type
                  </Label>
                  <Select 
                    value={formData.meditationType} 
                    onValueChange={(value) => handleChange("meditationType", value)}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Select meditation type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      {meditationTypes.map(type => {
                        const Icon = type.icon;
                        return (
                          <SelectItem key={type.value} value={type.value} className="hover:bg-gray-700">
                            <div className="flex items-center gap-2">
                              <Icon className={`w-4 h-4 ${type.color}`} />
                              <span>{type.label}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* Duration */}
                <div className="space-y-4">
                  <Label className="text-gray-300 text-sm font-medium flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-400" />
                    Session Duration
                  </Label>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-400 mb-2">{formData.duration} minutes</div>
                      <p className="text-gray-400 text-sm">Select your preferred meditation duration</p>
                    </div>
                    <Slider
                      defaultValue={[10]}
                      min={5}
                      max={60}
                      step={5}
                      value={[formData.duration]}
                      onValueChange={([value]) => handleChange("duration", value)}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Short (5 min)</span>
                      <span>Medium (20 min)</span>
                      <span>Long (60 min)</span>
                    </div>
                  </div>
                </div>

                {/* Goal */}
                <div className="space-y-3">
                  <Label className="text-gray-300 text-sm font-medium flex items-center gap-2">
                    <Target className="w-4 h-4 text-green-400" />
                    Primary Goal
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {goals.map(goal => (
                      <Card 
                        key={goal.value}
                        className={`cursor-pointer transition-all border-2 hover:scale-105 ${
                          formData.goal === goal.value 
                            ? "border-green-500 bg-green-500/10" 
                            : "border-gray-700 bg-gray-800/50"
                        }`}
                        onClick={() => handleChange("goal", goal.value)}
                      >
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl mb-1">{goal.emoji}</div>
                          <div className={`font-semibold ${
                            formData.goal === goal.value ? "text-green-400" : "text-white"
                          }`}>
                            {goal.label}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Session Time */}
                <div className="space-y-3">
                  <Label className="text-gray-300 text-sm font-medium">
                    Preferred Time
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {sessionTimes.map(time => {
                      const Icon = time.icon;
                      return (
                        <Card 
                          key={time.value}
                          className={`cursor-pointer transition-all border-2 hover:scale-105 ${
                            formData.sessionTime === time.value 
                              ? "border-orange-500 bg-orange-500/10" 
                              : "border-gray-700 bg-gray-800/50"
                          }`}
                          onClick={() => handleChange("sessionTime", time.value)}
                        >
                          <CardContent className="p-3 text-center">
                            <Icon className={`w-5 h-5 mx-auto mb-2 ${time.color}`} />
                            <div className={`text-sm font-medium ${
                              formData.sessionTime === time.value ? "text-orange-400" : "text-white"
                            }`}>
                              {time.label}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                {/* Focus Areas */}
                <div className="space-y-3">
                  <Label className="text-gray-300 text-sm font-medium">
                    Focus Areas (Optional)
                  </Label>
                  <div className="text-sm text-gray-400 mb-2">Select areas you want to focus on:</div>
                  <div className="flex flex-wrap gap-2">
                    {focusAreaOptions.map(area => (
                      <Badge 
                        key={area.value}
                        variant="outline"
                        className={`cursor-pointer transition-all ${
                          selectedFocusAreas.includes(area.value)
                            ? `${area.color} border-transparent`
                            : "bg-gray-800/50 text-gray-400 border-gray-700 hover:bg-gray-700"
                        }`}
                        onClick={() => toggleFocusArea(area.value)}
                      >
                        {area.label}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
                    <p className="text-red-400 text-center">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading || !formData.meditationType || !formData.goal || !formData.sessionTime}
                  className="w-full bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 py-6 text-lg"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Creating Your Plan...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Brain className="w-5 h-5" />
                      <span>Generate Meditation Plan</span>
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>

            {/* Footer */}
            <CardFooter className="border-t border-gray-700 pt-6">
              <div className="text-center text-sm text-gray-500 w-full">
                <p>Your meditation plan will be tailored to your preferences for an optimal mindfulness experience</p>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default MeditationWizard;





// import React, { useState } from "react";
// import { useSelector } from "react-redux";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const MeditationWizard = () => {
//   const { user, accessToken } = useSelector((state) => state.auth);
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     meditationType: "",
//     duration: 10, // default 10 min
//     goal: "",
//     sessionTime: "",
//   });

//   const [selectedFocusAreas, setSelectedFocusAreas] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const focusAreaOptions = ["Stress Relief", "Focus", "Sleep", "Mindfulness"];

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFocusChange = (e) => {
//     const { value, checked } = e.target;
//     setSelectedFocusAreas((prev) =>
//       checked ? [...prev, value] : prev.filter((v) => v !== value)
//     );
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!user?._id) return;

//     setLoading(true);
//     setError(null);

//     try {
//       const res = await axios.post(
//         `http://localhost:8000/api/v1/user/auth/meditationPlan/generate/${user._id}`,
//         { ...formData, focusAreas: selectedFocusAreas },
//         {
//           headers: { Authorization: `Bearer ${accessToken}` },
//         }
//       );

//       if (res.data.success) {
//         navigate("/plans/meditation-plan");
//       }
//     } catch (err) {
//       console.error("Meditation Plan Generation Error:", err);
//       setError("Failed to generate meditation plan. Try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-gray-900 min-h-screen text-gray-100 flex justify-center items-center">
//       <div className="max-w-xl p-6 bg-gray-800 rounded-lg shadow-lg w-full">
//         <h1 className="text-2xl font-bold mb-4">Meditation Wizard</h1>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label>Meditation Type:</label>
//             <input
//               type="text"
//               name="meditationType"
//               value={formData.meditationType}
//               onChange={handleChange}
//               className="border p-2 rounded w-full"
//               placeholder="e.g., Mindfulness, Breathing"
//             />
//           </div>

//           <div>
//             <label>Duration (minutes):</label>
//             <input
//               type="number"
//               name="duration"
//               value={formData.duration}
//               onChange={handleChange}
//               className="border p-2 rounded w-full"
//               min={5}
//               max={60}
//             />
//           </div>

//           <div>
//             <label>Goal:</label>
//             <input
//               type="text"
//               name="goal"
//               value={formData.goal}
//               onChange={handleChange}
//               className="border p-2 rounded w-full"
//               placeholder="e.g., Stress Relief, Focus"
//             />
//           </div>

//           <div>
//             <label>Session Time:</label>
//             <input
//               type="text"
//               name="sessionTime"
//               value={formData.sessionTime}
//               onChange={handleChange}
//               className="border p-2 rounded w-full"
//               placeholder="Morning / Evening"
//             />
//           </div>

//           <div>
//             <label>Focus Areas:</label>
//             <div className="flex flex-col space-y-1 mt-1">
//               {focusAreaOptions.map((area) => (
//                 <label key={area} className="flex items-center space-x-2">
//                   <input
//                     type="checkbox"
//                     value={area}
//                     checked={selectedFocusAreas.includes(area)}
//                     onChange={handleFocusChange}
//                   />
//                   <span>{area}</span>
//                 </label>
//               ))}
//             </div>
//           </div>

//           {error && <p className="text-red-500">{error}</p>}

//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full py-2 px-4 text-white rounded ${
//               loading ? "bg-gray-400 cursor-not-allowed" : "bg-purple-500 hover:bg-purple-600"
//             }`}
//           >
//             {loading ? "Generating..." : "Generate Meditation Plan"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default MeditationWizard;

