import { useEffect, useState, useCallback } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { FaArrowUp } from "react-icons/fa6";

import Navbar from "./Navbar";
import DynamicBackground from "./DynamicBackground";
import Footer from "./Footer";

import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";
import { addRequests } from "../utils/requestSlice";
import { addConnections } from "../utils/connectionSlice";

const Body = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const userData = useSelector((store) => store.user);

  // ==========================
  // Fetch Logged In User
  // ==========================
  const fetchUser = useCallback(async () => {
    // Avoid redundant calls if on login/signup or user already loaded
    if (["/login", "/signup"].includes(location.pathname)) {
      return;
    }

    if (userData) return;

    try {
      const res = await axios.get(`${BASE_URL}/profile/view`, {
        withCredentials: true,
      });

      const user = res.data.data || res.data;
      dispatch(addUser(user));
    } catch (err) {
      const publicRoutes = ["/", "/login", "/signup"];
      if (!publicRoutes.includes(location.pathname)) {
        navigate("/login", { replace: true });
      }
    }
  }, [dispatch, navigate, userData, location.pathname]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // ==========================
  // Load Initial Requests & Connections
  // ==========================
  useEffect(() => {
    if (!userData?._id) return;

    const loadInitialData = async () => {
      try {
        const [requestsRes, connRes] = await Promise.allSettled([
          axios.get(`${BASE_URL}/user/requests/received`, {
            withCredentials: true,
          }),
          axios
            .get(`${BASE_URL}/user/connection`, { withCredentials: true })
            .catch(() =>
              axios.get(`${BASE_URL}/user/connections`, {
                withCredentials: true,
              })
            ),
        ]);

        if (requestsRes.status === "fulfilled" && requestsRes.value.data?.data) {
          dispatch(addRequests(requestsRes.value.data.data));
        }
        if (connRes.status === "fulfilled" && connRes.value.data?.data) {
          dispatch(addConnections(connRes.value.data.data));
        }
      } catch (e) {
        console.error("Initial data load error:", e);
      }
    };

    loadInitialData();
  }, [userData?._id, dispatch]);

  // ==========================
  // Scroll To Top Button
  // ==========================
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div
      className={`min-h-screen flex flex-col relative overflow-x-hidden ${
        isDarkMode ? "dark" : ""
      }`}
    >
      {/* Background */}
      <DynamicBackground isDarkMode={isDarkMode} />

      {/* Top Loading Bar */}
      <motion.div
        key={location.pathname}
        initial={{ width: "0%", opacity: 1 }}
        animate={{ width: "100%", opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="fixed top-0 left-0 h-[3px] bg-cyan-500 z-[100]"
      />

      {/* Navbar */}
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

      {/* Main Content */}
      <main className="flex-1 pt-24 pb-12 px-4 md:px-6 max-w-7xl mx-auto w-full relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet
              context={{
                isDarkMode,
              }}
            />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Scroll To Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
            onClick={scrollToTop}
            className={`fixed bottom-8 right-8 p-3.5 rounded-full border backdrop-blur-md shadow-xl z-50 transition-all duration-300 ${
              isDarkMode
                ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500 hover:text-black"
                : "bg-white/80 border-slate-300 text-slate-800 hover:bg-indigo-600 hover:text-white"
            }`}
          >
            <FaArrowUp className="text-base" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Footer */}
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
};

export default Body;
