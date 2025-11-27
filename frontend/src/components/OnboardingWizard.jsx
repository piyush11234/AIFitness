import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const OnboardingWizard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const token = auth.accessToken || localStorage.getItem("accessToken");

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    height: "",
    weight: "",
    goal: "",
    activityLevel: "",
    preferredWorkoutType: [],
    dietType: "",
    allergies: [],
  });

  useEffect(() => {
    if (!token) {
      toast.error("Please login first");
      navigate("/login");
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleSelect = (field, value) => {
    setFormData(prev => {
      const arr = prev[field];
      if (arr.includes(value)) {
        return { ...prev, [field]: arr.filter(v => v !== value) };
      } else {
        return { ...prev, [field]: [...arr, value] };
      }
    });
  };

  const handleNext = () => setStep(prev => Math.min(prev + 1, 5));
  const handlePrev = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/auth/onboarding",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        dispatch(setUser({ ...auth, user: res.data.user }));
        toast.success("Onboarding completed successfully!");
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to save onboarding data");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: "Personal Info" },
    { number: 2, title: "Fitness Goal" },
    { number: 3, title: "Activity Level" },
    { number: 4, title: "Workout Preferences" },
    { number: 5, title: "Diet & Allergies" }
  ];

  const StepIcon = ({ active, completed, number }) => (
    <div className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 ${
      completed 
        ? "bg-linear-to-r from-green-500 to-emerald-500 border-green-500" 
        : active 
          ? "border-cyan-400 bg-cyan-400/10" 
          : "border-gray-600"
    }`}>
      {completed ? (
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <span className={`text-sm font-semibold ${
          active ? "text-cyan-400" : "text-gray-400"
        }`}>
          {number}
        </span>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 to-black text-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-linear-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent mb-4">
            Welcome to FitAI
          </h1>
          <p className="text-gray-400 text-lg">
            Let's personalize your fitness journey with AI
          </p>
        </div>

        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-4 left-0 right-0 h-1 bg-gray-800 -z-10">
              <div 
                className="h-1 bg-linear-to-r from-cyan-500 to-green-500 transition-all duration-500"
                style={{ width: `${((step - 1) / 4) * 100}%` }}
              />
            </div>
            {steps.map((stepItem, index) => (
              <div key={stepItem.number} className="flex flex-col items-center">
                <StepIcon 
                  active={step === stepItem.number} 
                  completed={step > stepItem.number}
                  number={stepItem.number}
                />
                <span className={`text-xs mt-2 ${
                  step === stepItem.number ? "text-cyan-400" : "text-gray-500"
                }`}>
                  {stepItem.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <div className="max-w-2xl mx-auto">
          <motion.div 
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-8 shadow-2xl"
          >
            {/* Step Content */}
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-white mb-6">Personal Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Age
                      </label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                        placeholder="Enter your age"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Gender
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      >
                        <option value="" className="bg-gray-900">Select Gender</option>
                        <option value="Male" className="bg-gray-900">Male</option>
                        <option value="Female" className="bg-gray-900">Female</option>
                        <option value="Other" className="bg-gray-900">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Height (cm)
                      </label>
                      <input
                        type="number"
                        name="height"
                        value={formData.height}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        placeholder="Enter height"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        placeholder="Enter weight"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-white mb-6">What's Your Primary Goal?</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { value: "Lose Weight", emoji: "🔥", desc: "Burn fat and get lean" },
                      { value: "Gain Muscle", emoji: "💪", desc: "Build strength and size" },
                      { value: "Stay Fit", emoji: "⚡", desc: "Maintain overall fitness" },
                      { value: "Build Endurance", emoji: "🏃", desc: "Improve stamina" }
                    ].map(goal => (
                      <button
                        key={goal.value}
                        onClick={() => handleChange({ target: { name: "goal", value: goal.value } })}
                        className={`p-6 rounded-xl border-2 text-left transition-all duration-300 hover:scale-105 ${
                          formData.goal === goal.value
                            ? "border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/20"
                            : "border-gray-700 bg-gray-900/50 hover:border-gray-600"
                        }`}
                      >
                        <div className="text-2xl mb-2">{goal.emoji}</div>
                        <div className="font-semibold text-white mb-1">{goal.value}</div>
                        <div className="text-sm text-gray-400">{goal.desc}</div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-white mb-6">Current Activity Level</h2>
                  <div className="space-y-4">
                    {[
                      { value: "Beginner", emoji: "🌱", desc: "New to regular exercise" },
                      { value: "Intermediate", emoji: "🚀", desc: "Work out occasionally" },
                      { value: "Advanced", emoji: "🏆", desc: "Consistent training experience" }
                    ].map(level => (
                      <button
                        key={level.value}
                        onClick={() => handleChange({ target: { name: "activityLevel", value: level.value } })}
                        className={`w-full p-6 rounded-xl border-2 text-left transition-all duration-300 hover:scale-[1.02] ${
                          formData.activityLevel === level.value
                            ? "border-green-500 bg-green-500/10 shadow-lg shadow-green-500/20"
                            : "border-gray-700 bg-gray-900/50 hover:border-gray-600"
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="text-2xl">{level.emoji}</div>
                          <div className="flex-1">
                            <div className="font-semibold text-white text-lg">{level.value}</div>
                            <div className="text-sm text-gray-400">{level.desc}</div>
                          </div>
                          {formData.activityLevel === level.value && (
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-white mb-6">Preferred Workout Types</h2>
                  <p className="text-gray-400 mb-6">Select all that interest you</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { value: "Strength", emoji: "🏋️", color: "from-orange-500 to-red-500" },
                      { value: "Cardio", emoji: "❤️", color: "from-pink-500 to-rose-500" },
                      { value: "Yoga", emoji: "🧘", color: "from-purple-500 to-indigo-500" },
                      { value: "HIIT", emoji: "⚡", color: "from-yellow-500 to-orange-500" }
                    ].map(workout => (
                      <button
                        key={workout.value}
                        onClick={() => toggleSelect("preferredWorkoutType", workout.value)}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                          formData.preferredWorkoutType.includes(workout.value)
                            ? `border-transparent bg-linear-to-r ${workout.color} shadow-lg`
                            : "border-gray-700 bg-gray-900/50 hover:border-gray-600"
                        }`}
                      >
                        <div className="text-2xl mb-2">{workout.emoji}</div>
                        <div className={`font-semibold ${
                          formData.preferredWorkoutType.includes(workout.value) 
                            ? "text-white" 
                            : "text-gray-300"
                        }`}>
                          {workout.value}
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 5 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-white mb-6">Diet & Allergies</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        Diet Type
                      </label>
                      <select
                        name="dietType"
                        value={formData.dietType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      >
                        <option value="" className="bg-gray-900">Select Diet Type</option>
                        <option value="Veg" className="bg-gray-900">Vegetarian</option>
                        <option value="Non-Veg" className="bg-gray-900">Non-Vegetarian</option>
                        <option value="Vegan" className="bg-gray-900">Vegan</option>
                        <option value="Keto" className="bg-gray-900">Keto</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        Allergies & Restrictions
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        {["Dairy", "Gluten", "Peanuts", "Soy"].map(allergy => (
                          <label
                            key={allergy}
                            className={`flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                              formData.allergies.includes(allergy)
                                ? "border-cyan-500 bg-cyan-500/10"
                                : "border-gray-700 bg-gray-900/50 hover:border-gray-600"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={formData.allergies.includes(allergy)}
                              onChange={() => toggleSelect("allergies", allergy)}
                              className="hidden"
                            />
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              formData.allergies.includes(allergy)
                                ? "bg-cyan-500 border-cyan-500"
                                : "border-gray-600"
                            }`}>
                              {formData.allergies.includes(allergy) && (
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <span className="text-white font-medium">{allergy}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-12 pt-6 border-t border-gray-700">
              <button
                onClick={handlePrev}
                disabled={step === 1}
                className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                  step === 1
                    ? "opacity-50 cursor-not-allowed bg-gray-800 text-gray-500"
                    : "bg-gray-700 text-white hover:bg-gray-600 transform hover:scale-105"
                }`}
              >
                Previous
              </button>

              <div className="text-sm text-gray-400">
                Step {step} of 5
              </div>

              {step < 5 ? (
                <button
                  onClick={handleNext}
                  className="px-8 py-3 bg-linear-to-r from-cyan-500 to-green-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transform hover:scale-105 transition-all"
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-8 py-3 bg-linear-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-green-500/25 transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Creating Your Plan...</span>
                    </div>
                  ) : (
                    "Complete Setup"
                  )}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;