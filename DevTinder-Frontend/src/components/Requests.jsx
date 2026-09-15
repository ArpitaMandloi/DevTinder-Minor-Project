import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addRequests, removeRequest } from "../utils/requestSlice";
import { addSingleConnection } from "../utils/connectionSlice";
import { motion, AnimatePresence } from "framer-motion";
import { useOutletContext, Link } from "react-router-dom";
import { FaCheck, FaXmark } from "react-icons/fa6";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.requests);
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState(null);
  const [feedbackToast, setFeedbackToast] = useState(null);
  const { isDarkMode } = useOutletContext();

  const showToast = (message, type = "success") => {
    setFeedbackToast({ message, type });
    setTimeout(() => {
      setFeedbackToast(null);
    }, 3500);
  };

  const reviewRequest = async (status, request) => {
    const requestId = request._id;
    const fromUser = request.fromUserId;
    const devName = fromUser?.firstName || "Developer";

    try {
      setReviewingId(requestId);
      await axios.post(
        `${BASE_URL}/request/review/${status}/${requestId}`,
        {},
        {
          withCredentials: true,
        }
      );

      // Remove request from Redux
      dispatch(removeRequest(requestId));

      if (status === "accepted") {
        if (fromUser) {
          dispatch(addSingleConnection(fromUser));
        }
        showToast(`Connected with ${devName}! 🎉`, "success");
      } else {
        showToast(`Request from ${devName} declined.`, "info");
      }
    } catch (err) {
      console.error("Review request error:", err);
      showToast(
        err.response?.data?.message || "Failed to process connection request.",
        "error"
      );
    } finally {
      setReviewingId(null);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/requests/received`, {
        withCredentials: true,
      });

      dispatch(addRequests(res.data.data));
    } catch (err) {
      console.error("Fetch requests error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <span className="loading loading-ring loading-lg text-cyan-500"></span>
      </div>
    );
  }

  const requestList = Array.isArray(requests) ? requests : [];

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 relative z-10">
      {/* Action Toast */}
      <AnimatePresence>
        {feedbackToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl shadow-2xl border backdrop-blur-xl flex items-center gap-3 ${
              feedbackToast.type === "success"
                ? isDarkMode
                  ? "bg-emerald-950/90 border-emerald-500/40 text-emerald-200"
                  : "bg-emerald-50 border-emerald-300 text-emerald-900"
                : feedbackToast.type === "error"
                ? isDarkMode
                  ? "bg-rose-950/90 border-rose-500/40 text-rose-200"
                  : "bg-rose-50 border-rose-300 text-rose-900"
                : isDarkMode
                ? "bg-slate-900/90 border-slate-700 text-slate-200"
                : "bg-slate-100 border-slate-300 text-slate-800"
            }`}
          >
            <span className="text-sm font-bold">{feedbackToast.message}</span>
            <button
              onClick={() => setFeedbackToast(null)}
              className="text-gray-400 hover:text-white text-xs"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <div className="text-center mb-12">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-4xl md:text-5xl font-black ${
            isDarkMode ? "text-white" : "text-slate-900"
          }`}
        >
          Connection <span className="text-cyan-500">Requests</span>
        </motion.h1>
        <p
          className={`mt-2.5 font-medium text-sm ${
            isDarkMode ? "text-gray-400" : "text-slate-500"
          }`}
        >
          {requestList.length > 0
            ? `You have ${requestList.length} developer(s) waiting to connect with you.`
            : "Review pending invitations from developers who want to collaborate."}
        </p>
      </div>

      {/* Empty State */}
      {requestList.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center min-h-[40vh] text-center px-6"
        >
          <div className="w-20 h-20 rounded-3xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-4xl mb-6 shadow-inner">
            🔔
          </div>
          <h2
            className={`text-3xl font-black mb-2 ${
              isDarkMode ? "text-white" : "text-slate-900"
            }`}
          >
            No Pending <span className="text-cyan-500">Requests</span>
          </h2>
          <p
            className={`text-sm max-w-md ${
              isDarkMode ? "text-gray-400" : "text-slate-600"
            }`}
          >
            You're all caught up! Explore developers in the discovery feed to
            find new collaborators.
          </p>
          <Link
            to="/feed"
            className="mt-6 px-7 py-3 rounded-2xl font-bold bg-cyan-500 text-black hover:bg-cyan-400 transition shadow-lg shadow-cyan-500/20"
          >
            Explore Feed →
          </Link>
        </motion.div>
      )}

      {/* Requests List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence>
          {requestList.map((request, index) => {
            const user = request.fromUserId;
            if (!user) return null;
            const isProcessing = reviewingId === request._id;

            return (
              <motion.div
                key={request._id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{
                  opacity: 0,
                  scale: 0.8,
                  transition: { duration: 0.25 },
                }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                whileHover={{ y: -4 }}
                className={`relative flex flex-col sm:flex-row items-center sm:items-start gap-5 p-6 rounded-3xl border backdrop-blur-xl shadow-xl transition-all duration-300 ${
                  isDarkMode
                    ? "bg-[#111622]/80 border-slate-800 hover:border-cyan-500/30"
                    : "bg-white/90 border-slate-200 hover:border-indigo-500/30"
                }`}
              >
                {/* Profile Image */}
                <div className="relative shrink-0">
                  <div
                    className={`w-24 h-24 rounded-full p-1 border-2 overflow-hidden ${
                      isDarkMode ? "border-slate-700" : "border-slate-200"
                    }`}
                  >
                    <img
                      src={
                        user.photoUrl ||
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
                      }
                      alt={user.firstName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                </div>

                {/* User Info */}
                <div className="flex-1 text-center sm:text-left w-full">
                  <h2
                    className={`text-xl font-black ${
                      isDarkMode ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {user.firstName} {user.lastName}
                  </h2>

                  <p
                    className={`text-xs font-semibold mt-0.5 ${
                      isDarkMode ? "text-cyan-400" : "text-indigo-600"
                    }`}
                  >
                    {user.headline || "Full Stack Developer"}
                  </p>

                  <p
                    className={`mt-2 text-xs line-clamp-2 leading-relaxed ${
                      isDarkMode ? "text-gray-300" : "text-slate-600"
                    }`}
                  >
                    {user.about ||
                      "Interested in collaborating on exciting new projects."}
                  </p>

                  {/* Skills Chips */}
                  {user.skills?.length > 0 && (
                    <div className="flex flex-wrap justify-center sm:justify-start gap-1 mt-3">
                      {user.skills.slice(0, 3).map((skill, i) => (
                        <span
                          key={i}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${
                            isDarkMode
                              ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
                              : "bg-indigo-50 border-indigo-200 text-indigo-700"
                          }`}
                        >
                          {skill}
                        </span>
                      ))}
                      {user.skills.length > 3 && (
                        <span
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                            isDarkMode
                              ? "bg-slate-800 text-slate-400"
                              : "bg-slate-200 text-slate-500"
                          }`}
                        >
                          +{user.skills.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Buttons (Accept / Reject) */}
                <div className="flex flex-row sm:flex-col gap-2.5 w-full sm:w-auto mt-4 sm:mt-0 shrink-0 justify-center">
                  <button
                    disabled={isProcessing}
                    onClick={() => reviewRequest("accepted", request)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md ${
                      isProcessing
                        ? "opacity-50 cursor-not-allowed"
                        : isDarkMode
                        ? "bg-emerald-500 text-black hover:bg-emerald-400 shadow-emerald-500/20"
                        : "bg-emerald-600 text-white hover:bg-emerald-700"
                    }`}
                  >
                    {isProcessing ? (
                      <span className="loading loading-spinner loading-xs"></span>
                    ) : (
                      <>
                        <FaCheck /> Accept
                      </>
                    )}
                  </button>

                  <button
                    disabled={isProcessing}
                    onClick={() => reviewRequest("rejected", request)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
                      isProcessing
                        ? "opacity-50 cursor-not-allowed"
                        : isDarkMode
                        ? "border-rose-500/50 text-rose-400 hover:bg-rose-500 hover:text-white"
                        : "border-rose-500/50 text-rose-600 hover:bg-rose-500 hover:text-white"
                    }`}
                  >
                    <FaXmark /> Reject
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Requests;
