import React, { useState } from "react";
import axios from "axios";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import { useDispatch } from "react-redux";
import { useOutletContext } from "react-router-dom";
import {
  FaLocationDot,
  FaBriefcase,
  FaGithub,
  FaLinkedin,
  FaXTwitter,
  FaGlobe,
  FaHeart,
  FaXmark,
} from "react-icons/fa6";

import {
  BASE_URL,
  formatExternalUrl,
  formatGithubUrl,
} from "../utils/constants";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ user, isTop, onSwipeFeedback }) => {
  const dispatch = useDispatch();
  const { isDarkMode } = useOutletContext();

  const [isSwiping, setIsSwiping] = useState(false);

  // Motion Values for X and Y drag distance
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Dynamic rotation: smooth card tilt during drag
  const rotate = useTransform(x, [-300, 300], [-18, 18]);

  // Stamp Opacity
  const likeOpacity = useTransform(x, [30, 120], [0, 1]);
  const nopeOpacity = useTransform(x, [-30, -120], [0, 1]);

  if (!user) return null;

  const {
    _id,
    firstName,
    lastName,
    photoUrl,
    age,
    gender,
    about,
    skills,
    headline,
    location,
    yearsOfExperience,
    githubUsername,
    githubUrl,
    linkedinUrl,
    twitterUrl,
    portfolioUrl,
  } = user;

  // Swipe execution with instant feedback & backend sync
  const executeSwipe = async (direction, status = null) => {
    if (isSwiping || !isTop) return;
    setIsSwiping(true);

    const actionStatus =
      status || (direction === "right" ? "interested" : "ignored");
    const targetX =
      direction === "right" ? 800 : direction === "left" ? -800 : 0;
    const targetY = direction === "up" ? -800 : 0;

    // 1. Trigger fly away animation
    animate(x, targetX, { duration: 0.35, ease: "easeOut" });
    animate(y, targetY || -40, { duration: 0.35, ease: "easeOut" });
    animate(rotate, direction === "right" ? 22 : -22, { duration: 0.35 });

    // 2. Feedback toast for the user
    if (onSwipeFeedback) {
      onSwipeFeedback(
        actionStatus === "interested"
          ? { type: "like", name: `${firstName} ${lastName}` }
          : { type: "nope", name: `${firstName} ${lastName}` }
      );
    }

    // 3. Remove from Redux feed after brief visual departure
    setTimeout(() => {
      dispatch(removeUserFromFeed(_id));
    }, 180);

    // 4. Send API request to backend
    try {
      await axios.post(
        `${BASE_URL}/request/send/${actionStatus}/${_id}`,
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.warn(
        "Swipe request notice:",
        err.response?.data?.message || err.message
      );
    }
  };

  return (
    <motion.div
      drag={isTop}
      dragConstraints={{ left: -1000, right: 1000, top: -800, bottom: 200 }}
      dragElastic={0.9}
      style={{
        x,
        y,
        rotate,
      }}
      whileTap={isTop ? { cursor: "grabbing" } : {}}
      onDragEnd={(event, info) => {
        if (!isTop) return;

        const swipeThreshold = 55;
        const velocityThreshold = 250;

        if (
          info.offset.x > swipeThreshold ||
          info.velocity.x > velocityThreshold
        ) {
          executeSwipe("right", "interested");
        } else if (
          info.offset.x < -swipeThreshold ||
          info.velocity.x < -velocityThreshold
        ) {
          executeSwipe("left", "ignored");
        } else {
          // Snap back smoothly
          animate(x, 0, { type: "spring", stiffness: 450, damping: 28 });
          animate(y, 0, { type: "spring", stiffness: 450, damping: 28 });
        }
      }}
      className={`relative w-[340px] sm:w-[380px] md:w-[400px] h-[600px] rounded-[32px] overflow-hidden select-none border transition-shadow duration-300 shadow-2xl ${
        isDarkMode
          ? "bg-[#0c101c] border-slate-700/80 shadow-[0_25px_60px_rgba(0,0,0,0.8)]"
          : "bg-white border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
      }`}
    >
      {/* Visual Depth Glow (top card only) */}
      {isTop && (
        <div className="absolute -inset-1 rounded-[36px] bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 blur-xl opacity-75 pointer-events-none" />
      )}

      <div className="relative w-full h-full flex flex-col justify-between overflow-hidden rounded-[32px]">
        {/* ================= 1. PHOTO & OVERLAY ================= */}
        <div className="relative h-[370px] w-full overflow-hidden shrink-0">
          <img
            src={
              photoUrl ||
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop"
            }
            alt={firstName}
            className="w-full h-full object-cover pointer-events-none"
            loading="eager"
          />

          {/* Vignette Gradient Scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c101c] via-[#0c101c]/35 to-transparent pointer-events-none" />

          {/* DYNAMIC SWIPE STAMPS */}
          <motion.div
            style={{ opacity: likeOpacity }}
            className="absolute top-8 left-6 z-30 border-[4px] border-emerald-400 bg-emerald-950/70 backdrop-blur-md rounded-2xl px-5 py-1.5 rotate-[-16deg] shadow-lg shadow-emerald-500/30 pointer-events-none"
          >
            <span className="text-3xl font-black text-emerald-400 tracking-wider uppercase flex items-center gap-2">
              LIKE <FaHeart className="text-2xl" />
            </span>
          </motion.div>

          <motion.div
            style={{ opacity: nopeOpacity }}
            className="absolute top-8 right-6 z-30 border-[4px] border-rose-500 bg-rose-950/70 backdrop-blur-md rounded-2xl px-5 py-1.5 rotate-[16deg] shadow-lg shadow-rose-500/30 pointer-events-none"
          >
            <span className="text-3xl font-black text-rose-500 tracking-wider uppercase flex items-center gap-2">
              NOPE <FaXmark className="text-2xl" />
            </span>
          </motion.div>

          {/* Image Overlay Information */}
          <div className="absolute bottom-3 left-0 w-full px-5 pointer-events-none z-10">
            <div className="flex items-baseline gap-2">
              <h2 className="text-2xl sm:text-3xl font-black text-white drop-shadow-md truncate">
                {firstName} {lastName}
              </h2>
              {age && (
                <span className="text-xl font-bold text-slate-300">{age}</span>
              )}
            </div>

            <p className="text-sm font-bold text-cyan-400 drop-shadow mt-0.5 truncate">
              {headline || "Full Stack Developer"}
            </p>

            {/* Quick Meta Pills */}
            <div className="flex flex-wrap gap-2 mt-2">
              {location && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-white/15 backdrop-blur-md border border-white/20 text-white">
                  <FaLocationDot className="text-[9px]" /> {location}
                </span>
              )}
              {yearsOfExperience > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-white/15 backdrop-blur-md border border-white/20 text-white">
                  <FaBriefcase className="text-[9px]" /> {yearsOfExperience}+
                  Years
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ================= 2. DETAILS & SKILLS SECTION ================= */}
        <div
          className={`flex-1 px-5 pt-2 pb-3 flex flex-col justify-between ${
            isDarkMode ? "bg-[#0c101c]" : "bg-white"
          }`}
        >
          {/* Bio */}
          <p
            className={`text-xs leading-relaxed line-clamp-2 ${
              isDarkMode ? "text-slate-300" : "text-slate-600"
            }`}
          >
            {about ||
              "Passionate developer exploring cutting-edge tools, building creative projects, and looking for awesome collaborators!"}
          </p>

          {/* Dynamic Skills Chips */}
          <div className="my-2">
            <span
              className={`text-[10px] font-black uppercase tracking-wider block mb-1.5 opacity-60 ${
                isDarkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Skills & Tech Stack
            </span>
            <div className="flex flex-wrap gap-1.5">
              {skills && skills.length > 0 ? (
                skills.slice(0, 5).map((skill, index) => (
                  <span
                    key={index}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
                      isDarkMode
                        ? "bg-cyan-500/10 border-cyan-500/25 text-cyan-300"
                        : "bg-indigo-50 border-indigo-200 text-indigo-700"
                    }`}
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic">
                  React • Node.js • JavaScript
                </span>
              )}
              {skills && skills.length > 5 && (
                <span
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                    isDarkMode
                      ? "bg-slate-800 text-slate-400"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  +{skills.length - 5}
                </span>
              )}
            </div>
          </div>

          {/* GitHub Profile Link (if provided) */}
          {(githubUrl || githubUsername) && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition cursor-pointer">
              <FaGithub className="text-sm" />
              <a
                href={formatGithubUrl(githubUrl, githubUsername)}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline font-semibold"
                onClick={(e) => e.stopPropagation()}
              >
                github.com/{githubUsername || "profile"}
              </a>
            </div>
          )}

          {/* ================= 3. FLOATING ACTION BUTTONS ================= */}
          <div className="flex items-center justify-center gap-8 pt-2 pb-1">
            {/* Pass / Nope Button */}
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              disabled={isSwiping || !isTop}
              onClick={() => executeSwipe("left", "ignored")}
              className="w-14 h-14 rounded-full border-2 border-rose-500/50 bg-rose-500/10 text-rose-500 flex items-center justify-center text-2xl shadow-lg shadow-rose-500/15 hover:bg-rose-500 hover:text-white transition-all disabled:opacity-50"
              title="Pass / Ignore (Left Arrow)"
            >
              <FaXmark />
            </motion.button>

            {/* Connect / Like Button */}
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              disabled={isSwiping || !isTop}
              onClick={() => executeSwipe("right", "interested")}
              className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-black flex items-center justify-center text-2xl shadow-xl shadow-emerald-500/30 hover:from-emerald-400 hover:to-teal-300 transition-all disabled:opacity-50"
              title="Connect / Match (Right Arrow)"
            >
              <FaHeart />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserCard;
