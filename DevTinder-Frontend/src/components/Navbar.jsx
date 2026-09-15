import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  FaBars,
  FaXmark,
  FaCompass,
  FaUserGroup,
  FaBell,
  FaUser,
  FaGear,
  FaRightFromBracket,
} from "react-icons/fa6";

import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";

const Navbar = ({ isDarkMode, setIsDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const user = useSelector((store) => store.user);
  const requests = useSelector((store) => store.requests);
  const pendingRequestsCount = Array.isArray(requests) ? requests.length : 0;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await axios.post(
        `${BASE_URL}/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      dispatch(removeUser());
      setIsOpen(false);
      setMobileMenuOpen(false);
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const isCurrent = (path) => location.pathname === path;

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.6,
        type: "spring",
        bounce: 0.3,
      }}
      className={`fixed top-0 left-0 w-full z-50 border-b backdrop-blur-2xl transition-all duration-500 ${
        isDarkMode
          ? "bg-[#05070d]/85 border-slate-800"
          : "bg-white/85 border-slate-200 shadow-sm"
      }`}
    >
      {/* Click Outside Overlay for Profile Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-transparent"
          />
        )}
      </AnimatePresence>

      <div className="relative z-50 max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div whileHover={{ scale: 1.03 }} className="cursor-pointer">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-1">
                <span className={isDarkMode ? "text-white" : "text-slate-900"}>
                  Dev
                </span>
                <span className="text-cyan-500">Tinder</span>
              </h1>
            </motion.div>
          </Link>

          {/* Center Navigation for Logged-In Users */}
          {user ? (
            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
              <Link
                to="/feed"
                className={`flex items-center gap-2 font-bold text-sm transition-colors py-1.5 px-3.5 rounded-xl ${
                  isCurrent("/feed")
                    ? "text-cyan-400 bg-cyan-500/10 border border-cyan-500/30"
                    : isDarkMode
                    ? "text-slate-300 hover:text-white"
                    : "text-slate-600 hover:text-indigo-600"
                }`}
              >
                <FaCompass className="text-base" />
                <span>Discover</span>
              </Link>

              <Link
                to="/connections"
                className={`flex items-center gap-2 font-bold text-sm transition-colors py-1.5 px-3.5 rounded-xl ${
                  isCurrent("/connections")
                    ? "text-cyan-400 bg-cyan-500/10 border border-cyan-500/30"
                    : isDarkMode
                    ? "text-slate-300 hover:text-white"
                    : "text-slate-600 hover:text-indigo-600"
                }`}
              >
                <FaUserGroup className="text-base" />
                <span>Connections</span>
              </Link>

              {/* Requests Button with Notification Dot */}
              <Link
                to="/requests"
                className={`relative flex items-center gap-2 font-bold text-sm transition-colors py-1.5 px-3.5 rounded-xl ${
                  isCurrent("/requests")
                    ? "text-cyan-400 bg-cyan-500/10 border border-cyan-500/30"
                    : isDarkMode
                    ? "text-slate-300 hover:text-white"
                    : "text-slate-600 hover:text-indigo-600"
                }`}
              >
                <div className="relative">
                  <FaBell className="text-base" />
                  {/* Glowing notification dot on requests button */}
                  {pendingRequestsCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping" />
                  )}
                  {pendingRequestsCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50" />
                  )}
                </div>
                <span>Requests</span>
                {pendingRequestsCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-black bg-cyan-500 text-black">
                    {pendingRequestsCount}
                  </span>
                )}
              </Link>
            </nav>
          ) : (
            /* Center Navigation for Visitors */
            <nav className="hidden lg:flex items-center gap-8">
              {[
                { name: "Features", href: "#features" },
                { name: "How It Works", href: "#how-it-works" },
                { name: "Community", href: "#community" },
                { name: "Contact", href: "#contact" },
              ].map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`font-semibold text-sm transition ${
                    isDarkMode
                      ? "text-slate-300 hover:text-cyan-400"
                      : "text-slate-700 hover:text-indigo-600"
                  }`}
                >
                  {item.name}
                </a>
              ))}
            </nav>
          )}

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <motion.button
              whileHover={{ scale: 1.15, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-xl text-xl transition-colors ${
                isDarkMode
                  ? "text-gray-400 hover:text-yellow-300"
                  : "text-slate-500 hover:text-indigo-600"
              }`}
              title="Toggle Theme"
            >
              {isDarkMode ? "☀️" : "🌙"}
            </motion.button>

            {user ? (
              <div className="flex items-center gap-3">
                <div className="relative">
                {/* Avatar Button */}
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsOpen(!isOpen)}
                  className={`relative w-10 h-10 rounded-full overflow-hidden border-2 ${
                    isDarkMode
                      ? "border-slate-700 hover:border-cyan-400"
                      : "border-slate-300 hover:border-indigo-500"
                  }`}
                >
                  <img
                    src={
                      user.photoUrl ||
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
                    }
                    alt={user.firstName}
                    className="w-full h-full object-cover"
                  />
                  {/* Indicator on avatar if pending requests */}
                  {pendingRequestsCount > 0 && (
                    <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-cyan-400 rounded-full border-2 border-slate-900" />
                  )}
                </motion.button>

                {/* Profile Dropdown Menu */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className={`absolute right-0 top-12 w-64 rounded-2xl overflow-hidden border shadow-2xl z-50 ${
                        isDarkMode
                          ? "bg-[#0d111a] border-slate-800 text-gray-200"
                          : "bg-white border-slate-200 text-slate-700"
                      }`}
                    >
                      <div className="p-4 border-b border-inherit">
                        <p className="font-bold text-sm truncate">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-cyan-500 truncate mt-0.5">
                          {user.emailId}
                        </p>
                      </div>

                      <ul className="p-2 text-sm font-medium">
                        <li>
                          <Link
                            to="/profile"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-cyan-500/10 hover:text-cyan-400 transition"
                          >
                            <FaUser className="text-xs" /> My Profile
                          </Link>
                        </li>

                        <li>
                          <Link
                            to="/connections"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-cyan-500/10 hover:text-cyan-400 transition"
                          >
                            <FaUserGroup className="text-xs" /> Connections
                          </Link>
                        </li>

                        <li>
                          <Link
                            to="/requests"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-cyan-500/10 hover:text-cyan-400 transition"
                          >
                            <span className="flex items-center gap-3">
                              <FaBell className="text-xs" /> Requests
                            </span>
                            {pendingRequestsCount > 0 && (
                              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-cyan-500 text-black">
                                {pendingRequestsCount}
                              </span>
                            )}
                          </Link>
                        </li>

                        <li>
                          <Link
                            to="/settings"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-cyan-500/10 hover:text-cyan-400 transition"
                          >
                            <FaGear className="text-xs" /> Settings
                          </Link>
                        </li>

                        <div
                          className={`my-1.5 h-px ${
                            isDarkMode ? "bg-slate-800" : "bg-slate-200"
                          }`}
                        />

                        <li>
                          <button
                            onClick={handleLogout}
                            className="w-full text-left flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition"
                          >
                            <FaRightFromBracket className="text-xs" /> Logout
                          </button>
                        </li>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
                </div>
              </div>
            ) : (
              /* Non-authenticated Auth Buttons */
              <div className="hidden sm:flex items-center gap-3">
                <Link to="/login">
                  <button
                    className={`px-5 py-2 rounded-xl text-sm font-bold border transition ${
                      isDarkMode
                        ? "border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                        : "border-slate-300 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    Login
                  </button>
                </Link>

                <Link to="/signup">
                  <button
                    className={`px-5 py-2 rounded-xl text-sm font-bold transition shadow-md ${
                      isDarkMode
                        ? "bg-cyan-500 text-black hover:bg-cyan-400"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                    }`}
                  >
                    Get Started
                  </button>
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? (
                <FaXmark className="text-xl" />
              ) : (
                <FaBars className="text-xl" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={`md:hidden border-b px-6 py-4 overflow-hidden ${
              isDarkMode
                ? "bg-[#090d16] border-slate-800"
                : "bg-white border-slate-200"
            }`}
          >
            {user ? (
              <div className="space-y-3 font-semibold text-sm">
                <Link
                  to="/feed"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 py-2"
                >
                  <FaCompass className="text-cyan-500" /> Discover Feed
                </Link>
                <Link
                  to="/connections"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 py-2"
                >
                  <FaUserGroup className="text-cyan-500" /> Connections
                </Link>
                <Link
                  to="/requests"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2"
                >
                  <span className="flex items-center gap-3">
                    <FaBell className="text-cyan-500" /> Requests
                  </span>
                  {pendingRequestsCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-cyan-500 text-black">
                      {pendingRequestsCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 py-2"
                >
                  <FaUser className="text-cyan-500" /> My Profile
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 py-2"
                >
                  <FaGear className="text-cyan-500" /> Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-3 py-2 text-red-400"
                >
                  <FaRightFromBracket /> Logout
                </button>
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-2.5 rounded-xl font-bold border border-slate-700 text-sm"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-2.5 rounded-xl font-bold bg-cyan-500 text-black text-sm"
                >
                  Get Started
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
