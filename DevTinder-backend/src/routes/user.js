const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const {
  getReceivedRequests,
  getConnections,
  getFeed,
  getUserStats,
} = require("../controllers/userController");

// Requests
userRouter.get("/user/requests/received", userAuth, getReceivedRequests);
userRouter.get("/user/requests", userAuth, getReceivedRequests);

// Connections (supporting both singular and plural)
userRouter.get("/user/connection", userAuth, getConnections);
userRouter.get("/user/connections", userAuth, getConnections);

// Feed (supporting root /feed and /user/feed)
userRouter.get("/feed", userAuth, getFeed);
userRouter.get("/user/feed", userAuth, getFeed);

// Dashboard Statistics
userRouter.get("/user/stats", userAuth, getUserStats);

module.exports = userRouter;
