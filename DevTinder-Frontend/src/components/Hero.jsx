import { motion } from "framer-motion";
import { Link, useOutletContext } from "react-router-dom";
import { useSelector } from "react-redux";

const Hero = () => {
  const { isDarkMode } = useOutletContext();
  const user = useSelector((store) => store.user);

  const floating = {
    animate: {
      y: [0, -18, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden py-12">
      {/* Left Column */}
      <div className="relative z-20 w-full lg:w-1/2 px-4 sm:px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className={`inline-flex items-center gap-3 px-5 py-2 rounded-full border backdrop-blur-xl ${
            isDarkMode
              ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
              : "bg-white/70 border-indigo-200 text-indigo-700"
          }`}
        >
          🚀 Trusted By 10,000+ Developers
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className={`mt-8 text-5xl md:text-7xl xl:text-8xl font-black leading-tight ${
            isDarkMode ? "text-white" : "text-slate-900"
          }`}
        >
          Find Your
          <br />
          <span className="text-cyan-500">Perfect Developer</span>
          <br />
          Match.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={`mt-8 max-w-xl text-lg md:text-xl leading-9 ${
            isDarkMode ? "text-slate-400" : "text-slate-600"
          }`}
        >
          Meet talented developers, collaborate on exciting projects, build
          startups together, and create the future of technology.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-wrap gap-5 mt-10"
        >
          {!user ? (
            <>
              <Link
                to="/signup"
                className={`px-9 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                  isDarkMode
                    ? "bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_35px_rgba(34,211,238,.45)]"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl"
                }`}
              >
                Get Started
              </Link>

              <Link
                to="/login"
                className={`px-9 py-4 rounded-2xl border backdrop-blur-xl font-semibold transition-all ${
                  isDarkMode
                    ? "border-white/20 text-white hover:bg-white/10"
                    : "border-slate-300 bg-white/60 text-slate-800 hover:bg-white"
                }`}
              >
                Login
              </Link>
            </>
          ) : (
            <Link
              to="/feed"
              className={`px-10 py-4 rounded-2xl font-bold ${
                isDarkMode
                  ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/30"
                  : "bg-indigo-600 text-white"
              }`}
            >
              Go To Feed →
            </Link>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="grid grid-cols-3 gap-8 mt-16 max-w-xl"
        >
          <div>
            <h2 className="text-cyan-500 text-4xl sm:text-5xl font-black">
              10K+
            </h2>
            <p
              className={`mt-2 text-sm font-semibold ${
                isDarkMode ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Developers
            </p>
          </div>

          <div>
            <h2 className="text-violet-500 text-4xl sm:text-5xl font-black">
              5000+
            </h2>
            <p
              className={`mt-2 text-sm font-semibold ${
                isDarkMode ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Matches
            </p>
          </div>

          <div>
            <h2 className="text-blue-500 text-4xl sm:text-5xl font-black">
              99%
            </h2>
            <p
              className={`mt-2 text-sm font-semibold ${
                isDarkMode ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Success
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right Column Preview Mockup */}
      <div className="hidden lg:flex w-1/2 justify-center items-center relative">
        <div className="absolute w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-[150px]" />

        <motion.div
          {...floating}
          className={`relative w-[440px] rounded-[35px] border backdrop-blur-3xl shadow-2xl p-7 ${
            isDarkMode
              ? "bg-[#0d121f]/80 border-slate-800"
              : "bg-white/80 border-slate-200"
          }`}
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span
              className={`ml-4 text-xs font-mono font-bold ${
                isDarkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              DevTinder.jsx
            </span>
          </div>

          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className={`rounded-2xl p-4 border ${
                isDarkMode
                  ? "bg-slate-900/60 border-slate-700"
                  : "bg-white border-slate-200"
              }`}
            >
              <p className="text-cyan-400 font-bold text-sm">
                👩‍💻 Sarah • Frontend Developer
              </p>
              <p
                className={`mt-1.5 text-xs ${
                  isDarkMode ? "text-slate-400" : "text-slate-600"
                }`}
              >
                React • Next.js • TailwindCSS • TypeScript
              </p>
              <div className="flex gap-1.5 mt-3 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-[11px] font-bold">
                  React
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-400 text-[11px] font-bold">
                  UI/UX
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[11px] font-bold">
                  Remote
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
              className={`rounded-2xl p-4 border ${
                isDarkMode
                  ? "bg-slate-900/60 border-slate-700"
                  : "bg-white border-slate-200"
              }`}
            >
              <p className="text-emerald-400 font-bold text-sm">
                💚 Match Found
              </p>
              <p
                className={`mt-1.5 text-xs ${
                  isDarkMode ? "text-slate-400" : "text-slate-600"
                }`}
              >
                You and Alex both love building modern web applications.
              </p>
              <div className="mt-3 inline-flex px-3.5 py-1.5 rounded-xl bg-emerald-500 text-black font-bold text-xs">
                🤝 Connected!
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
