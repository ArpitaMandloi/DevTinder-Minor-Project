import React from "react";
import { motion } from "framer-motion";
import { useOutletContext } from "react-router-dom";

const HowItWorks = () => {

  const { isDarkMode } = useOutletContext();


  const steps = [
    {
      number: "01",
      title: "Create Profile",
      desc: "Show your skills, projects, experience and developer journey."
    },
    {
      number: "02",
      title: "Discover Developers",
      desc: "Find developers according to your technology and interests."
    },
    {
      number: "03",
      title: "Connect & Build",
      desc: "Send requests, collaborate and build amazing products."
    }
  ];


  return (
    <section
      id="how-it-works"
      className="py-24 px-6"
    >

      <motion.h2
        initial={{
          opacity:0,
          y:30
        }}
        whileInView={{
          opacity:1,
          y:0
        }}
        transition={{
          duration:.6
        }}
        className={`text-5xl font-black text-center mb-16 ${
          isDarkMode
          ? "text-white"
          : "text-slate-900"
        }`}
      >
        How It Works
      </motion.h2>



      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10">


        {steps.map((step,index)=>(

          <motion.div

            key={index}

            initial={{
              opacity:0,
              y:40
            }}

            whileInView={{
              opacity:1,
              y:0
            }}

            transition={{
              delay:index*0.2,
              duration:.5
            }}

            whileHover={{
              scale:1.05
            }}

            className={`relative p-8 rounded-3xl border ${
              
              isDarkMode

              ? "bg-[#111]/70 border-white/10 text-white"

              : "bg-white/80 border-slate-200 text-slate-900"

            }`}

          >


            <div className="text-6xl font-black text-cyan-500 mb-5">
              {step.number}
            </div>


            <h3 className="text-2xl font-bold mb-4">
              {step.title}
            </h3>


            <p className={
              isDarkMode
              ? "text-slate-400"
              : "text-slate-600"
            }>
              {step.desc}
            </p>


          </motion.div>

        ))}


      </div>


    </section>
  );
};


export default HowItWorks;