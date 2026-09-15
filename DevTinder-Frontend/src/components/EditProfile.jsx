import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  BASE_URL,
  formatExternalUrl,
  formatGithubUrl,
  formatLinkedinUrl,
  formatTwitterUrl,
} from "../utils/constants";
import { addUser } from "../utils/userSlice";
import { motion, AnimatePresence } from "framer-motion";
import { useOutletContext } from "react-router-dom";
import { FaLocationDot, FaCamera, FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";

const EditProfile = ({ user, onClose }) => {
  const { isDarkMode } = useOutletContext();
  const dispatch = useDispatch();

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl || "");
  const [age, setAge] = useState(user?.age || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [headline, setHeadline] = useState(user?.headline || "");
  const [location, setLocation] = useState(user?.location || "");
  const [yearsOfExperience, setYearsOfExperience] = useState(
    user?.yearsOfExperience || ""
  );
  const [githubUrl, setGithubUrl] = useState(
    user?.githubUrl || (user?.githubUsername ? `https://github.com/${user.githubUsername}` : "")
  );
  const [linkedinUrl, setLinkedinUrl] = useState(user?.linkedinUrl || "");
  const [twitterUrl, setTwitterUrl] = useState(user?.twitterUrl || "");
  const [portfolioUrl, setPortfolioUrl] = useState(user?.portfolioUrl || "");
  const [about, setAbout] = useState(user?.about || "");
  const [skills, setSkills] = useState(user?.skills || []);
  const [skillInput, setSkillInput] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // File picker handler for device media / photos with automatic client-side compression
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (PNG, JPG, JPEG, WEBP).");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setError("Selected photo must be smaller than 8MB.");
      return;
    }

    setError("");

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxDim = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.85);
        setPhotoUrl(compressedDataUrl);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const addSkillDirectly = (rawText) => {
    if (!rawText) return;
    const candidates = rawText
      .split(/[,+\n]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (candidates.length === 0) return;

    setSkills((prev) => {
      const updated = [...prev];
      candidates.forEach((cand) => {
        if (!updated.includes(cand)) {
          updated.push(cand);
        }
      });
      return updated;
    });
    setSkillInput("");
  };

  const handleAddSkill = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkillDirectly(skillInput);
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const saveProfile = async () => {
    try {
      setError("");

      // Compulsory fields check: GitHub URL and LinkedIn URL
      if (!githubUrl || !githubUrl.trim()) {
        setError("Please enter your GitHub Profile URL.");
        return;
      }

      if (!linkedinUrl || !linkedinUrl.trim()) {
        setError("Please enter your LinkedIn Profile URL.");
        return;
      }

      setIsLoading(true);

      // Auto-commit any remaining text in the skill input
      let finalSkills = [...skills];
      if (skillInput.trim()) {
        const candidates = skillInput
          .split(/[,+\n]/)
          .map((s) => s.trim())
          .filter((s) => s.length > 0);
        candidates.forEach((c) => {
          if (!finalSkills.includes(c)) finalSkills.push(c);
        });
        setSkills(finalSkills);
        setSkillInput("");
      }

      // Extract github username if full URL is given
      let extractedGithubUser = "";
      const ghMatch = githubUrl.trim().match(/github\.com\/([^/?#]+)/i);
      if (ghMatch && ghMatch[1]) {
        extractedGithubUser = ghMatch[1];
      } else if (!githubUrl.includes("/")) {
        extractedGithubUser = githubUrl.trim().replace(/^@/, "");
      }

      // Normalize into direct working profile URLs
      const normalizedGithub = formatGithubUrl(
        githubUrl.trim(),
        extractedGithubUser
      );
      const normalizedLinkedin = formatLinkedinUrl(linkedinUrl.trim());
      const normalizedTwitter = formatTwitterUrl(twitterUrl.trim());
      const normalizedPortfolio = portfolioUrl.trim()
        ? formatExternalUrl(portfolioUrl.trim())
        : "";

      const payload = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        photoUrl: photoUrl || undefined,
        age: age ? Number(age) : undefined,
        gender: gender || undefined,
        headline: headline.trim(),
        location: location.trim(),
        yearsOfExperience: yearsOfExperience
          ? Number(yearsOfExperience)
          : undefined,
        githubUsername: extractedGithubUser || undefined,
        githubUrl: normalizedGithub,
        linkedinUrl: normalizedLinkedin,
        twitterUrl: normalizedTwitter,
        portfolioUrl: normalizedPortfolio,
        about: about.trim(),
        skills: finalSkills,
      };

      const res = await axios.patch(`${BASE_URL}/profile/edit`, payload, {
        withCredentials: true,
      });

      dispatch(addUser(res.data.data));
      onClose(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className={`relative w-full max-w-5xl my-6 rounded-[2rem] border shadow-2xl flex flex-col lg:flex-row overflow-hidden ${
          isDarkMode
            ? "bg-[#0d111a] border-slate-800"
            : "bg-white border-slate-200"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={() => onClose(false)}
          className="absolute top-6 right-6 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-red-500/15 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
        >
          ✕
        </button>

        {/* Left Side: Form */}
        <div className="flex-1 p-6 lg:p-10 border-b lg:border-b-0 lg:border-r border-inherit max-h-[85vh] overflow-y-auto">
          <h2
            className={`text-2xl lg:text-3xl font-black mb-6 ${
              isDarkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Edit <span className="text-cyan-500">Developer Profile</span>
          </h2>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-red-500/10 border border-red-500/40 text-red-400 px-4 py-3 rounded-xl text-sm mb-6 font-semibold"
              >
                ⚠️ {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-5">
            {/* ================= Photo Upload from Device Media ================= */}
            <div>
              <label className="block text-xs font-bold uppercase mb-2 opacity-80">
                Profile Photo (Choose from Device)
              </label>
              <div className="flex items-center gap-4">
                <div
                  className={`w-20 h-20 rounded-2xl border-2 border-dashed overflow-hidden shrink-0 relative flex items-center justify-center ${
                    isDarkMode
                      ? "bg-[#141a29] border-slate-700"
                      : "bg-slate-100 border-slate-300"
                  }`}
                >
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaCamera className="text-2xl text-slate-400" />
                  )}
                </div>

                <div className="flex-1">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-cyan-500 text-black hover:bg-cyan-400 transition shadow-md shadow-cyan-500/20">
                    <FaCamera className="text-sm" />
                    <span>Choose Photo from Device</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[11px] text-slate-400 mt-1.5 font-medium">
                    Upload your profile picture from phone or laptop gallery
                  </p>
                </div>
              </div>
            </div>

            {/* First & Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase mb-1.5 opacity-75">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border outline-none text-sm font-medium ${
                    isDarkMode
                      ? "bg-[#141a29] border-slate-700 text-white focus:border-cyan-500"
                      : "bg-slate-50 border-slate-200 focus:border-indigo-500"
                  }`}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase mb-1.5 opacity-75">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border outline-none text-sm font-medium ${
                    isDarkMode
                      ? "bg-[#141a29] border-slate-700 text-white focus:border-cyan-500"
                      : "bg-slate-50 border-slate-200 focus:border-indigo-500"
                  }`}
                />
              </div>
            </div>

            {/* Developer Profiles: GitHub & LinkedIn (Compulsory with *) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase mb-1.5 opacity-75 flex items-center gap-1">
                  GitHub Profile URL <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/your-username"
                  className={`w-full px-4 py-2.5 rounded-xl border outline-none text-sm font-medium ${
                    isDarkMode
                      ? "bg-[#141a29] border-slate-700 text-white focus:border-cyan-500"
                      : "bg-slate-50 border-slate-200 focus:border-indigo-500"
                  }`}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase mb-1.5 opacity-75 flex items-center gap-1">
                  LinkedIn Profile URL <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/your-profile"
                  className={`w-full px-4 py-2.5 rounded-xl border outline-none text-sm font-medium ${
                    isDarkMode
                      ? "bg-[#141a29] border-slate-700 text-white focus:border-cyan-500"
                      : "bg-slate-50 border-slate-200 focus:border-indigo-500"
                  }`}
                />
              </div>
            </div>

            {/* Twitter / X Profile URL */}
            <div>
              <label className="block text-xs font-bold uppercase mb-1.5 opacity-75">
                Twitter / X Profile URL
              </label>
              <input
                type="text"
                value={twitterUrl}
                onChange={(e) => setTwitterUrl(e.target.value)}
                placeholder="https://x.com/your-handle"
                className={`w-full px-4 py-2.5 rounded-xl border outline-none text-sm font-medium ${
                  isDarkMode
                    ? "bg-[#141a29] border-slate-700 text-white focus:border-cyan-500"
                    : "bg-slate-50 border-slate-200 focus:border-indigo-500"
                }`}
              />
            </div>

            {/* Headline & Location */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase mb-1.5 opacity-75">
                  Headline / Role (Optional)
                </label>
                <input
                  type="text"
                  value={headline}
                  placeholder="e.g. Full Stack Developer"
                  onChange={(e) => setHeadline(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border outline-none text-sm font-medium ${
                    isDarkMode
                      ? "bg-[#141a29] border-slate-700 text-white focus:border-cyan-500"
                      : "bg-slate-50 border-slate-200 focus:border-indigo-500"
                  }`}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase mb-1.5 opacity-75">
                  Location (Optional)
                </label>
                <input
                  type="text"
                  value={location}
                  placeholder="e.g. Remote / Bangalore"
                  onChange={(e) => setLocation(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border outline-none text-sm font-medium ${
                    isDarkMode
                      ? "bg-[#141a29] border-slate-700 text-white focus:border-cyan-500"
                      : "bg-slate-50 border-slate-200 focus:border-indigo-500"
                  }`}
                />
              </div>
            </div>

            {/* Age, Gender & Experience */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase mb-1.5 opacity-75">
                  Age (Optional)
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border outline-none text-sm font-medium ${
                    isDarkMode
                      ? "bg-[#141a29] border-slate-700 text-white"
                      : "bg-slate-50 border-slate-200"
                  }`}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase mb-1.5 opacity-75">
                  Gender (Optional)
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border outline-none text-sm font-medium ${
                    isDarkMode
                      ? "bg-[#141a29] border-slate-700 text-white"
                      : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase mb-1.5 opacity-75">
                  Exp (Years)
                </label>
                <input
                  type="number"
                  value={yearsOfExperience}
                  onChange={(e) => setYearsOfExperience(e.target.value)}
                  placeholder="e.g. 2"
                  className={`w-full px-4 py-2.5 rounded-xl border outline-none text-sm font-medium ${
                    isDarkMode
                      ? "bg-[#141a29] border-slate-700 text-white"
                      : "bg-slate-50 border-slate-200"
                  }`}
                />
              </div>
            </div>

            {/* About */}
            <div>
              <label className="block text-xs font-bold uppercase mb-1.5 opacity-75">
                About You (Optional)
              </label>
              <textarea
                rows="3"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="Share your experience, passions, and what projects you want to build..."
                className={`w-full px-4 py-2.5 rounded-xl border outline-none text-sm font-medium ${
                  isDarkMode
                    ? "bg-[#141a29] border-slate-700 text-white focus:border-cyan-500"
                    : "bg-slate-50 border-slate-200 focus:border-indigo-500"
                }`}
              />
            </div>

            {/* Skills */}
            <div>
              <label className="flex justify-between items-center text-xs font-bold uppercase mb-1.5 opacity-75">
                <span>Technologies & Skills</span>
                {skills.length > 0 && (
                  <span className="text-[11px] font-semibold opacity-60">
                    {skills.length} added
                  </span>
                )}
              </label>

              {/* Added Skills Chips */}
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2.5">
                  <AnimatePresence>
                    {skills.map((skill) => (
                      <motion.span
                        key={skill}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold ${
                          isDarkMode
                            ? "bg-cyan-500/20 text-cyan-400"
                            : "bg-indigo-100 text-indigo-700"
                        }`}
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="hover:text-red-400 text-xs ml-0.5"
                          title="Remove skill"
                        >
                          ✕
                        </button>
                      </motion.span>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {/* Add Skill Input Row */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleAddSkill}
                  placeholder="e.g. React, Node.js, Python..."
                  className={`flex-1 px-4 py-2.5 rounded-xl border outline-none text-sm font-medium ${
                    isDarkMode
                      ? "bg-[#141a29] border-slate-700 text-white focus:border-cyan-500"
                      : "bg-slate-50 border-slate-200 focus:border-indigo-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => addSkillDirectly(skillInput)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition shrink-0 shadow-sm ${
                    isDarkMode
                      ? "bg-cyan-500 text-black hover:bg-cyan-400 shadow-cyan-500/20"
                      : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/20"
                  }`}
                >
                  + Add
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="pt-3 flex gap-3">
              <button
                type="button"
                onClick={() => onClose(false)}
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
                onClick={saveProfile}
                disabled={isLoading}
                className={`flex-1 py-3 rounded-xl font-black text-sm transition shadow-lg ${
                  isDarkMode
                    ? "bg-cyan-500 text-black hover:bg-cyan-400 shadow-cyan-500/20"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Live Card Preview */}
        <div
          className={`w-full lg:w-[380px] p-8 flex flex-col items-center justify-center ${
            isDarkMode ? "bg-[#080c14]" : "bg-slate-50"
          }`}
        >
          <h3 className="text-xs font-bold uppercase tracking-wider mb-6 opacity-60">
            Live Preview
          </h3>

          <div className="w-[280px] rounded-[28px] overflow-hidden border shadow-2xl relative bg-black border-slate-800">
            <div className="h-[330px] relative">
              <img
                src={
                  photoUrl ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500"
                }
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

              <div className="absolute bottom-0 left-0 w-full p-4">
                <h2 className="text-xl font-black text-white flex items-end gap-1.5 truncate">
                  {firstName || "Developer"} {lastName}
                </h2>
                <p className="text-xs text-cyan-400 font-semibold mt-0.5">
                  {headline || "Full Stack Developer"}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="rounded-full bg-white/10 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-white">
                    🎂 {age || "--"}
                  </span>
                  {location && (
                    <span className="rounded-full bg-white/10 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-white flex items-center gap-1">
                      <FaLocationDot className="text-[8px]" /> {location}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className={`p-4 ${isDarkMode ? "bg-[#0d111a]" : "bg-white"}`}>
              <p
                className={`text-xs leading-relaxed line-clamp-3 mb-3 ${
                  isDarkMode ? "text-gray-300" : "text-slate-600"
                }`}
              >
                {about || "Your developer story will appear here..."}
              </p>

              {skills.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {skills.slice(0, 4).map((skill) => (
                    <span
                      key={skill}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        isDarkMode
                          ? "bg-cyan-500/15 text-cyan-400"
                          : "bg-indigo-50 text-indigo-700"
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                  {skills.length > 4 && (
                    <span
                      className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold ${
                        isDarkMode
                          ? "bg-slate-800 text-slate-400"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      +{skills.length - 4}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EditProfile;
