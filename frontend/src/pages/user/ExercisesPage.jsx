import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, X, Dumbbell, Activity, Clock, Target, Play, Star, Pause, Square, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

 function ExercisesPage() {
  const [exercises, setExercises] = useState([]);
  const [search, setSearch] = useState("");
  const [bodyPart, setBodyPart] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [activeTimer, setActiveTimer] = useState(null);

  const { user } = useSelector(store => store.auth);
  const token = user?.accessToken;

  const bodyParts = [
    "Chest", "Back", "Legs", "Shoulders", "Arms", "Full Body", "Core"
  ];

  const difficultyColors = {
    Beginner: "bg-green-500/20 text-green-400 border-green-500/30",
    Intermediate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    Advanced: "bg-red-500/20 text-red-400 border-red-500/30"
  };

  const getExercises = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({ search, bodyPart });
      const res = await fetch(`http://localhost:8000/api/v1/features?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setExercises(Array.isArray(data.exercises) ? data.exercises : []);
    } catch (err) {
      console.log("Error fetching exercises:", err);
      setExercises([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    getExercises();
  }, [search, bodyPart]);

  // Timer component
  const ExerciseTimer = ({ exercise, onStop }) => {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(true);
    const [laps, setLaps] = useState([]);

    useEffect(() => {
      let interval;
      if (isRunning) {
        interval = setInterval(() => {
          setTime(prev => prev + 1);
        }, 1000);
      }
      return () => clearInterval(interval);
    }, [isRunning]);

    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const addLap = () => {
      setLaps(prev => [...prev, { time: formatTime(time), totalTime: time }]);
    };

    const resetTimer = () => {
      setTime(0);
      setLaps([]);
      setIsRunning(true);
    };

    const progress = (time % 60) / 60 * 100; // Progress for current minute

    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-linear-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-sm"
      >
        <div className="text-center space-y-4">
          {/* Timer Display */}
          <div className="relative">
            <div className="text-5xl font-bold text-white mb-2 font-mono">
              {formatTime(time)}
            </div>
            <div className="text-sm text-gray-400">Active Timer</div>
            
            {/* Circular Progress */}
            <div className="absolute -top-2 -right-2">
              <div className="w-4 h-4 border-2 border-green-400 rounded-full animate-ping" />
            </div>
          </div>

          {/* Progress Bar */}
          <Progress value={progress} className="h-2 bg-gray-700" />

          {/* Control Buttons */}
          <div className="flex justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsRunning(!isRunning)}
              className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
            >
              {isRunning ? (
                <Pause className="w-4 h-4 mr-2" />
              ) : (
                <Play className="w-4 h-4 mr-2" />
              )}
              {isRunning ? "Pause" : "Resume"}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={addLap}
              className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
            >
              <Star className="w-4 h-4 mr-2" />
              Lap
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={resetTimer}
              className="border-gray-500/50 text-gray-400 hover:bg-gray-500/10"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onStop}
              className="border-red-500/50 text-red-400 hover:bg-red-500/10"
            >
              <Square className="w-4 h-4 mr-2" />
              Stop
            </Button>
          </div>

          {/* Laps */}
          {laps.length > 0 && (
            <div className="mt-4 max-h-32 overflow-y-auto">
              <div className="text-sm text-gray-400 mb-2">Laps:</div>
              <div className="space-y-1">
                {laps.map((lap, index) => (
                  <div key={index} className="flex justify-between text-xs text-gray-300 bg-gray-800/50 p-2 rounded">
                    <span>Lap {index + 1}</span>
                    <span>{lap.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Exercise Info */}
          <div className="pt-4 border-t border-gray-700/50">
            <div className="text-sm text-gray-400">Tracking: <span className="text-white font-semibold">{exercise.name}</span></div>
          </div>
        </div>
      </motion.div>
    );
  };

  const ExerciseCard = ({ exercise, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card 
        className="bg-gray-800/50 backdrop-blur-sm  border-gray-700 shadow-2xl hover:shadow-purple-500/10 transition-all cursor-pointer group"
        onClick={() => setSelectedExercise(exercise)}
      >
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start mb-2">
            <CardTitle className="text-white text-lg group-hover:text-purple-400 transition-colors">
              {exercise.name}
            </CardTitle>
            <Badge className={difficultyColors[exercise.activityLevel] || "bg-gray-500/20 text-gray-400"}>
              {exercise.activityLevel}
            </Badge>
          </div>
          <CardDescription className="text-gray-400 line-clamp-2">
            {exercise.type} • {exercise.focusArea}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pb-3">
          {exercise.media ? (
            <div className="relative overflow-hidden rounded-lg mb-3">
              <img 
                src={exercise.media} 
                alt={exercise.name}
                className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="bg-black/50 text-white backdrop-blur-sm">
                  <Clock className="w-3 h-3 mr-1" />
                  {exercise.duration}
                </Badge>
              </div>
            </div>
          ) : (
            <div className="w-full h-40 bg-linear-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center mb-3">
              <Dumbbell className="w-12 h-12 text-purple-400" />
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center text-gray-400">
              <Target className="w-4 h-4 mr-2 text-purple-400" />
              {exercise.focusArea}
            </div>
            <div className="flex items-center text-gray-400">
              <Activity className="w-4 h-4 mr-2 text-blue-400" />
              {exercise.type}
            </div>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            variant="outline" 
            className="w-full border-purple-500/50 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300 group"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedExercise(exercise);
            }}
          >
            <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
            View Details
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );

  const ExerciseModal = ({ exercise, onClose }) => {
    const isTimerActive = activeTimer?.exerciseId === exercise.id;

    const handleStartTimer = () => {
      setActiveTimer({
        exerciseId: exercise.id,
        startTime: new Date()
      });
    };

    const handleStopTimer = () => {
      setActiveTimer(null);
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 top-8 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-900 border border-gray-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {exercise.media && (
            <div className="relative">
              <img 
                src={exercise.media} 
                alt={exercise.name}
                className="w-full h-full object-cover rounded-t-2xl"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white"
                onClick={onClose}
              >
                <X className="w-5 h-5" />
              </Button>
              <div className="absolute bottom-4 left-4 flex gap-2">
                <Badge className={difficultyColors[exercise.activityLevel]}>
                  {exercise.activityLevel}
                </Badge>
                <Badge variant="secondary" className="bg-black/50 text-white backdrop-blur-sm">
                  <Clock className="w-3 h-3 mr-1" />
                  {exercise.duration}
                </Badge>
              </div>
            </div>
          )}
          
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{exercise.name}</h2>
                <p className="text-gray-400">{exercise.type} • {exercise.focusArea}</p>
              </div>
              
              {/* Timer or Start Button */}
              {isTimerActive ? (
                <ExerciseTimer exercise={exercise} onStop={handleStopTimer} />
              ) : (
                <Button 
                  onClick={handleStartTimer}
                  className="bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Exercise
                </Button>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                <Target className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Focus Area</p>
                <p className="text-white font-semibold">{exercise.focusArea}</p>
              </div>
              <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                <Activity className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Type</p>
                <p className="text-white font-semibold">{exercise.type}</p>
              </div>
              <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                <Clock className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Duration</p>
                <p className="text-white font-semibold">{exercise.duration}</p>
              </div>
            </div>

            {exercise.description && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
                <p className="text-gray-300 leading-relaxed">{exercise.description}</p>
              </div>
            )}

            {exercise.instructions && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Instructions</h3>
                <div className="space-y-2">
                  {exercise.instructions.map((instruction, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-800/30 rounded-lg">
                      <Badge className="bg-purple-500 text-white w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs">
                        {index + 1}
                      </Badge>
                      <p className="text-gray-300 text-sm">{instruction}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
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
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Exercise Library</h1>
          <p className="text-gray-400">Discover and filter exercises tailored to your fitness goals</p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <main className="flex-1">
            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col sm:flex-row gap-4 mb-6"
            >
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search exercises..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-500 h-12"
                />
              </div>
              <Button 
                onClick={getExercises}
                className="bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-12 px-6"
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </motion.div>

            {/* Results Header */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-between mb-6"
            >
              <h2 className="text-xl font-semibold text-white">
                {loading ? "Loading exercises..." : `Showing ${exercises.length} exercise${exercises.length !== 1 ? "s" : ""}`}
              </h2>
              {bodyPart && (
                <Badge variant="outline" className="border-purple-500/50 text-purple-400">
                  {bodyPart}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2 h-4 w-4 p-0 hover:bg-purple-500/20"
                    onClick={() => setBodyPart("")}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              )}
            </motion.div>

            {/* Exercises Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="bg-gray-800/50 border-gray-700">
                    <CardContent className="p-6">
                      <Skeleton className="h-4 w-3/4 mb-4" />
                      <Skeleton className="h-32 w-full mb-4" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {exercises.map((exercise, index) => (
                    <ExerciseCard key={index} exercise={exercise} index={index} />
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* Empty State */}
            {!loading && exercises.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Dumbbell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No exercises found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              </motion.div>
            )}
          </main>

          {/* Sidebar Filters */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-80"
          >
            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 shadow-2xl sticky top-6">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Filter className="w-5 h-5 text-purple-400" />
                  Filter Exercises
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Narrow down by body part
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {bodyParts.map(part => (
                  <div key={part} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer">
                    <input 
                      type="radio"
                      name="bodyPart"
                      value={part}
                      checked={bodyPart === part}
                      onChange={() => setBodyPart(part)}
                      className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 focus:ring-purple-500 focus:ring-offset-gray-800"
                    />
                    <label className="text-gray-300 cursor-pointer flex-1">{part}</label>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-white"
                  onClick={() => setBodyPart("")}
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              </CardFooter>
            </Card>
          </motion.aside>
        </div>
      </div>

      {/* Exercise Modal */}
      <AnimatePresence>
        {selectedExercise && (
          <ExerciseModal 
            exercise={selectedExercise} 
            onClose={() => setSelectedExercise(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default ExercisesPage;