import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { X, Play, Pause } from "lucide-react";

// Meditation categories for filtering
const categories = ["All", "Relaxation", "Mindfulness", "Stress Relief", "Sleep", "Focus", "Energy"];

const categoryColors = {
  Relaxation: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Mindfulness: "bg-teal-500/20 text-teal-400 border-teal-500/30",
  "Stress Relief": "bg-red-500/20 text-red-400 border-red-500/30",
  Sleep: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Focus: "bg-green-500/20 text-green-400 border-green-500/30",
  Energy: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
};

export default function MeditationPage() {
  const [meditations, setMeditations] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(false);
  const [selectedMeditation, setSelectedMeditation] = useState(null);
  const [playingId, setPlayingId] = useState(null);

  const audioRef = useRef(null);

  // Fetch meditations from backend
  const fetchMeditations = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (search) query.append("search", search);
      if (category && category !== "All") query.append("category", category);

      const res = await fetch(`http://localhost:8000/api/v1/features/meditations?${query}`);
      const data = await res.json();

      if (data.success) setMeditations(data.meditation);
      else setMeditations([]);
    } catch (err) {
      console.error("Error fetching meditations:", err);
      setMeditations([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMeditations();
  }, [search, category]);

  // Handle audio play/pause
  const handlePlayPause = (meditation) => {
    if (playingId === meditation.name) {
      audioRef.current.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) audioRef.current.pause();
      const newAudio = new Audio(meditation.mediaAudio);
      newAudio.play();
      audioRef.current = newAudio;
      setPlayingId(meditation.name);

      newAudio.onended = () => setPlayingId(null);
    }
  };

  const MeditationCard = ({ meditation, index }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
      <Card className="bg-gray-800/50 border-gray-700 cursor-pointer hover:shadow-lg" onClick={() => setSelectedMeditation(meditation)}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center mb-1">
            <CardTitle className="text-white text-lg">{meditation.name}</CardTitle>
            <Badge className={categoryColors[meditation.category] || "bg-gray-500/20 text-gray-400"}>{meditation.category}</Badge>
          </div>
          <CardDescription className="text-gray-400">{meditation.duration}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <img src={meditation.mediaImage} alt={meditation.name} className="w-full h-84 object-cover rounded-b-lg" />
        </CardContent>
      </Card>
    </motion.div>
  );

  const MeditationModal = ({ meditation, onClose }) => {
    const isPlaying = playingId === meditation.name;
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-gray-900 border border-gray-700 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-4" onClick={(e) => e.stopPropagation()}>
          <img src={meditation.mediaImage} alt={meditation.name} className="w-full h-full object-cover rounded-t-2xl mb-4" />
          <Button size="icon" variant="ghost" className="absolute top-4 right-4" onClick={onClose}><X className="w-5 h-5" /></Button>
          <h2 className="text-2xl font-bold text-white mb-2">{meditation.name}</h2>
          <p className="text-gray-400 mb-4">{meditation.category} • {meditation.duration}</p>
          <Button onClick={() => handlePlayPause(meditation)} className="bg-purple-600 text-white mb-4">
            {isPlaying ? <><Pause className="w-4 h-4 mr-1" />Pause</> : <><Play className="w-4 h-4 mr-1" />Play</>}
          </Button>
          <p className="text-gray-300">{meditation.description}</p>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <h1 className="text-3xl font-bold text-white mb-2">Meditation Library 🧘‍♂️</h1>
      <p className="text-gray-400 mb-4">Explore guided meditations and filter by category or duration</p>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Input placeholder="Search meditation..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 bg-gray-800 border-gray-700 text-white" />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="bg-gray-800 border-gray-700 text-white p-2 rounded">
          {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <Button onClick={fetchMeditations} className="bg-purple-600 text-white">Search</Button>
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
            {meditations.map((med, i) => <MeditationCard key={i} meditation={med} index={i} />)}
          </AnimatePresence>
        </div>
      )}

      {meditations.length === 0 && !loading && <p className="text-gray-400 text-center py-10">No meditations found</p>}

      <AnimatePresence>
        {selectedMeditation && <MeditationModal meditation={selectedMeditation} onClose={() => setSelectedMeditation(null)} />}
      </AnimatePresence>
    </div>
  );
}
