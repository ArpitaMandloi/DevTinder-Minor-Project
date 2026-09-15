const express = require("express");
const authRouter = express.Router();
const {
  signup,
  login,
  logout,
  getCurrentUser,
} = require("../controllers/authController");
const { userAuth } = require("../middlewares/auth");

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/auth/me", userAuth, getCurrentUser);

module.exports = authRouter;
