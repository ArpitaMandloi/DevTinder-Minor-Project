import React from "react";
import { motion } from "framer-motion";

const DynamicBackground = ({ isDarkMode }) => {
  const stars = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    size: Math.random() * 2 + 1,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    duration: Math.random() * 3 + 2,
  }));

  return (
    <div
      className={`fixed inset-0 z-[-1] w-full h-full transition-colors duration-700 ${
        isDarkMode ? "bg-[#050811]" : "bg-slate-50"
      }`}
    >
      {isDarkMode ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
        >
          {stars.map((star) => (
            <motion.div
              key={star.id}
              className="absolute bg-white rounded-full"
              style={{
                width: star.size,
                height: star.size,
                top: star.top,
                left: star.left,
              }}
              animate={{ opacity: [0.1, 0.8, 0.1] }}
              transition={{
                duration: star.duration,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
          {/* Subtle Glows */}
          <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/3 w-[450px] h-[450px] bg-indigo-500/10 blur-[130px] rounded-full pointer-events-none" />
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
        >
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none" />
        </motion.div>
      )}
    </div>
  );
};

export default DynamicBackground;
