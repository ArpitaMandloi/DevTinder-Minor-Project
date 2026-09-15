import React from "react";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";

const Footer = ({ isDarkMode }) => {
  return (
    <footer
      id="contact"
      className={`pt-16 pb-8 px-6 border-t transition-colors duration-500 ${
        isDarkMode
          ? "border-slate-800 bg-[#070a13]"
          : "border-slate-200 bg-white/70"
      }`}
    >
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <h2 className="text-3xl font-black">
            <span className={isDarkMode ? "text-white" : "text-slate-900"}>
              Dev
            </span>
            <span className="text-cyan-500">Tinder</span>
          </h2>
          <p
            className={`mt-4 text-sm leading-relaxed ${
              isDarkMode ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Connect with passionate developers, collaborate on innovative
            projects, and build your developer dream network.
          </p>
        </div>

        {/* Product */}
        <div>
          <h3
            className={`font-bold text-base mb-4 ${
              isDarkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Product
          </h3>
          <ul
            className={`space-y-2.5 text-sm ${
              isDarkMode ? "text-slate-400" : "text-slate-600"
            }`}
          >
            <li>
              <a href="#features" className="hover:text-cyan-400 transition">
                Features
              </a>
            </li>
            <li>
              <a href="#how-it-works" className="hover:text-cyan-400 transition">
                How It Works
              </a>
            </li>
            <li>
              <a href="#community" className="hover:text-cyan-400 transition">
                Community
              </a>
            </li>
          </ul>
        </div>

        {/* Developer Stack */}
        <div>
          <h3
            className={`font-bold text-base mb-4 ${
              isDarkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Built With MERN
          </h3>
          <ul
            className={`space-y-2.5 text-sm ${
              isDarkMode ? "text-slate-400" : "text-slate-600"
            }`}
          >
            <li>React 19 & Redux Toolkit</li>
            <li>Tailwind CSS & DaisyUI</li>
            <li>Express & Node.js</li>
            <li>MongoDB & Mongoose</li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3
            className={`font-bold text-base mb-4 ${
              isDarkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Follow Us
          </h3>
          <div className="flex gap-3">
            <motion.a
              whileHover={{ y: -4, scale: 1.1 }}
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all ${
                isDarkMode
                  ? "bg-slate-800 text-white hover:bg-cyan-500 hover:text-black"
                  : "bg-slate-900 text-white hover:bg-indigo-600"
              }`}
            >
              <FaGithub />
            </motion.a>

            <motion.a
              whileHover={{ y: -4, scale: 1.1 }}
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-600 text-white text-lg hover:bg-blue-700 transition-all"
            >
              <FaLinkedinIn />
            </motion.a>

            <motion.a
              whileHover={{ y: -4, scale: 1.1 }}
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all ${
                isDarkMode
                  ? "bg-slate-800 text-white hover:bg-sky-500"
                  : "bg-sky-500 text-white hover:bg-sky-600"
              }`}
            >
              <FaXTwitter />
            </motion.a>
          </div>
        </div>
      </div>

      <div
        className={`mt-12 pt-6 border-t text-center text-xs ${
          isDarkMode
            ? "border-slate-800/80 text-slate-500"
            : "border-slate-200 text-slate-500"
        }`}
      >
        © {new Date().getFullYear()} DevTinder Minor Project. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
