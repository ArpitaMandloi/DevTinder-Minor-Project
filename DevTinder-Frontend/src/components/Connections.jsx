import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  BASE_URL,
  formatExternalUrl,
  formatGithubUrl,
  formatLinkedinUrl,
  formatTwitterUrl,
} from "../utils/constants";
import { addConnections } from "../utils/connectionSlice";
import { motion } from "framer-motion";
import {
  FaLocationDot,
  FaGithub,
  FaLinkedin,
  FaXTwitter,
  FaGlobe,
} from "react-icons/fa6";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isDarkMode } = useOutletContext();
  const [loading, setLoading] = useState(true);

  const fetchConnections = async () => {
    try {
      let res;
      try {
        res = await axios.get(`${BASE_URL}/user/connection`, {
          withCredentials: true,
        });
      } catch {
        res = await axios.get(`${BASE_URL}/user/connections`, {
          withCredentials: true,
        });
      }
      dispatch(addConnections(res.data.data));
    } catch (err) {
      console.error("Error fetching connections:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <span className="loading loading-ring loading-lg text-cyan-500"></span>
      </div>
    );
  }

  const connectionList = Array.isArray(connections)
    ? connections.filter(Boolean)
    : [];

  // Empty State
  if (connectionList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
        <div className="w-20 h-20 rounded-3xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-4xl mb-6 shadow-inner">
          🤝
        </div>
        <h1
          className={`text-4xl md:text-5xl font-black mb-4 ${
            isDarkMode ? "text-white" : "text-slate-900"
          }`}
        >
          No <span className="text-cyan-500">Connections</span> Yet
        </h1>
        <p
          className={`text-base max-w-md ${
            isDarkMode ? "text-gray-400" : "text-slate-600"
          }`}
        >
          Start exploring developers in the feed to build your network and connect
          with like-minded builders.
        </p>
        <button
          onClick={() => navigate("/feed")}
          className="mt-6 px-8 py-3.5 rounded-2xl font-bold bg-cyan-500 text-black hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/30"
        >
          Explore Developer Feed →
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 relative z-10">
      {/* Page Header */}
      <div className="text-center mb-12">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-4xl md:text-5xl font-black ${
            isDarkMode ? "text-white" : "text-slate-900"
          }`}
        >
          My <span className="text-cyan-500">Connections</span>
        </motion.h1>
        <p
          className={`mt-2.5 font-medium text-sm ${
            isDarkMode ? "text-gray-400" : "text-slate-500"
          }`}
        >
          You are connected with {connectionList.length} brilliant developer(s).
        </p>
      </div>

      {/* Connections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {connectionList.map((connection, index) => {
          return (
            <motion.div
              key={connection._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              whileHover={{ y: -4 }}
              className={`relative flex flex-col sm:flex-row items-center sm:items-start gap-5 p-6 rounded-3xl border backdrop-blur-xl shadow-xl transition-all duration-300 ${
                isDarkMode
                  ? "bg-[#111622]/80 border-slate-800 hover:border-cyan-500/30"
                  : "bg-white/90 border-slate-200 hover:border-indigo-500/30"
              }`}
            >
              {/* Top Right "Connected" Badge */}
              <div
                className={`absolute top-4 right-4 flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                  isDarkMode
                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                    : "bg-indigo-50 text-indigo-700 border border-indigo-200"
                }`}
              >
                🤝 Connected
              </div>

              {/* Profile Image */}
              <div className="relative shrink-0">
                <div
                  className={`w-24 h-24 rounded-full p-1 border-2 overflow-hidden ${
                    isDarkMode ? "border-slate-700" : "border-slate-200"
                  }`}
                >
                  <img
                    src={
                      connection.photoUrl ||
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200"
                    }
                    alt={connection.firstName}
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
                  {connection.firstName} {connection.lastName}
                </h2>

                <p
                  className={`text-xs font-semibold mt-0.5 ${
                    isDarkMode ? "text-cyan-400" : "text-indigo-600"
                  }`}
                >
                  {connection.headline || "Developer"}
                </p>

                {connection.location && (
                  <p className="text-[11px] text-slate-400 flex items-center justify-center sm:justify-start gap-1 mt-1">
                    <FaLocationDot className="text-rose-400 text-[10px]" />
                    {connection.location}
                  </p>
                )}

                <p
                  className={`mt-2 text-xs line-clamp-2 leading-relaxed ${
                    isDarkMode ? "text-gray-300" : "text-slate-600"
                  }`}
                >
                  {connection.about ||
                    "Passionate about building great software and connecting with fellow developers."}
                </p>

                {/* Skills Chips */}
                {connection.skills?.length > 0 && (
                  <div className="flex flex-wrap justify-center sm:justify-start gap-1 mt-3">
                    {connection.skills.slice(0, 4).map((skill, i) => (
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
                    {connection.skills.length > 4 && (
                      <span
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                          isDarkMode
                            ? "bg-slate-800 text-slate-400"
                            : "bg-slate-200 text-slate-500"
                        }`}
                      >
                        +{connection.skills.length - 4}
                      </span>
                    )}
                  </div>
                )}

                {/* Social Links */}
                <div className="mt-3.5 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  {(connection.githubUrl || connection.githubUsername) && (
                    <a
                      href={formatGithubUrl(
                        connection.githubUrl,
                        connection.githubUsername
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition ${
                        isDarkMode
                          ? "bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/40"
                          : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      <FaGithub className="text-xs" /> GitHub
                    </a>
                  )}

                  {connection.linkedinUrl && (
                    <a
                      href={formatLinkedinUrl(connection.linkedinUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition ${
                        isDarkMode
                          ? "bg-blue-950/40 border-blue-500/30 text-blue-400 hover:text-white hover:bg-blue-600/30"
                          : "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                      }`}
                    >
                      <FaLinkedin className="text-xs" /> LinkedIn
                    </a>
                  )}

                  {connection.twitterUrl && (
                    <a
                      href={formatTwitterUrl(connection.twitterUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition ${
                        isDarkMode
                          ? "bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/40"
                          : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      <FaXTwitter className="text-xs" /> Twitter
                    </a>
                  )}

                  {connection.portfolioUrl && (
                    <a
                      href={formatExternalUrl(connection.portfolioUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition ${
                        isDarkMode
                          ? "bg-cyan-950/40 border-cyan-500/30 text-cyan-400 hover:text-white hover:bg-cyan-600/30"
                          : "bg-cyan-50 border-cyan-200 text-cyan-700 hover:bg-cyan-100"
                      }`}
                    >
                      <FaGlobe className="text-xs" /> Portfolio
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Connections;
