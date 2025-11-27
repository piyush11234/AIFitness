import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
// import heroImg from '../assets/pose/bg.jpg'; 
import bgImg from '../assets/pose/bg.jpg' // ✅ background image

const Hero = () => {
  return (
    <section
      className="relative min-h-[80vh] flex items-center justify-center bg-cover bg-center text-white "
      style={{
        backgroundImage: `url(${bgImg})`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 md:px-12">
        
        {/* Left Text Section */}
        <motion.div
          className="text-center md:text-left max-w-xl"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Train Smarter with <span className="text-green-400">AI Power</span>
          </h1>
          <p className="mt-4 text-lg text-gray-200">
            Improve your posture, track your reps, and get personalized workout 
            feedback — all in real time using AI.
          </p>

          <div className="mt-8 flex justify-center md:justify-start gap-4">
            <Link to="/train">
              <Button className="bg-green-600 hover:bg-green-700 text-white text-lg px-6 py-3 rounded-xl shadow-md">
                Start Training
              </Button>
            </Link>
            <Link to="/plans">
              <Button
                variant="outline"
                className="text-green-400 border-green-400 hover:bg-green-50/10 text-lg px-6 py-3 rounded-xl"
              >
                Explore Plans
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Right Image / Animation */}
        {/* <motion.div
          className="mt-12 md:mt-0"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <img
            src={heroImg}
            alt="AI Fitness Coach"
            className="w-full md:w-[480px] drop-shadow-2xl rounded-2xl"
          />
        </motion.div> */}
      </div>
    </section>
  );
};

export default Hero;
