const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const {
  sendConnectionRequest,
  reviewConnectionRequest,
} = require("../controllers/requestController");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  sendConnectionRequest
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  reviewConnectionRequest
);

module.exports = requestRouter;
