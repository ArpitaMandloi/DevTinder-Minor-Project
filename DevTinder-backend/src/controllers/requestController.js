const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");
const ApiResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");

// ======================
// SEND CONNECTION REQUEST
// ======================
const sendConnectionRequest = asyncHandler(async (req, res) => {
  const fromUserId = req.user._id;
  const { status, toUserId } = req.params;

  const allowedStatus = ["interested", "ignored"];
  if (!allowedStatus.includes(status)) {
    throw new ApiError(
      400,
      `Invalid status type: '${status}'. Allowed: ${allowedStatus.join(", ")}`
    );
  }

  // 1. Prevent self request
  if (fromUserId.toString() === toUserId) {
    throw new ApiError(400, "You cannot send a connection request to yourself.");
  }

  // 2. Check if target developer exists
  const toUser = await User.findById(toUserId);
  if (!toUser) {
    throw new ApiError(404, "Target developer profile not found.");
  }

  // 3. Check for existing request in either direction
  const existingRequest = await ConnectionRequest.findOne({
    $or: [
      { fromUserId, toUserId },
      { fromUserId: toUserId, toUserId: fromUserId },
    ],
  });

  if (existingRequest) {
    return res.status(200).json(
      new ApiResponse(
        200,
        existingRequest,
        "Connection request already recorded."
      )
    );
  }

  // 4. Create new connection request
  const connectionRequest = new ConnectionRequest({
    fromUserId,
    toUserId,
    status,
  });

  const savedRequest = await connectionRequest.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      savedRequest,
      status === "interested"
        ? `Connection request sent to ${toUser.firstName}!`
        : `Profile skipped.`
    )
  );
});

// ======================
// REVIEW CONNECTION REQUEST
// ======================
const reviewConnectionRequest = asyncHandler(async (req, res) => {
  const loggedInUser = req.user;
  const { status, requestId } = req.params;

  const allowedStatus = ["accepted", "rejected"];
  if (!allowedStatus.includes(status)) {
    throw new ApiError(
      400,
      `Invalid review status: '${status}'. Allowed: ${allowedStatus.join(", ")}`
    );
  }

  // Find request pending for logged-in user
  const connectionRequest = await ConnectionRequest.findOne({
    _id: requestId,
    toUserId: loggedInUser._id,
    status: "interested",
  }).populate("fromUserId", "firstName lastName photoUrl headline skills location");

  if (!connectionRequest) {
    throw new ApiError(
      404,
      "Connection request not found or has already been reviewed."
    );
  }

  connectionRequest.status = status;
  const savedRequest = await connectionRequest.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      savedRequest,
      `Connection request ${status} successfully!`
    )
  );
});

module.exports = {
  sendConnectionRequest,
  reviewConnectionRequest,
};
