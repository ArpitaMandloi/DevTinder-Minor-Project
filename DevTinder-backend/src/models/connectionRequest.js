const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "accepted", "rejected", "interested"],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate requests from user A to user B
connectionRequestSchema.index(
  { fromUserId: 1, toUserId: 1 },
  { unique: true }
);

// Performance indexes
connectionRequestSchema.index({ toUserId: 1, status: 1 });
connectionRequestSchema.index({ fromUserId: 1, status: 1 });

// Pre-save validation: Cannot send request to oneself
connectionRequestSchema.pre("save", function () {
  const connectionRequest = this;
  const from = connectionRequest.fromUserId?._id || connectionRequest.fromUserId;
  const to = connectionRequest.toUserId?._id || connectionRequest.toUserId;
  if (from && to && from.toString() === to.toString()) {
    throw new Error("Cannot send a connection request to yourself!");
  }
});

const ConnectionRequest = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequest;
