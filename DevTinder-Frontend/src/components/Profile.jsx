import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  FaGithub,
  FaLinkedin,
  FaGlobe,
  FaCheck,
  FaUserPen,
  FaLocationDot,
  FaCalendarDays,
  FaBriefcase,
  FaVenusMars,
  FaCakeCandles,
  FaHandshake,
  FaEnvelopeOpenText,
  FaHeart,
  FaTrashCan,
  FaXTwitter,
} from "react-icons/fa6";
import {
  BASE_URL,
  formatExternalUrl,
  formatGithubUrl,
  formatLinkedinUrl,
  formatTwitterUrl,
} from "../utils/constants";
import { addConnections } from "../utils/connectionSlice";
import { addRequests } from "../utils/requestSlice";
import { removeUser } from "../utils/userSlice";
import EditProfile from "./EditProfile";

const Profile = () => {
  const user = useSelector((store) => store.user);
  const connectionsFromStore = useSelector((store) => store.connections);
  const requestsFromStore = useSelector((store) => store.requests);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isDarkMode } = useOutletContext();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const [stats, setStats] = useState({
    connections: Array.isArray(connectionsFromStore)
      ? connectionsFromStore.length
      : 0,
    requests: Array.isArray(requestsFromStore) ? requestsFromStore.length : 0,
    sentRequests: 0,
  });

  useEffect(() => {
    const fetchStatsAndCounts = async () => {
      try {
        const [statsRes, connRes, reqRes] = await Promise.allSettled([
          axios.get(`${BASE_URL}/user/stats`, { withCredentials: true }),
          axios
            .get(`${BASE_URL}/user/connection`, { withCredentials: true })
            .catch(() =>
              axios.get(`${BASE_URL}/user/connections`, {
                withCredentials: true,
              })
            ),
          axios.get(`${BASE_URL}/user/requests/received`, {
            withCredentials: true,
          }),
        ]);

        let connCount = Array.isArray(connectionsFromStore)
          ? connectionsFromStore.length
          : 0;
        let reqCount = Array.isArray(requestsFromStore)
          ? requestsFromStore.length
          : 0;
        let sentRequestsCount = 0;

        if (statsRes.status === "fulfilled" && statsRes.value.data?.data) {
          const s = statsRes.value.data.data;
          if (s.connections !== undefined) connCount = s.connections;
          if (s.requests !== undefined) reqCount = s.requests;
          if (s.sentRequests !== undefined) sentRequestsCount = s.sentRequests;
        }

        if (connRes.status === "fulfilled" && connRes.value.data?.data) {
          const conns = Array.isArray(connRes.value.data.data)
            ? connRes.value.data.data
            : [];
          dispatch(addConnections(conns));
          connCount = conns.length;
        }

        if (reqRes.status === "fulfilled" && reqRes.value.data?.data) {
          const reqs = Array.isArray(reqRes.value.data.data)
            ? reqRes.value.data.data
            : [];
          dispatch(addRequests(reqs));
          reqCount = reqs.length;
        }

        setStats({
          connections: connCount,
          requests: reqCount,
          sentRequests: sentRequestsCount,
        });
      } catch (err) {
        console.error("Error updating profile stats:", err);
      }
    };

    if (user) {
      fetchStatsAndCounts();
    }
  }, [user, dispatch]);

  const handleModalClose = async (wasUpdated) => {
    setIsEditModalOpen(false);
    if (wasUpdated) {
      try {
        const res = await axios.get(`${BASE_URL}/profile/view`, {
          withCredentials: true,
        });
        if (res.data?.data) {
          dispatch(addUser(res.data.data));
        }
      } catch (err) {
        console.error("Error refreshing profile after update:", err);
      }
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3500);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      await axios.delete(`${BASE_URL}/profile`, {
        withCredentials: true,
      });

      dispatch(removeUser());
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Delete account error:", err);
      alert(err.response?.data?.message || "Failed to delete account.");
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  if (!user) return null;

  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "Recently";

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 relative z-10">
      {/* Success Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.9 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-black px-6 py-3 rounded-2xl font-black shadow-2xl flex items-center gap-2 text-sm"
          >
            <FaCheck /> Profile Updated Successfully!
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= 1. HERO DEVELOPER PROFILE CARD ================= */}
      <div
        className={`relative rounded-3xl border overflow-hidden shadow-2xl backdrop-blur-xl ${
          isDarkMode
            ? "bg-[#0c101b]/85 border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            : "bg-white/90 border-slate-200 shadow-xl"
        }`}
      >
        {/* Banner Backdrop */}
        <div
          className={`h-40 md:h-48 relative overflow-hidden ${
            isDarkMode
              ? "bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900"
              : "bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500"
          }`}
        >
          <div className="absolute -top-12 -left-12 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Pattern Overlay */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
        </div>

        {/* Profile Details Container */}
        <div className="px-6 md:px-10 pb-8 relative">
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 -mt-16 md:-mt-20 mb-6">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div
                className={`w-32 h-32 md:w-36 md:h-36 rounded-3xl border-4 overflow-hidden shadow-2xl p-1 ${
                  isDarkMode
                    ? "bg-[#0c101b] border-slate-700/80"
                    : "bg-white border-white"
                }`}
              >
                <img
                  src={
                    user.photoUrl ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300"
                  }
                  alt={user.firstName}
                  className="w-full h-full rounded-2xl object-cover"
                />
              </div>
            </div>

            {/* Action Buttons: Edit & Delete */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-center">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setIsEditModalOpen(true)}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md ${
                  isDarkMode
                    ? "bg-cyan-500 text-black hover:bg-cyan-400 shadow-cyan-500/20"
                    : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/20"
                }`}
              >
                <FaUserPen /> Edit Profile
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setIsDeleteModalOpen(true)}
                className="px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500 hover:text-white transition-all shadow-md"
              >
                <FaTrashCan /> Delete Account
              </motion.button>
            </div>
          </div>

          {/* Name & Headline */}
          <div className="text-center md:text-left">
            <h1
              className={`text-3xl md:text-4xl font-black tracking-tight ${
                isDarkMode ? "text-white" : "text-slate-900"
              }`}
            >
              {user.firstName} {user.lastName}
            </h1>

            <p className="text-sm md:text-base font-semibold text-cyan-400 mt-1">
              {user.headline || "Full Stack Developer"}
            </p>

            {/* Tags: Location, Email, Member Since */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2 text-xs font-medium text-slate-400">
              {user.location && (
                <span className="flex items-center gap-1.5">
                  <FaLocationDot className="text-rose-400" /> {user.location}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <FaCalendarDays className="text-cyan-400" /> Joined {joinedDate}
              </span>
              <span>{user.emailId}</span>
            </div>

            {/* Social Links */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4">
              {(user.githubUrl || user.githubUsername) && (
                <a
                  href={formatGithubUrl(user.githubUrl, user.githubUsername)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-2 ${
                    isDarkMode
                      ? "bg-slate-900/80 border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/40"
                      : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <FaGithub className="text-sm" /> GitHub
                </a>
              )}
              {user.linkedinUrl && (
                <a
                  href={formatLinkedinUrl(user.linkedinUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-2 ${
                    isDarkMode
                      ? "bg-blue-950/40 border-blue-500/30 text-blue-400 hover:text-white hover:bg-blue-600/30"
                      : "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                  }`}
                >
                  <FaLinkedin className="text-sm" /> LinkedIn
                </a>
              )}
              {user.twitterUrl && (
                <a
                  href={formatTwitterUrl(user.twitterUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-2 ${
                    isDarkMode
                      ? "bg-slate-900/80 border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/40"
                      : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <FaXTwitter className="text-sm" /> Twitter / X
                </a>
              )}
              {user.portfolioUrl && (
                <a
                  href={formatExternalUrl(user.portfolioUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-2 ${
                    isDarkMode
                      ? "bg-cyan-950/40 border-cyan-500/30 text-cyan-400 hover:text-white hover:bg-cyan-600/30"
                      : "bg-cyan-50 border-cyan-200 text-cyan-700 hover:bg-cyan-100"
                  }`}
                >
                  <FaGlobe className="text-sm" /> Portfolio
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= 2. KPI ANALYTICS GRID ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        {[
          {
            label: "Connections",
            value: Array.isArray(connectionsFromStore)
              ? connectionsFromStore.length
              : stats.connections,
            icon: <FaHandshake className="text-cyan-400 text-xl" />,
            color: "text-cyan-400",
            bg: "bg-cyan-500/10 border-cyan-500/20",
            onClick: () => navigate("/connections"),
          },
          {
            label: "Received Requests",
            value: Array.isArray(requestsFromStore)
              ? requestsFromStore.length
              : stats.requests,
            icon: <FaEnvelopeOpenText className="text-purple-400 text-xl" />,
            color: "text-purple-400",
            bg: "bg-purple-500/10 border-purple-500/20",
            onClick: () => navigate("/requests"),
          },
          {
            label: "Sent Interests",
            value: stats.sentRequests,
            icon: <FaHeart className="text-rose-400 text-xl" />,
            color: "text-rose-400",
            bg: "bg-rose-500/10 border-rose-500/20",
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -3, scale: 1.01 }}
            onClick={item.onClick}
            className={`p-5 rounded-2xl border backdrop-blur-xl shadow-lg transition-all ${
              item.onClick ? "cursor-pointer" : ""
            } ${
              isDarkMode
                ? "bg-[#0d121f]/90 border-slate-800 hover:border-cyan-500/40"
                : "bg-white border-slate-200 hover:border-indigo-500/40"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`p-2.5 rounded-xl border ${item.bg}`}>
                {item.icon}
              </span>
              {item.onClick && (
                <span className="text-[11px] font-bold text-slate-400 hover:text-cyan-400 transition">
                  View →
                </span>
              )}
            </div>
            <h3 className={`text-3xl font-black mt-3 ${item.color}`}>
              {item.value}
            </h3>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">
              {item.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* ================= 3. ABOUT & SKILLS SECTIONS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* About Bio */}
        <div
          className={`lg:col-span-2 p-6 md:p-8 rounded-3xl border shadow-xl backdrop-blur-xl ${
            isDarkMode
              ? "bg-[#0c101b]/85 border-slate-800"
              : "bg-white border-slate-200"
          }`}
        >
          <h2
            className={`text-xl font-black mb-4 flex items-center gap-2 ${
              isDarkMode ? "text-white" : "text-slate-900"
            }`}
          >
            About Developer
          </h2>
          <p
            className={`text-sm md:text-base leading-relaxed ${
              isDarkMode ? "text-slate-300" : "text-slate-600"
            }`}
          >
            {user.about ||
              "No bio added yet. Click 'Edit Profile' to share your story, tech focus, and what projects you're interested in collaborating on."}
          </p>

          {/* Tech Stack Chips */}
          <div className="mt-6 pt-6 border-t border-inherit">
            <h3
              className={`text-xs font-black uppercase tracking-wider mb-3 ${
                isDarkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Technologies & Skills
            </h3>
            {user.skills && user.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill, i) => (
                  <span
                    key={i}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                      isDarkMode
                        ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20"
                        : "bg-indigo-50 border-indigo-200 text-indigo-700"
                    }`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs italic text-slate-500">
                No skills listed. Edit profile to add skills.
              </p>
            )}
          </div>
        </div>

        {/* Developer Attributes */}
        <div
          className={`p-6 md:p-8 rounded-3xl border shadow-xl backdrop-blur-xl flex flex-col justify-between ${
            isDarkMode
              ? "bg-[#0c101b]/85 border-slate-800"
              : "bg-white border-slate-200"
          }`}
        >
          <h2
            className={`text-xl font-black mb-6 ${
              isDarkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Profile Overview
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-inherit">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-2">
                <FaCakeCandles className="text-rose-400" /> Age
              </span>
              <span className="text-sm font-bold">
                {user.age ? `${user.age} Years` : "Not specified"}
              </span>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-inherit">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-2">
                <FaVenusMars className="text-cyan-400" /> Gender
              </span>
              <span className="text-sm font-bold capitalize">
                {user.gender || "Not specified"}
              </span>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-inherit">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-2">
                <FaBriefcase className="text-amber-400" /> Experience
              </span>
              <span className="text-sm font-bold">
                {user.yearsOfExperience
                  ? `${user.yearsOfExperience}+ Years`
                  : "Fresher / Learner"}
              </span>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-inherit">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition ${
                isDarkMode
                  ? "bg-slate-800 hover:bg-slate-700 text-slate-200"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-800"
              }`}
            >
              Update Information
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <EditProfile user={user} onClose={handleModalClose} />
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={`w-full max-w-md p-6 sm:p-8 rounded-3xl border shadow-2xl ${
                isDarkMode
                  ? "bg-[#0d111a] border-slate-800"
                  : "bg-white border-slate-200"
              }`}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-2xl flex items-center justify-center mx-auto mb-4">
                  <FaTrashCan />
                </div>
                <h3
                  className={`text-xl font-black ${
                    isDarkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  Delete Your Account?
                </h3>
                <p
                  className={`mt-2 text-sm leading-relaxed ${
                    isDarkMode ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Are you sure you want to permanently delete your DevTinder
                  account? All your profile information and connections will be
                  removed. This action cannot be undone.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm border transition ${
                    isDarkMode
                      ? "border-slate-700 text-slate-300 hover:bg-slate-800"
                      : "border-slate-300 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="flex-1 py-3 rounded-xl font-bold text-sm bg-red-500 hover:bg-red-600 text-white transition shadow-lg shadow-red-500/30"
                >
                  {isDeleting ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
