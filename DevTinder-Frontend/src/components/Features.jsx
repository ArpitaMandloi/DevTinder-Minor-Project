import React from "react";
import { motion } from "framer-motion";
import { useOutletContext } from "react-router-dom";

const Features = () => {
  const { isDarkMode } = useOutletContext();

  const features = [
    {
      icon: "👨‍💻",
      title: "Find Developers",
      desc: "Connect with developers having similar skills and interests."
    },
    {
      icon: "🚀",
      title: "Build Projects",
      desc: "Collaborate and create amazing real-world projects together."
    },
    {
      icon: "🤝",
      title: "Grow Network",
      desc: "Expand your developer community and career opportunities."
    },
  ];


  return (
    <section
      id="features"
      className="py-24 px-6"
    >

      <motion.h2
        initial={{opacity:0,y:30}}
        whileInView={{opacity:1,y:0}}
        transition={{duration:.6}}
        className={`text-5xl font-black text-center mb-14 ${
          isDarkMode 
          ? "text-white"
          : "text-slate-900"
        }`}
      >
        Powerful Features
      </motion.h2>


      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">

        {features.map((item,index)=>(
          <motion.div
            key={index}
            whileHover={{y:-10}}
            className={`p-8 rounded-3xl border backdrop-blur-xl ${
              isDarkMode
              ? "bg-white/5 border-white/10 text-white"
              : "bg-white/70 border-slate-200 text-slate-900"
            }`}
          >

            <div className="text-5xl mb-5">
              {item.icon}
            </div>

            <h3 className="text-2xl font-bold mb-3">
              {item.title}
            </h3>

            <p className={
              isDarkMode
              ? "text-slate-400"
              : "text-slate-600"
            }>
              {item.desc}
            </p>

          </motion.div>
        ))}

      </div>

    </section>
  );
};

export default Features;