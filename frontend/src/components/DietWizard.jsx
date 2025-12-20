import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChefHat, DollarSign, Utensils, Coffee, Target, Loader2, Sparkles, TrendingUp, Calendar, Heart } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const DietWizard = () => {
  const { user, accessToken } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    mealsPerDay: 3,
    cookingSkill: "",
    budget: "medium",
    favoriteFoods: [],
    beveragePreference: "",
    dietaryRestrictions: [],
    cuisinePreferences: []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState(1);
  const [favoriteFoodInput, setFavoriteFoodInput] = useState("");

  const cookingSkills = [
    { value: "Beginner", label: "Beginner", description: "Simple recipes, minimal prep" },
    { value: "Intermediate", label: "Intermediate", description: "Some cooking experience" },
    { value: "Advanced", label: "Advanced", description: "Comfortable with complex recipes" }
  ];

  const budgetOptions = [
    { value: "low", label: "Budget Friendly", emoji: "💰", description: "Affordable ingredients" },
    { value: "medium", label: "Moderate", emoji: "💵", description: "Balanced quality & cost" },
    { value: "high", label: "Premium", emoji: "💎", description: "Premium ingredients" }
  ];

  const beverageOptions = [
    { value: "water", label: "Water", emoji: "💧" },
    { value: "green_tea", label: "Green Tea", emoji: "🍵" },
    { value: "coffee", label: "Coffee", emoji: "☕" },
    { value: "smoothies", label: "Smoothies", emoji: "🥤" },
    { value: "juice", label: "Juice", emoji: "🧃" }
  ];

  const cuisineTypes = [
    "Mediterranean", "Asian", "Mexican", "Italian", "Indian", "American", "Vegetarian", "Keto", "Low-carb"
  ];

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addFavoriteFood = () => {
    if (favoriteFoodInput.trim() && !formData.favoriteFoods.includes(favoriteFoodInput.trim())) {
      setFormData(prev => ({
        ...prev,
        favoriteFoods: [...prev.favoriteFoods, favoriteFoodInput.trim()]
      }));
      setFavoriteFoodInput("");
    }
  };

  const removeFavoriteFood = (food) => {
    setFormData(prev => ({
      ...prev,
      favoriteFoods: prev.favoriteFoods.filter(f => f !== food)
    }));
  };

  const toggleCuisinePreference = (cuisine) => {
    setFormData(prev => ({
      ...prev,
      cuisinePreferences: prev.cuisinePreferences.includes(cuisine)
        ? prev.cuisinePreferences.filter(c => c !== cuisine)
        : [...prev.cuisinePreferences, cuisine]
    }));
  };

  const toggleDietaryRestriction = (restriction) => {
    setFormData(prev => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions.includes(restriction)
        ? prev.dietaryRestrictions.filter(r => r !== restriction)
        : [...prev.dietaryRestrictions, restriction]
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
        `http://localhost:8000/api/v1/user/auth/dietPlan/generate/${user._id}`,
        { 
          ...formData, 
          age: user.age, 
          gender: user.gender, 
          weight: user.weight, 
          height: user.height, 
          goal: user.goal, 
          activityLevel: user.activityLevel, 
          dietType: user.dietType, 
          allergies: user.allergies 
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (res.data.success) {
        toast.success("🎉 Diet plan generated successfully!");
        setTimeout(() => {
          navigate("/plans/diet-plan");
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || "Failed to generate diet plan. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setActiveStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setActiveStep(prev => Math.max(prev - 1, 1));

  const renderStep = () => {
    switch (activeStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-gray-300 text-sm font-medium flex items-center gap-2">
                <Target className="w-4 h-4 text-green-400" />
                Meals Per Day
              </Label>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">{formData.mealsPerDay}</div>
                  <p className="text-gray-400 text-sm">Select your preferred meal frequency</p>
                </div>
                <Slider
                  defaultValue={[3]}
                  min={1}
                  max={6}
                  step={1}
                  value={[formData.mealsPerDay]}
                  onValueChange={([value]) => handleChange("mealsPerDay", value)}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Light (1-2)</span>
                  <span>Moderate (3-4)</span>
                  <span>Frequent (5-6)</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-gray-300 text-sm font-medium flex items-center gap-2">
                <ChefHat className="w-4 h-4 text-orange-400" />
                Cooking Skill Level
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {cookingSkills.map(skill => (
                  <Card 
                    key={skill.value}
                    className={`cursor-pointer transition-all border-2 hover:scale-105 ${
                      formData.cookingSkill === skill.value 
                        ? "border-green-500 bg-green-500/10" 
                        : "border-gray-700 bg-gray-800/50"
                    }`}
                    onClick={() => handleChange("cookingSkill", skill.value)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className={`text-lg font-semibold mb-1 ${
                        formData.cookingSkill === skill.value ? "text-green-400" : "text-white"
                      }`}>
                        {skill.label}
                      </div>
                      <div className="text-xs text-gray-400">{skill.description}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-gray-300 text-sm font-medium flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-yellow-400" />
                Weekly Budget
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {budgetOptions.map(option => (
                  <Card 
                    key={option.value}
                    className={`cursor-pointer transition-all border-2 hover:scale-105 ${
                      formData.budget === option.value 
                        ? "border-yellow-500 bg-yellow-500/10" 
                        : "border-gray-700 bg-gray-800/50"
                    }`}
                    onClick={() => handleChange("budget", option.value)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl mb-2">{option.emoji}</div>
                      <div className={`font-semibold mb-1 ${
                        formData.budget === option.value ? "text-yellow-400" : "text-white"
                      }`}>
                        {option.label}
                      </div>
                      <div className="text-xs text-gray-400">{option.description}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-gray-300 text-sm font-medium flex items-center gap-2">
                <Coffee className="w-4 h-4 text-blue-400" />
                Beverage Preference
              </Label>
              <Select 
                value={formData.beveragePreference} 
                onValueChange={(value) => handleChange("beveragePreference", value)}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select preferred beverage" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  {beverageOptions.map(option => (
                    <SelectItem key={option.value} value={option.value} className="hover:bg-gray-700">
                      <div className="flex items-center gap-2">
                        <span>{option.emoji}</span>
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label className="text-gray-300 text-sm font-medium flex items-center gap-2">
                <Utensils className="w-4 h-4 text-purple-400" />
                Favorite Foods
              </Label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={favoriteFoodInput}
                  onChange={(e) => setFavoriteFoodInput(e.target.value)}
                  placeholder="Add your favorite foods"
                  className="bg-gray-800 border-gray-700 text-white"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFavoriteFood())}
                />
                <Button 
                  type="button" 
                  onClick={addFavoriteFood}
                  className="bg-linear-to-r from-purple-600 to-pink-600"
                  disabled={!favoriteFoodInput.trim()}
                >
                  Add
                </Button>
              </div>
              
              {formData.favoriteFoods.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.favoriteFoods.map(food => (
                    <Badge 
                      key={food} 
                      variant="outline"
                      className="bg-purple-500/20 text-purple-400 border-purple-500/30 flex items-center gap-1"
                    >
                      {food}
                      <button 
                        onClick={() => removeFavoriteFood(food)}
                        className="ml-1 text-xs hover:text-white"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-gray-300 text-sm font-medium flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-400" />
                Dietary Restrictions
              </Label>
              <div className="flex flex-wrap gap-2">
                {["Dairy-Free", "Gluten-Free", "Nut-Free", "Soy-Free", "Egg-Free", "Shellfish-Free"].map(restriction => (
                  <Badge 
                    key={restriction}
                    variant="outline"
                    className={`cursor-pointer transition-all ${
                      formData.dietaryRestrictions.includes(restriction)
                        ? "bg-pink-500/20 text-pink-400 border-pink-500/30"
                        : "bg-gray-800/50 text-gray-400 border-gray-700 hover:bg-gray-700"
                    }`}
                    onClick={() => toggleDietaryRestriction(restriction)}
                  >
                    {restriction}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-gray-300 text-sm font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-400" />
                Cuisine Preferences
              </Label>
              <div className="flex flex-wrap gap-2">
                {cuisineTypes.map(cuisine => (
                  <Badge 
                    key={cuisine}
                    variant="outline"
                    className={`cursor-pointer transition-all ${
                      formData.cuisinePreferences.includes(cuisine)
                        ? "bg-orange-500/20 text-orange-400 border-orange-500/30"
                        : "bg-gray-800/50 text-gray-400 border-gray-700 hover:bg-gray-700"
                    }`}
                    onClick={() => toggleCuisinePreference(cuisine)}
                  >
                    {cuisine}
                  </Badge>
                ))}
              </div>
            </div>

            {/* User Info Summary */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  Your Profile Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Goal:</span>
                  <span className="text-white">{user?.goal || "Not set"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Activity Level:</span>
                  <span className="text-white">{user?.activityLevel || "Not set"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Diet Type:</span>
                  <span className="text-white">{user?.dietType || "Not set"}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900 p-6">
      {/* Background Effects */}
      <div className="fixed top-1/4 left-1/4 w-72 h-72 bg-green-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="fixed bottom-1/4 right-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-linear-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Personalized Diet Plan</h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Answer a few questions to create your perfect meal plan
          </p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center mb-8"
        >
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map(step => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activeStep >= step 
                    ? "bg-linear-to-r from-green-500 to-emerald-500 text-white" 
                    : "bg-gray-800 text-gray-400"
                }`}>
                  {activeStep > step ? "✓" : step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 ${
                    activeStep > step ? "bg-linear-to-r from-green-500 to-emerald-500" : "bg-gray-800"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Step Labels */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-white mb-2">
            {activeStep === 1 && "Meal Preferences"}
            {activeStep === 2 && "Dietary Choices"}
            {activeStep === 3 && "Customization"}
          </h2>
          <p className="text-gray-400">
            Step {activeStep} of 3
          </p>
        </div>

        {/* Main Form Card */}
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 shadow-2xl">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit}>
                {renderStep()}
                
                {error && (
                  <div className="mt-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
                    <p className="text-red-400 text-center">{error}</p>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-6 border-t border-gray-700">
                  {activeStep > 1 ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-white"
                    >
                      Previous
                    </Button>
                  ) : (
                    <div></div> // Empty div for spacing
                  )}

                  {activeStep < 3 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                      Continue
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating Plan...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate Diet Plan
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* User Info Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-center text-sm text-gray-500"
        >
          <p>Your plan will be personalized using your profile information: <span className="text-green-400">{user?.name}</span></p>
        </motion.div>
      </div>
    </div>
  );
};

export default DietWizard;