import React from "react";
import { motion } from "framer-motion";
import { useOutletContext } from "react-router-dom";

const Community = () => {

  const { isDarkMode } = useOutletContext();


  const stats = [
    {
      value: "10K+",
      title: "Developers",
      icon: "👨‍💻"
    },
    {
      value: "5K+",
      title: "Connections",
      icon: "🤝"
    },
    {
      value: "2K+",
      title: "Projects Built",
      icon: "🚀"
    },
    {
      value: "99%",
      title: "Success Rate",
      icon: "⭐"
    }
  ];


  return (
    <section
      id="community"
      className="py-24 px-6 relative overflow-hidden"
    >


      {/* Background Glow */}

      <div className="absolute top-1/2 left-1/2 
      -translate-x-1/2 -translate-y-1/2
      w-[500px] h-[500px]
      bg-cyan-500/10 blur-[120px]
      rounded-full" />



      <motion.div

        initial={{
          opacity:0,
          scale:.9
        }}

        whileInView={{
          opacity:1,
          scale:1
        }}

        transition={{
          duration:.7
        }}

        className="relative z-10 max-w-6xl mx-auto"

      >


        <h2
          className={`text-5xl font-black text-center mb-6 ${
            isDarkMode
            ? "text-white"
            : "text-slate-900"
          }`}
        >
          Join The Developer Community
        </h2>


        <p
          className={`text-center max-w-2xl mx-auto mb-16 text-lg ${
            isDarkMode
            ? "text-slate-400"
            : "text-slate-600"
          }`}
        >
          Thousands of developers are already connecting,
          collaborating and creating the future together.
        </p>




        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">


          {stats.map((item,index)=>(

            <motion.div

              key={index}

              whileHover={{
                y:-10
              }}

              className={`p-7 rounded-3xl text-center border backdrop-blur-xl ${
                
                isDarkMode

                ? "bg-white/5 border-white/10 text-white"

                : "bg-white/80 border-slate-200 text-slate-900"

              }`}

            >


              <div className="text-4xl mb-4">
                {item.icon}
              </div>


              <h3 className="text-4xl font-black text-cyan-500">
                {item.value}
              </h3>


              <p className={`mt-2 ${
                isDarkMode
                ? "text-slate-400"
                : "text-slate-600"
              }`}>
                {item.title}
              </p>


            </motion.div>

          ))}


        </div>


      </motion.div>


    </section>
  );
};


export default Community;