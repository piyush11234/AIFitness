import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Target, Clock, Sun, Moon, Wind, Brain, Heart, Activity, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const YogaWizard = () => {
  const { user, accessToken } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fitnessLevel: "",
    goal: "",
    duration: "20 min",
    focusAreas: [],
    sessionTime: "Morning",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [focusInput, setFocusInput] = useState("");

  const fitnessLevels = [
    { value: "Beginner", label: "Beginner", emoji: "🌱" },
    { value: "Intermediate", label: "Intermediate", emoji: "🌿" },
    { value: "Advanced", label: "Advanced", emoji: "🌳" }
  ];

  const goals = [
    { value: "Flexibility", label: "Flexibility", icon: Wind, color: "text-blue-400" },
    { value: "Strength", label: "Strength", icon: Activity, color: "text-red-400" },
    { value: "Balance", label: "Balance", icon: Target, color: "text-green-400" },
    { value: "Relaxation", label: "Relaxation", icon: Sparkles, color: "text-purple-400" },
    { value: "Stress Relief", label: "Stress Relief", icon: Brain, color: "text-pink-400" },
    { value: "Mindfulness", label: "Mindfulness", icon: Heart, color: "text-orange-400" }
  ];

  const durations = ["10 min", "20 min", "30 min", "45 min", "60 min"];
  const sessionTimes = [
    { value: "Morning", label: "Morning", icon: Sun },
    { value: "Evening", label: "Evening", icon: Moon },
    { value: "Anytime", label: "Anytime", icon: Clock }
  ];

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addFocusArea = () => {
    if (focusInput.trim() && !formData.focusAreas.includes(focusInput.trim())) {
      setFormData(prev => ({
        ...prev,
        focusAreas: [...prev.focusAreas, focusInput.trim()]
      }));
      setFocusInput("");
    }
  };

  const removeFocusArea = (area) => {
    setFormData(prev => ({
      ...prev,
      focusAreas: prev.focusAreas.filter(f => f !== area)
    }));
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
        `http://localhost:8000/api/v1/user/auth/yogaPlan/generate/${user._id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (res.data.success) {
        toast.success("🧘 Yoga plan generated successfully!");
        setTimeout(() => {
          navigate("/plans/yoga-plan");
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || "Failed to generate yoga plan. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900 p-6">
      {/* Background Effects */}
      <div className="fixed top-1/4 left-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="fixed bottom-1/4 right-1/4 w-72 h-72 bg-green-500/20 rounded-full blur-3xl animate-pulse" />
      
      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-linear-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Personalized Yoga Plan</h1>
          </div>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Create your custom yoga sequence tailored to your goals and preferences
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
                <Target className="w-5 h-5 text-purple-400" />
                Create Your Yoga Plan
              </CardTitle>
              <CardDescription className="text-gray-400">
                Fill in the details below to generate a personalized yoga sequence
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Fitness Level */}
                <div className="space-y-3">
                  <Label className="text-gray-300 text-sm font-medium">
                    Fitness Level
                  </Label>
                  <div className="grid grid-cols-3 gap-3">
                    {fitnessLevels.map(level => (
                      <Card 
                        key={level.value}
                        className={`cursor-pointer transition-all border-2 hover:scale-105 ${
                          formData.fitnessLevel === level.value 
                            ? "border-purple-500 bg-purple-500/10" 
                            : "border-gray-700 bg-gray-800/50"
                        }`}
                        onClick={() => handleChange("fitnessLevel", level.value)}
                      >
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl mb-1">{level.emoji}</div>
                          <div className={`font-semibold ${
                            formData.fitnessLevel === level.value ? "text-purple-400" : "text-white"
                          }`}>
                            {level.label}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Goals */}
                <div className="space-y-3">
                  <Label className="text-gray-300 text-sm font-medium">
                    Primary Goal
                  </Label>
                  <Select 
                    value={formData.goal} 
                    onValueChange={(value) => handleChange("goal", value)}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Select your primary goal" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      {goals.map(goal => {
                        const Icon = goal.icon;
                        return (
                          <SelectItem key={goal.value} value={goal.value} className="hover:bg-gray-700">
                            <div className="flex items-center gap-2">
                              <Icon className={`w-4 h-4 ${goal.color}`} />
                              <span>{goal.label}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* Duration & Session Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-gray-300 text-sm font-medium flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-400" />
                      Session Duration
                    </Label>
                    <Select 
                      value={formData.duration} 
                      onValueChange={(value) => handleChange("duration", value)}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        {durations.map(duration => (
                          <SelectItem key={duration} value={duration} className="hover:bg-gray-700">
                            {duration}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-gray-300 text-sm font-medium flex items-center gap-2">
                      <Clock className="w-4 h-4 text-orange-400" />
                      Preferred Time
                    </Label>
                    <div className="grid grid-cols-3 gap-2">
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
                              <Icon className={`w-4 h-4 mx-auto mb-1 ${
                                formData.sessionTime === time.value ? "text-orange-400" : "text-gray-400"
                              }`} />
                              <div className={`text-xs font-medium ${
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
                </div>

                {/* Focus Areas */}
                <div className="space-y-3">
                  <Label className="text-gray-300 text-sm font-medium">
                    Focus Areas (Optional)
                  </Label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={focusInput}
                      onChange={(e) => setFocusInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFocusArea())}
                      placeholder="e.g., Lower Back, Hips, Shoulders"
                      className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <Button 
                      type="button" 
                      onClick={addFocusArea}
                      className="bg-linear-to-r from-purple-600 to-pink-600"
                      disabled={!focusInput.trim()}
                    >
                      Add
                    </Button>
                  </div>
                  
                  {formData.focusAreas.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.focusAreas.map(area => (
                        <Badge 
                          key={area} 
                          variant="outline"
                          className="bg-purple-500/20 text-purple-400 border-purple-500/30 flex items-center gap-1"
                        >
                          {area}
                          <button 
                            onClick={() => removeFocusArea(area)}
                            className="ml-1 text-xs hover:text-white"
                            type="button"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
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
                  disabled={loading || !formData.fitnessLevel || !formData.goal}
                  className="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-6 text-lg"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Generating Your Plan...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      <span>Generate Yoga Plan</span>
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>

            {/* Footer */}
            <CardFooter className="border-t border-gray-700 pt-6">
              <div className="text-center text-sm text-gray-500 w-full">
                <p>Your yoga plan will be personalized based on your fitness level and goals</p>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default YogaWizard;




// import React, { useState } from "react";
// import { useSelector } from "react-redux";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const YogaWizard = () => {
//   const { user, accessToken } = useSelector((state) => state.auth);
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     fitnessLevel: "",
//     goal: "",
//     duration: "20 min",
//     focusAreas: [],
//     sessionTime: "Morning",
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFocusAreas = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       focusAreas: e.target.value.split(",").map((f) => f.trim()),
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!user?._id) return;

//     setLoading(true);
//     setError(null);

//     try {
//       const res = await axios.post(
//         `http://localhost:8000/api/v1/user/auth/yogaPlan/generate/${user._id}`,
//         formData,
//         {
//           headers: { Authorization: `Bearer ${accessToken}` },
//         }
//       );

//       if (res.data.success) {
//         navigate("/plans/yoga-plan");
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Failed to generate yoga plan. Try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-gray-900 min-h-screen text-gray-100">
//       <div className="max-w-xl mx-auto p-4 bg-gray-800 rounded-lg shadow-lg">
//         <h1 className="text-2xl font-bold mb-4">Yoga Plan Wizard</h1>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label>Fitness Level:</label>
//             <select
//               name="fitnessLevel"
//               value={formData.fitnessLevel}
//               onChange={handleChange}
//               className="border p-2 rounded w-full bg-gray-800"
//             >
//               <option value="">Select</option>
//               <option value="Beginner">Beginner</option>
//               <option value="Intermediate">Intermediate</option>
//               <option value="Advanced">Advanced</option>
//             </select>
//           </div>

//           <div>
//             <label>Goal:</label>
//             <select
//               name="goal"
//               value={formData.goal}
//               onChange={handleChange}
//               className="border p-2 rounded w-full bg-gray-800"
//             >
//               <option value="">Select</option>
//               <option value="Flexibility">Flexibility</option>
//               <option value="Strength">Strength</option>
//               <option value="Balance">Balance</option>
//               <option value="Relaxation">Relaxation</option>
//               <option value="Stress Relief">Stress Relief</option>
//               <option value="Mindfulness">Mindfulness</option>
//             </select>
//           </div>

//           <div>
//             <label>Duration:</label>
//             <input
//               type="text"
//               name="duration"
//               value={formData.duration}
//               onChange={handleChange}
//               className="border p-2 rounded w-full"
//             />
//           </div>

//           <div>
//             <label>Focus Areas (comma separated):</label>
//             <input
//               type="text"
//               value={formData.focusAreas.join(", ")}
//               onChange={handleFocusAreas}
//               className="border p-2 rounded w-full"
//             />
//           </div>

//           <div>
//             <label>Session Time:</label>
//             <select
//               name="sessionTime"
//               value={formData.sessionTime}
//               onChange={handleChange}
//               className="border p-2 rounded w-full bg-gray-800"
//             >
//               <option value="Morning">Morning</option>
//               <option value="Evening">Evening</option>
//               <option value="Anytime">Anytime</option>
//             </select>
//           </div>

//           {error && <p className="text-red-500">{error}</p>}

//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full py-2 px-4 text-white rounded ${
//               loading ? "bg-gray-400 cursor-not-allowed" : "bg-purple-500 hover:bg-purple-600"
//             }`}
//           >
//             {loading ? "Generating..." : "Generate Yoga Plan"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default YogaWizard;
