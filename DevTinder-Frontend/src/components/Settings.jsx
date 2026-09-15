import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useOutletContext, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { FaTrashCan } from "react-icons/fa6";

const Settings = () => {
  const { isDarkMode } = useOutletContext();
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setStatusMessage({ type: "", text: "" });

    if (!currentPassword || !newPassword || !confirmPassword) {
      setStatusMessage({
        type: "error",
        text: "Please fill in all password fields.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatusMessage({
        type: "error",
        text: "New passwords do not match.",
      });
      return;
    }

    if (newPassword.length < 8) {
      setStatusMessage({
        type: "error",
        text: "New password must be at least 8 characters long.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.patch(
        `${BASE_URL}/profile/password`,
        { currentPassword, newPassword },
        { withCredentials: true }
      );

      setStatusMessage({
        type: "success",
        text: res.data.message || "Password updated successfully!",
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setStatusMessage({
        type: "error",
        text:
          err.response?.data?.message ||
          err.message ||
          "Failed to update password.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/logout`, {}, { withCredentials: true });
      dispatch(removeUser());
      navigate("/login");
    } catch (err) {
      console.error(err);
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

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 relative z-10">
      <div className="mb-10 text-center md:text-left">
        <h1
          className={`text-4xl font-black ${
            isDarkMode ? "text-white" : "text-slate-900"
          }`}
        >
          Account <span className="text-cyan-500">Settings</span> ⚙️
        </h1>
        <p
          className={`mt-2 text-sm ${
            isDarkMode ? "text-slate-400" : "text-slate-600"
          }`}
        >
          Manage your credentials, password security, and account preferences.
        </p>
      </div>

      <div className="space-y-8">
        {/* ================= 1. ACCOUNT OVERVIEW ================= */}
        <div
          className={`p-6 sm:p-8 rounded-3xl border shadow-xl backdrop-blur-xl ${
            isDarkMode
              ? "bg-[#111624]/80 border-slate-800"
              : "bg-white/80 border-slate-200"
          }`}
        >
          <h2
            className={`text-xl font-bold mb-6 ${
              isDarkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Account Overview
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <span
                className={`text-xs font-bold uppercase tracking-wider ${
                  isDarkMode ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Full Name
              </span>
              <p
                className={`text-base font-semibold mt-1 ${
                  isDarkMode ? "text-white" : "text-slate-900"
                }`}
              >
                {user.firstName} {user.lastName}
              </p>
            </div>

            <div>
              <span
                className={`text-xs font-bold uppercase tracking-wider ${
                  isDarkMode ? "text-slate-400" : "text-slate-500"
                }`}
              >
                Email Address
              </span>
              <p
                className={`text-base font-semibold mt-1 ${
                  isDarkMode ? "text-cyan-400" : "text-indigo-600"
                }`}
              >
                {user.emailId}
              </p>
            </div>
          </div>
        </div>

        {/* ================= 2. CHANGE PASSWORD ================= */}
        <div
          className={`p-6 sm:p-8 rounded-3xl border shadow-xl backdrop-blur-xl ${
            isDarkMode
              ? "bg-[#111624]/80 border-slate-800"
              : "bg-white/80 border-slate-200"
          }`}
        >
          <h2
            className={`text-xl font-bold mb-6 ${
              isDarkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Security & Password
          </h2>

          <AnimatePresence>
            {statusMessage.text && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`p-4 rounded-xl text-sm font-semibold mb-6 ${
                  statusMessage.type === "error"
                    ? "bg-red-500/15 border border-red-500/30 text-red-400"
                    : "bg-green-500/15 border border-green-500/30 text-green-400"
                }`}
              >
                {statusMessage.type === "error" ? "⚠️ " : "✅ "}
                {statusMessage.text}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handlePasswordChange} className="space-y-4 max-w-lg">
            <div>
              <label
                className={`block text-xs font-bold uppercase mb-1.5 ${
                  isDarkMode ? "text-slate-400" : "text-slate-700"
                }`}
              >
                Current Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className={`w-full px-4 py-2.5 rounded-xl border outline-none text-sm transition-all ${
                  isDarkMode
                    ? "bg-[#141a29] border-slate-700 text-white focus:border-cyan-500"
                    : "bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-500"
                }`}
              />
            </div>

            <div>
              <label
                className={`block text-xs font-bold uppercase mb-1.5 ${
                  isDarkMode ? "text-slate-400" : "text-slate-700"
                }`}
              >
                New Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 8 chars)"
                className={`w-full px-4 py-2.5 rounded-xl border outline-none text-sm transition-all ${
                  isDarkMode
                    ? "bg-[#141a29] border-slate-700 text-white focus:border-cyan-500"
                    : "bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-500"
                }`}
              />
            </div>

            <div>
              <label
                className={`block text-xs font-bold uppercase mb-1.5 ${
                  isDarkMode ? "text-slate-400" : "text-slate-700"
                }`}
              >
                Confirm New Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className={`w-full px-4 py-2.5 rounded-xl border outline-none text-sm transition-all ${
                  isDarkMode
                    ? "bg-[#141a29] border-slate-700 text-white focus:border-cyan-500"
                    : "bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-500"
                }`}
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs select-none">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                  className="checkbox checkbox-xs checkbox-primary"
                />
                <span
                  className={isDarkMode ? "text-slate-400" : "text-slate-600"}
                >
                  Show Passwords
                </span>
              </label>

              <button
                type="submit"
                disabled={isLoading}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                  isLoading
                    ? "bg-cyan-500/50 cursor-not-allowed text-black"
                    : isDarkMode
                    ? "bg-cyan-500 text-black hover:bg-cyan-400 shadow-cyan-500/20"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                {isLoading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        </div>

        {/* ================= 3. DANGER ZONE ================= */}
        <div
          className={`p-6 sm:p-8 rounded-3xl border border-red-500/30 shadow-xl backdrop-blur-xl ${
            isDarkMode ? "bg-red-950/10" : "bg-red-50/50"
          }`}
        >
          <h2 className="text-xl font-bold text-red-500 mb-2">Danger Zone</h2>
          <p
            className={`text-sm mb-6 ${
              isDarkMode ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Manage your session or permanently delete your account and its data.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleLogout}
              className="px-6 py-2.5 rounded-xl font-bold text-sm border border-slate-700 hover:bg-slate-800 transition"
            >
              Logout From Current Device
            </button>

            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="px-6 py-2.5 rounded-xl font-bold text-sm bg-red-500 text-white hover:bg-red-600 transition shadow-md flex items-center gap-2"
            >
              <FaTrashCan /> Delete Account
            </button>
          </div>
        </div>
      </div>

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

export default Settings;
