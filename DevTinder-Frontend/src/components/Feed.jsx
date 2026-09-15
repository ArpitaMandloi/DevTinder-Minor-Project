import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";
import { useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowRotateRight, FaHeart, FaXmark } from "react-icons/fa6";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const { isDarkMode } = useOutletContext();

  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null); // { message: string, type: 'like' | 'nope', name: string }

  const showToast = (feedback) => {
    setToast(feedback);
    setTimeout(() => {
      setToast(null);
    }, 2200);
  };

  const fetchFeedFromBackend = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${BASE_URL}/feed?limit=50`, {
        withCredentials: true,
      });

      const users = res.data.data?.users || res.data.data || res.data;
      dispatch(addFeed(Array.isArray(users) ? users : []));
    } catch (err) {
      console.error("Error loading feed:", err);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchFeedFromBackend();
  }, [fetchFeedFromBackend]);

  const displayedFeed = Array.isArray(feed) ? feed : [];

  return (
    <div className="relative z-10 min-h-[85vh] flex flex-col items-center px-4 py-4 overflow-hidden">
      {/* Background ambient glowing gradient spheres */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className={`absolute top-1/4 left-1/4 h-96 w-96 rounded-full blur-[140px] transition-colors duration-1000 ${
            isDarkMode ? "bg-cyan-500/10" : "bg-cyan-500/5"
          }`}
        />
        <div
          className={`absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full blur-[140px] transition-colors duration-1000 ${
            isDarkMode ? "bg-violet-500/10" : "bg-violet-500/5"
          }`}
        />
      </div>

      {/* Floating Swipe Feedback Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.85 }}
            className={`fixed top-24 z-50 px-6 py-3 rounded-full font-black text-sm shadow-2xl backdrop-blur-xl border flex items-center gap-2.5 ${
              toast.type === "like"
                ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                : "bg-rose-500/20 border-rose-500/40 text-rose-300"
            }`}
          >
            {toast.type === "like" ? (
              <>
                <FaHeart className="text-emerald-400" />
                <span>Connected with {toast.name}!</span>
              </>
            ) : (
              <>
                <FaXmark className="text-rose-400" />
                <span>Passed on {toast.name}</span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header & Refresh Control */}
      <div className="w-full max-w-[380px] mb-4 z-20 flex items-center justify-between px-2">
        <div>
          <h2
            className={`text-xl font-black ${
              isDarkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Discover <span className="text-cyan-500">Developers</span>
          </h2>
          <p className="text-xs text-slate-400">
            Swipe right to connect, left to pass
          </p>
        </div>

        <button
          onClick={fetchFeedFromBackend}
          className={`p-2.5 rounded-xl border text-xs transition-all flex items-center gap-1.5 font-bold ${
            isDarkMode
              ? "border-slate-800 bg-[#111624] text-slate-300 hover:text-white hover:border-cyan-500/40"
              : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
          }`}
          title="Refresh Feed"
        >
          <FaArrowRotateRight
            className={isLoading ? "animate-spin text-cyan-400" : ""}
          />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* ================= MAIN FEED / CARD STACK ================= */}
      {isLoading && displayedFeed.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[52vh] gap-3">
          <span className="loading loading-spinner text-cyan-500 loading-lg"></span>
          <p className="text-xs text-slate-400 font-semibold tracking-wider">
            Fetching Talented Developers...
          </p>
        </div>
      ) : displayedFeed.length === 0 ? (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`flex flex-col items-center justify-center min-h-[50vh] text-center px-8 py-10 max-w-md mx-auto rounded-3xl border shadow-2xl backdrop-blur-xl z-20 ${
            isDarkMode
              ? "bg-[#0d111a]/80 border-slate-800"
              : "bg-white/80 border-slate-200"
          }`}
        >
          <div className="text-6xl mb-4">🏁</div>
          <h2
            className={`text-2xl sm:text-3xl font-black mb-2 ${
              isDarkMode ? "text-white" : "text-slate-900"
            }`}
          >
            All Caught Up!
          </h2>
          <p
            className={`text-sm leading-relaxed mb-6 ${
              isDarkMode ? "text-slate-400" : "text-slate-600"
            }`}
          >
            You've browsed through all active developer profiles! Check back
            later or reload to view fresh recommendations.
          </p>

          <button
            onClick={fetchFeedFromBackend}
            className="px-8 py-3.5 rounded-2xl font-black text-sm bg-cyan-500 text-black hover:bg-cyan-400 transition shadow-lg shadow-cyan-500/30 flex items-center gap-2"
          >
            <FaArrowRotateRight /> Reload Feed
          </button>
        </motion.div>
      ) : (
        /* The Card Stack Container with 3D Depth */
        <div className="relative w-full max-w-[400px] h-[620px] flex justify-center mt-2 z-20">
          {displayedFeed
            .slice(0, 3)
            .reverse()
            .map((user, index, array) => {
              const isTop = index === array.length - 1;
              const visualIndex = array.length - 1 - index;

              return (
                <div
                  key={user._id}
                  className="absolute w-full flex justify-center transition-all duration-300 ease-out"
                  style={{
                    zIndex: 10 - visualIndex,
                    transform: `scale(${1 - visualIndex * 0.05}) translateY(${
                      visualIndex * 16
                    }px)`,
                    opacity: 1 - visualIndex * 0.22,
                    pointerEvents: isTop ? "auto" : "none",
                  }}
                >
                  <UserCard
                    user={user}
                    isTop={isTop}
                    onSwipeFeedback={showToast}
                  />
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default Feed;
