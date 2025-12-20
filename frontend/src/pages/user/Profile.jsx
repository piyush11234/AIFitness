import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  Camera, 
  Activity, 
  Target, 
  TrendingUp, 
  Dumbbell, 
  Heart, 
  Calendar,
  Edit3,
  Save,
  Loader2,
  Shield,
  Zap,
  Award
} from "lucide-react";
import { motion } from "framer-motion";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, accessToken } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    age: user?.age || "",
    gender: user?.gender || "",
    height: user?.height || "",
    weight: user?.weight || "",
    goal: user?.goal || "",
    activityLevel: user?.activityLevel || "",
    dietType: user?.dietType || "",
    allergies: user?.allergies?.join(", ") || "",
    preferredWorkoutType: user?.preferredWorkoutType?.join(", ") || "",
  });

  const [profilePic, setProfilePic] = useState(user?.profilePic || null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = e => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setProfilePic(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) {
          if (key === "allergies" || key === "preferredWorkoutType") {
            data.append(key, value.split(",").map(v => v.trim()));
          } else {
            data.append(key, value);
          }
        }
      });
      if (file) data.append("file", file);

      const res = await axios.put(
        "http://localhost:8000/api/v1/user/auth/profile/update",
        data,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      dispatch(setUser({ user: res.data.user }));
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

 

  const bmi = user?.bmi;;

  // Get BMI category
  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { category: "Underweight", color: "text-yellow-400" };
    if (bmi < 25) return { category: "Normal", color: "text-green-400" };
    if (bmi < 30) return { category: "Overweight", color: "text-orange-400" };
    return { category: "Obese", color: "text-red-400" };
  };

  const bmiCategory = bmi ? getBMICategory(bmi) : null;

  // Mock fitness data
  const fitnessStats = [
    { label: "Workouts This Week", value: "4", icon: <Dumbbell className="w-4 h-4" />, change: "+2", color: "from-purple-500 to-pink-500" },
    { label: "Active Minutes", value: "156", icon: <Activity className="w-4 h-4" />, change: "+45", color: "from-blue-500 to-cyan-500" },
    { label: "Calories Burned", value: "2,450", icon: <Heart className="w-4 h-4" />, change: "+320", color: "from-green-500 to-emerald-500" },
    { label: "Current Streak", value: "7 days", icon: <Calendar className="w-4 h-4" />, change: "+3", color: "from-orange-500 to-red-500" }
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900 p-6">
      {/* Background Effects */}
      <div className="fixed top-1/4 left-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="fixed bottom-1/4 right-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
      
      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-white">Welcome back, {user.name}!</h1>
            <p className="text-gray-400 mt-2"> Ready for your next workout?</p>
          </div>

          <Button
            onClick={()=>navigate('/recommendations')}
            variant={isEditing ? "outline" : "default"}
            className="bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0"
          >
            Recommendation
          </Button>

          <Button
            onClick={() => setIsEditing(!isEditing)}
            variant={isEditing ? "outline" : "default"}
            className="bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0"
          >
            {isEditing ? (
              <Edit3 className="w-4 h-4 mr-2" />
            ) : (
              <Edit3 className="w-4 h-4 mr-2" />
            )}
            {isEditing ? "Cancel Editing" : "Edit Profile"}
          </Button>
        </motion.div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-4 bg-gray-800/50 border border-gray-700">
            <TabsTrigger value="overview" className="text-gray-300 data-[state=active]:bg-linear-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600">
              Overview
            </TabsTrigger>
            <TabsTrigger value="profile" className="text-gray-300 data-[state=active]:bg-linear-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600">
              Profile
            </TabsTrigger>
            <TabsTrigger value="progress" className="text-gray-300 data-[state=active]:bg-linear-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600">
              Progress
            </TabsTrigger>
            <TabsTrigger value="workouts" className="text-gray-300 data-[state=active]:bg-linear-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600">
              Workouts
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Fitness Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {fitnessStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 shadow-2xl hover:shadow-purple-500/10 transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-400">{stat.label}</p>
                          <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                          <Badge variant="secondary" className="mt-2 bg-green-500/20 text-green-400 border-green-500/30">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            {stat.change}
                          </Badge>
                        </div>
                        <div className={`p-3 bg-linear-to-r ${stat.color} rounded-xl`}>
                          {stat.icon}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Summary */}
              <Card className="lg:col-span-1 bg-gray-800/50 backdrop-blur-sm border-gray-700 shadow-2xl">
                <CardHeader className="text-center pb-4">
                  <div className="relative inline-block">
                    <img
                      src={profilePic || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"}
                      alt="Profile"
                      className="h-24 w-24 rounded-full object-cover border-4 border-gray-700 shadow-lg mx-auto"
                    />
                    {isEditing && (
                      <label className="absolute bottom-0 right-0 bg-linear-to-r from-purple-600 to-pink-600 rounded-full p-2 cursor-pointer shadow-lg hover:scale-110 transition-transform">
                        <Camera className="w-4 h-4 text-white" />
                        <input
                          type="file"
                          className="hidden"
                          onChange={handleFileChange}
                          accept="image/*"
                        />
                      </label>
                    )}
                  </div>
                  <CardTitle className="text-xl mt-4 text-white">{user.name}</CardTitle>
                  <CardDescription className="text-gray-400">{user.goal || "Set your fitness goal"}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Activity Level</span>
                    <Badge variant="outline" className="border-purple-500/50 text-purple-400">
                      {user.activityLevel || "Not set"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Diet Type</span>
                    <Badge variant="outline" className="border-blue-500/50 text-blue-400">
                      {user.dietType || "Not set"}
                    </Badge>
                  </div>
                  {(
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">BMI</span>
                        <Badge variant="outline" className="border-green-500/50 text-green-400">
                          {user.bmi}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Category</span>
                        <span className={`text-sm ` + (bmiCategory ? bmiCategory.color : "text-gray-400")}>
                          {bmiCategory ? bmiCategory.category : "Unknown"}
                        </span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Goals & Progress */}
              <Card className="lg:col-span-2 bg-gray-800/50 backdrop-blur-sm border-gray-700 shadow-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Target className="w-5 h-5 text-purple-400" />
                    Your Fitness Goals
                  </CardTitle>
                  <CardDescription className="text-gray-400">Track your progress towards your fitness objectives</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-300">Weight Goal Progress</span>
                      <span className="text-purple-400">65%</span>
                    </div>
                    <Progress value={65} className="h-2 bg-gray-700" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-300">Workout Consistency</span>
                      <span className="text-blue-400">80%</span>
                    </div>
                    <Progress value={80} className="h-2 bg-gray-700" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-300">Nutrition Goals</span>
                      <span className="text-green-400">45%</span>
                    </div>
                    <Progress value={45} className="h-2 bg-gray-700" />
                  </div>
                  
                  {/* Achievement Badges */}
                  <div className="pt-4 border-t border-gray-700">
                    <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                      <Award className="w-4 h-4 text-yellow-400" />
                      Recent Achievements
                    </h4>
                    <div className="flex gap-2">
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                        🏃‍♂️ 5k Runner
                      </Badge>
                      <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                        💪 Strength Master
                      </Badge>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        🔥 7-Day Streak
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white">Profile Information</CardTitle>
                <CardDescription className="text-gray-400">
                  Update your personal information and fitness preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        disabled={!isEditing}
                        className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-500"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="age" className="text-gray-300">Age</Label>
                        <Input
                          id="age"
                          name="age"
                          type="number"
                          value={formData.age}
                          onChange={(e) => handleChange("age", e.target.value)}
                          disabled={!isEditing}
                          className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="gender" className="text-gray-300">Gender</Label>
                        <Select 
                          value={formData.gender} 
                          onValueChange={(value) => handleChange("gender", value)}
                          disabled={!isEditing}
                        >
                          <SelectTrigger className="mt-1 bg-gray-700 border-gray-600 text-white">
                            <SelectValue placeholder="Select Gender" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700 text-white">
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="height" className="text-gray-300">Height (cm)</Label>
                        <Input
                          id="height"
                          name="height"
                          type="number"
                          value={formData.height}
                          onChange={(e) => handleChange("height", e.target.value)}
                          disabled={!isEditing}
                          className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="weight" className="text-gray-300">Weight (kg)</Label>
                        <Input
                          id="weight"
                          name="weight"
                          type="number"
                          value={formData.weight}
                          onChange={(e) => handleChange("weight", e.target.value)}
                          disabled={!isEditing}
                          className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="goal" className="text-gray-300">Fitness Goal</Label>
                      <Select 
                        value={formData.goal} 
                        onValueChange={(value) => handleChange("goal", value)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger className="mt-1 bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select Goal" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                          <SelectItem value="Lose Weight">Lose Weight</SelectItem>
                          <SelectItem value="Gain Muscle">Gain Muscle</SelectItem>
                          <SelectItem value="Stay Fit">Stay Fit</SelectItem>
                          <SelectItem value="Build Endurance">Build Endurance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="activityLevel" className="text-gray-300">Activity Level</Label>
                      <Select 
                        value={formData.activityLevel} 
                        onValueChange={(value) => handleChange("activityLevel", value)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger className="mt-1 bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select Activity Level" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                          <SelectItem value="Beginner">Beginner</SelectItem>
                          <SelectItem value="Intermediate">Intermediate</SelectItem>
                          <SelectItem value="Advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="dietType" className="text-gray-300">Diet Type</Label>
                      <Input
                        id="dietType"
                        name="dietType"
                        value={formData.dietType}
                        onChange={(e) => handleChange("dietType", e.target.value)}
                        disabled={!isEditing}
                        className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-500"
                        placeholder="e.g., Vegetarian, Keto, etc."
                      />
                    </div>

                    <div>
                      <Label htmlFor="allergies" className="text-gray-300">Allergies</Label>
                      <Input
                        id="allergies"
                        name="allergies"
                        value={formData.allergies}
                        onChange={(e) => handleChange("allergies", e.target.value)}
                        disabled={!isEditing}
                        className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-500"
                        placeholder="e.g., Dairy, Gluten, Nuts"
                      />
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-700">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      className="border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-white"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleUpdate}
                      disabled={loading}
                      className="bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress">
            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white">Progress Tracking</CardTitle>
                <CardDescription className="text-gray-400">View your fitness journey progress over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Activity className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Progress Analytics</h3>
                  <p className="text-gray-400">Your progress charts and analytics will appear here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workouts">
            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white">Workout Plans</CardTitle>
                <CardDescription className="text-gray-400">Your personalized workout routines and schedules</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Dumbbell className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Workout Plans</h3>
                  <p className="text-gray-400">Your personalized workout plans will be displayed here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;