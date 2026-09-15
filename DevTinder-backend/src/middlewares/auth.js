const jwt = require("jsonwebtoken");
const User = require("../models/user");
const ApiError = require("../utils/apiError");

const userAuth = async (req, res, next) => {
  try {
    // 1. Extract token from cookies OR Authorization header
    let token = req.cookies?.token;

    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (!token) {
      throw new ApiError(401, "Authentication required. Please log in.");
    }

    // 2. Verify token
    const secret = process.env.JWT_SECRET || "DEV_TINDER_MINOR_PROJECT_SECRET_KEY_2026";
    const decoded = jwt.verify(token, secret);

    const { _id } = decoded;

    // 3. Find user
    const user = await User.findById(_id);

    if (!user) {
      throw new ApiError(401, "User not found or account deactivated.");
    }

    req.user = user;
    req.token = token;

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  userAuth,
};
