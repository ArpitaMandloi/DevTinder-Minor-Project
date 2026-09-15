import React from "react";
import { motion } from "framer-motion";
import { Link, useOutletContext } from "react-router-dom";
import { useSelector } from "react-redux";

const CTA = () => {

  const { isDarkMode } = useOutletContext();
  const user = useSelector((store)=>store.user);


  return (
    <section
      className="py-24 px-6"
    >

      <motion.div

        initial={{
          opacity:0,
          y:40
        }}

        whileInView={{
          opacity:1,
          y:0
        }}

        transition={{
          duration:.7
        }}

        className={`max-w-5xl mx-auto rounded-[40px] p-12 text-center border backdrop-blur-xl ${
          
          isDarkMode

          ? "bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border-white/10"

          : "bg-gradient-to-br from-indigo-50 to-cyan-50 border-slate-200"

        }`}

      >


        <h2
          className={`text-5xl md:text-6xl font-black ${
            isDarkMode
            ? "text-white"
            : "text-slate-900"
          }`}
        >
          Ready To Find Your
          <span className="text-cyan-500">
            {" "}Developer Match?
          </span>
        </h2>



        <p
          className={`mt-6 max-w-2xl mx-auto text-lg ${
            isDarkMode
            ? "text-slate-400"
            : "text-slate-600"
          }`}
        >
          Join DevTinder today and connect with talented
          developers around the world.
        </p>



        {user ? (
          <Link to="/feed">
            <motion.button
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.95,
              }}
              className={`mt-10 px-12 py-4 rounded-2xl font-black text-xl ${
                isDarkMode
                  ? "bg-cyan-500 text-black hover:bg-cyan-400 shadow-[0_0_40px_rgba(34,211,238,.4)]"
                  : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl"
              }`}
            >
              Explore Developer Feed →
            </motion.button>
          </Link>
        ) : (
          <Link to="/signup">
            <motion.button
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.95,
              }}
              className={`mt-10 px-12 py-4 rounded-2xl font-black text-xl ${
                isDarkMode
                  ? "bg-cyan-500 text-black hover:bg-cyan-400 shadow-[0_0_40px_rgba(34,211,238,.4)]"
                  : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl"
              }`}
            >
              Create Free Account
            </motion.button>
          </Link>
        )}


      </motion.div>


    </section>
  );
};


export default CTA;