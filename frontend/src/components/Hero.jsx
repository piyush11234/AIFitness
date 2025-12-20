import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import bgImg from '../assets/pose/bg.jpg';

const Hero = () => {
  return (
    <section
      className="relative min-h-[80vh] flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.9)), url(${bgImg})`,
      }}
    >
      {/* Content */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 md:px-12">
        
        {/* Left Text Section */}
        <motion.div
          className="text-center md:text-left max-w-2xl"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold leading-tight bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
            Train Smarter with AI Power
          </h1>
          <p className="mt-6 text-xl text-gray-300">
            Improve your posture, track your reps, and get personalized workout 
            feedback — all in real time using AI.
          </p>

          <div className="mt-10 flex justify-center md:justify-start gap-6">
            <Link to="/signup">
              <Button className="bg-linear-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white text-lg px-8 py-6 rounded-xl shadow-2xl shadow-green-900/50 cursor-pointer transition-all duration-300">
                Start Training
              </Button>
            </Link>
            <Link to="/plans">
              <Button
                variant="outline"
                className="border-2 border-green-400/50 hover:border-green-400 hover:bg-green-950/30 text-green-300 hover:text-green-200 cursor-pointer text-lg px-8 py-6 rounded-xl backdrop-blur-sm transition-all duration-300"
              >
                Explore Plans
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;