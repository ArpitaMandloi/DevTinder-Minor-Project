import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate, useOutletContext } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isDarkMode } = useOutletContext();

  const validateForm = () => {
    if (!emailId || !password) {
      setError("All fields are required.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailId.trim())) {
      setError("Please enter a valid email address.");
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    setError("");
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const res = await axios.post(
        `${BASE_URL}/login`,
        {
          emailId: emailId.trim(),
          password,
        },
        {
          withCredentials: true,
        }
      );

      dispatch(addUser(res.data.data?.user || res.data.data || res.data));
      navigate("/feed");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          (typeof err.response?.data === "string" ? err.response?.data : null) ||
          "Invalid Credentials. Please check your email and password."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full max-w-7xl">
        {/* Left Side Hero Banner */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:block"
        >
          <span
            className={`inline-flex items-center gap-2 px-5 py-2 rounded-full border backdrop-blur-xl ${
              isDarkMode
                ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                : "bg-white/70 border-indigo-200 text-indigo-700"
            }`}
          >
            🚀 Welcome Back Developer
          </span>

          <h1
            className={`mt-8 text-6xl font-black leading-tight ${
              isDarkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Continue
            <br />
            <span className="text-cyan-500">Building</span>
            <br />
            Amazing Projects.
          </h1>

          <p
            className={`mt-8 text-lg leading-8 max-w-xl ${
              isDarkMode ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Connect with thousands of developers, explore collaboration
            opportunities, share project ideas, and build your dream network.
          </p>

          <div className="grid grid-cols-3 gap-8 mt-12">
            <div>
              <h2 className="text-4xl font-black text-cyan-500">10K+</h2>
              <p className={isDarkMode ? "text-slate-400 mt-1" : "text-slate-600 mt-1"}>
                Developers
              </p>
            </div>
            <div>
              <h2 className="text-4xl font-black text-violet-500">5K+</h2>
              <p className={isDarkMode ? "text-slate-400 mt-1" : "text-slate-600 mt-1"}>
                Matches
              </p>
            </div>
            <div>
              <h2 className="text-4xl font-black text-blue-500">99%</h2>
              <p className={isDarkMode ? "text-slate-400 mt-1" : "text-slate-600 mt-1"}>
                Success
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right Side Login Card */}
        <motion.div
          initial={{ opacity: 0, x: 60, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8 }}
          className={`w-full max-w-md mx-auto rounded-[32px] border backdrop-blur-3xl p-8 shadow-2xl ${
            isDarkMode
              ? "bg-[#0c101c]/80 border-slate-800"
              : "bg-white/80 border-slate-200"
          }`}
        >
          <div className="text-center mb-8">
            <h2
              className={`text-3xl sm:text-4xl font-black ${
                isDarkMode ? "text-white" : "text-slate-900"
              }`}
            >
              Login
            </h2>
            <p
              className={`mt-2 text-sm ${
                isDarkMode ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Sign in to continue your developer journey.
            </p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-400 text-sm font-medium"
              >
                ⚠️ {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4">
            {/* Email */}
            <div>
              <label
                className={`block mb-1.5 text-xs font-bold uppercase tracking-wider ${
                  isDarkMode ? "text-slate-300" : "text-slate-700"
                }`}
              >
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm">
                  📧
                </span>
                <input
                  type="email"
                  placeholder="developer@example.com"
                  value={emailId}
                  onChange={(e) => setEmailId(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border outline-none text-sm font-medium transition-all ${
                    isDarkMode
                      ? "bg-[#141a29] border-slate-700 text-white focus:border-cyan-500"
                      : "bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-500"
                  }`}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                className={`block mb-1.5 text-xs font-bold uppercase tracking-wider ${
                  isDarkMode ? "text-slate-300" : "text-slate-700"
                }`}
              >
                Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm">
                  🔒
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  className={`w-full pl-11 pr-12 py-3 rounded-xl border outline-none text-sm font-medium transition-all ${
                    isDarkMode
                      ? "bg-[#141a29] border-slate-700 text-white focus:border-cyan-500"
                      : "bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-base"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogin}
              disabled={isLoading}
              className={`w-full py-3.5 rounded-xl font-black text-base mt-2 transition-all shadow-lg ${
                isLoading
                  ? "bg-cyan-500/50 cursor-not-allowed text-black"
                  : isDarkMode
                  ? "bg-cyan-500 text-black hover:bg-cyan-400 shadow-cyan-500/30"
                  : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/30"
              }`}
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Login"
              )}
            </motion.button>

            <div className="text-center mt-6">
              <p
                className={`text-sm ${
                  isDarkMode ? "text-slate-400" : "text-slate-600"
                }`}
              >
                Don't have an account?{" "}
                <span
                  onClick={() => navigate("/signup")}
                  className="text-cyan-500 font-bold cursor-pointer hover:underline"
                >
                  Create New Account
                </span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
