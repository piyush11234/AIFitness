import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { X, Clock, Star, Play, Pause, Square, RotateCcw } from "lucide-react";

const difficultyColors = {
  Beginner: "bg-green-500/20 text-green-400 border-green-500/30",
  Intermediate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Advanced: "bg-red-500/20 text-red-400 border-red-500/30",
  Relaxation: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Strength: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Balance: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  "Spine Mobility": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  Flexibility: "bg-teal-500/20 text-teal-400 border-teal-500/30",
};

const categories = [
  "All",
  "Beginner",
  "Intermediate",
  "Advanced",
  "Relaxation",
  "Strength",
  "Balance",
  "Spine Mobility",
  "Flexibility"
];

export default function YogaPage() {
  const [yogas, setYogas] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(false);
  const [selectedYoga, setSelectedYoga] = useState(null);
  const [activeTimer, setActiveTimer] = useState(null);

  const fetchYogas = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (search) query.append("search", search);
      if (category && category !== "All") query.append("category", category);

      const res = await fetch(`http://localhost:8000/api/v1/features/yoga?${query}`);
      const data = await res.json();

      if (data.success) {
        setYogas(data.yoga);
      } else {
        setYogas([]);
      }
    } catch (err) {
      console.error("Error fetching yoga:", err);
      setYogas([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchYogas();
  }, [search, category]);

  // Timer component
  const YogaTimer = ({ yoga, onStop }) => {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(true);
    const [laps, setLaps] = useState([]);

    useEffect(() => {
      let interval;
      if (isRunning) {
        interval = setInterval(() => setTime((prev) => prev + 1), 1000);
      }
      return () => clearInterval(interval);
    }, [isRunning]);

    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const addLap = () => setLaps((prev) => [...prev, { time: formatTime(time), totalTime: time }]);
    const resetTimer = () => { setTime(0); setLaps([]); setIsRunning(true); };
    const progress = (time % 60) / 60 * 100;

    return (
      <motion.div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 text-white">
        <div className="text-center space-y-4">
          <div className="text-5xl font-mono font-bold">{formatTime(time)}</div>
          <Progress value={progress} className="h-2 bg-gray-700" />
          <div className="flex justify-center gap-2">
            <Button onClick={() => setIsRunning(!isRunning)} size="sm">{isRunning ? <><Pause className="w-4 h-4 mr-1" />Pause</> : <><Play className="w-4 h-4 mr-1" />Resume</>}</Button>
            <Button onClick={addLap} size="sm"><Star className="w-4 h-4 mr-1" />Lap</Button>
            <Button onClick={resetTimer} size="sm"><RotateCcw className="w-4 h-4 mr-1" />Reset</Button>
            <Button onClick={onStop} size="sm"><Square className="w-4 h-4 mr-1" />Stop</Button>
          </div>
          {laps.length > 0 && (
            <div className="mt-2 max-h-32 overflow-y-auto">
              {laps.map((lap, index) => (
                <div key={index} className="flex justify-between text-xs bg-gray-700 p-1 rounded">
                  <span>Lap {index + 1}</span>
                  <span>{lap.time}</span>
                </div>
              ))}
            </div>
          )}
          <div className="pt-2 border-t border-gray-700/50">
            <div className="text-sm text-gray-300">Tracking: <span className="font-semibold">{yoga.name}</span></div>
          </div>
        </div>
      </motion.div>
    );
  };

  const YogaCard = ({ yoga, index }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
      <Card className="bg-gray-800/50 border-gray-700 cursor-pointer hover:shadow-lg" onClick={() => setSelectedYoga(yoga)}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center mb-1">
            <CardTitle className="text-white text-lg">{yoga.name}</CardTitle>
            <Badge className={difficultyColors[yoga.category] || "bg-gray-500/20 text-gray-400"}>{yoga.category}</Badge>
          </div>
          <CardDescription className="text-gray-400 line-clamp-2">{yoga.focusArea} • {yoga.duration}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <img src={yoga.media} alt={yoga.name} className="w-full h-85 object-cover rounded-b-lg" />
        </CardContent>
      </Card>
    </motion.div>
  );

  const YogaModal = ({ yoga, onClose }) => {
    const isTimerActive = activeTimer?.yogaName === yoga.name;
    const handleStartTimer = () => setActiveTimer({ yogaName: yoga.name });
    const handleStopTimer = () => setActiveTimer(null);

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-gray-900 border border-gray-700 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-4" onClick={(e) => e.stopPropagation()}>
          <img src={yoga.media} alt={yoga.name} className="w-full h-full object-cover rounded-t-2xl mb-4" />
          <Button size="icon" variant="ghost" className="absolute top-4 right-4" onClick={onClose}><X className="w-5 h-5" /></Button>
          <h2 className="text-2xl font-bold text-white mb-2">{yoga.name}</h2>
          <p className="text-gray-400 mb-4">{yoga.focusArea} • {yoga.duration}</p>
          {isTimerActive ? <YogaTimer yoga={yoga} onStop={handleStopTimer} /> : <Button onClick={handleStartTimer} className="bg-purple-600 text-white mb-4"><Play className="w-4 h-4 mr-1" />Start Yoga</Button>}
          <p className="text-gray-300">{yoga.description}</p>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <h1 className="text-3xl font-bold text-white mb-2">Yoga Library 🧘</h1>
      <p className="text-gray-400 mb-4">Discover and filter yoga poses tailored to your goals</p>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Input placeholder="Search yoga..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 bg-gray-800 border-gray-700 text-white" />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="bg-gray-800 border-gray-700 text-white p-2 rounded">
          {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <Button onClick={fetchYogas} className="bg-purple-600 text-white">Search</Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {yogas.map((yoga, i) => <YogaCard key={i} yoga={yoga} index={i} />)}
          </AnimatePresence>
        </div>
      )}

      {yogas.length === 0 && !loading && <p className="text-gray-400 text-center py-10">No yoga poses found</p>}

      <AnimatePresence>
        {selectedYoga && <YogaModal yoga={selectedYoga} onClose={() => setSelectedYoga(null)} />}
      </AnimatePresence>
    </div>
  );
}
