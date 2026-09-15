const bcrypt = require("bcrypt");
const User = require("../models/user");
const { validateSignUpData } = require("../utils/validate");
const ApiResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// ======================
// SIGNUP
// ======================
const signup = asyncHandler(async (req, res) => {
  validateSignUpData(req);

  const {
    firstName,
    lastName,
    emailId,
    password,
    age,
    gender,
    photoUrl,
    about,
    skills,
    headline,
    location,
    githubUsername,
  } = req.body;

  // Check if email already registered
  const existingUser = await User.findOne({
    emailId: emailId.trim().toLowerCase(),
  });
  if (existingUser) {
    throw new ApiError(400, "An account with this email already exists.");
  }

  // Hash password with bcrypt
  const passwordHash = await bcrypt.hash(password, 10);

  // Create user
  const user = new User({
    firstName: firstName.trim(),
    lastName: lastName ? lastName.trim() : "",
    emailId: emailId.trim().toLowerCase(),
    password: passwordHash,
    age: age ? Number(age) : undefined,
    gender,
    photoUrl: photoUrl || undefined,
    about: about || undefined,
    skills: Array.isArray(skills) ? skills : [],
    headline: headline || "Full Stack Developer",
    location: location || "Remote",
    githubUsername: githubUsername || "",
  });

  const savedUser = await user.save();
  const token = await savedUser.getJWT();

  res.cookie("token", token, cookieOptions);

  return res.status(201).json(
    new ApiResponse(
      201,
      { user: savedUser, token },
      "User registered successfully!"
    )
  );
});

// ======================
// LOGIN
// ======================
const login = asyncHandler(async (req, res) => {
  const { emailId, password } = req.body;

  if (!emailId || !password) {
    throw new ApiError(400, "Email and password are required.");
  }

  const user = await User.findOne({ emailId: emailId.trim().toLowerCase() });
  if (!user) {
    throw new ApiError(401, "Invalid credentials. Please check your email/password.");
  }

  const isPasswordValid = await user.validatePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials. Please check your email/password.");
  }

  const token = await user.getJWT();

  res.cookie("token", token, cookieOptions);

  return res.status(200).json(
    new ApiResponse(
      200,
      { user, token },
      "Login successful!"
    )
  );
});

// ======================
// LOGOUT
// ======================
const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Logout successful!"));
});

// ======================
// GET CURRENT USER
// ======================
const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully."));
});

module.exports = {
  signup,
  login,
  logout,
  getCurrentUser,
};
