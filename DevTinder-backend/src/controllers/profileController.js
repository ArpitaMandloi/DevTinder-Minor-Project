const bcrypt = require("bcrypt");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");
const {
  validateEditProfileData,
  validatePasswordChange,
} = require("../utils/validate");
const ApiResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");

// ======================
// VIEW OWN PROFILE
// ======================
const viewProfile = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Profile fetched successfully"));
});

// ======================
// EDIT PROFILE (UPDATE)
// ======================
const editProfile = asyncHandler(async (req, res) => {
  if (!validateEditProfileData(req)) {
    throw new ApiError(400, "Password cannot be updated through profile edit.");
  }

  const allowedEditFields = [
    "firstName",
    "lastName",
    "photoUrl",
    "gender",
    "age",
    "about",
    "skills",
    "headline",
    "yearsOfExperience",
    "location",
    "githubUsername",
    "githubUrl",
    "linkedinUrl",
    "portfolioUrl",
    "twitterUrl",
  ];

  const loggedInUser = req.user;

  allowedEditFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      if (field === "age") {
        const numAge = Number(req.body[field]);
        loggedInUser[field] =
          !isNaN(numAge) && numAge >= 18 ? numAge : undefined;
      } else if (field === "gender") {
        const g = req.body[field]?.toLowerCase();
        loggedInUser[field] = ["male", "female", "other"].includes(g)
          ? g
          : undefined;
      } else if (field === "yearsOfExperience") {
        const exp = Number(req.body[field]);
        loggedInUser[field] = !isNaN(exp) && exp >= 0 ? exp : 0;
      } else if (field === "skills") {
        loggedInUser[field] = Array.isArray(req.body[field])
          ? req.body[field].filter(
              (s) => typeof s === "string" && s.trim().length > 0
            )
          : [];
      } else {
        loggedInUser[field] = req.body[field];
      }
    }
  });

  const updatedUser = await loggedInUser.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      updatedUser,
      `${updatedUser.firstName}, your profile was updated successfully!`
    )
  );
});

// ======================
// CHANGE PASSWORD
// ======================
const changePassword = asyncHandler(async (req, res) => {
  validatePasswordChange(req);

  const { currentPassword, newPassword } = req.body;
  const user = req.user;

  const isPasswordCorrect = await user.validatePassword(currentPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Current password does not match.");
  }

  const newHash = await bcrypt.hash(newPassword, 10);
  user.password = newHash;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Password updated successfully!"));
});

// ======================
// VIEW PUBLIC PROFILE
// ======================
const getPublicProfile = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "Developer profile not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Public profile fetched successfully"));
});

// ======================
// DELETE ACCOUNT (CRUD: DELETE)
// ======================
const deleteProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // 1. Delete all connection requests associated with this user
  await ConnectionRequest.deleteMany({
    $or: [{ fromUserId: userId }, { toUserId: userId }],
  });

  // 2. Delete user account from database
  await User.findByIdAndDelete(userId);

  // 3. Clear auth cookie
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      null,
      "Your DevTinder account and all associated data have been permanently deleted."
    )
  );
});

module.exports = {
  viewProfile,
  editProfile,
  changePassword,
  getPublicProfile,
  deleteProfile,
};
