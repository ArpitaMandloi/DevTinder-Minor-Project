const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const {
  viewProfile,
  editProfile,
  changePassword,
  getPublicProfile,
  deleteProfile,
} = require("../controllers/profileController");

profileRouter.get("/profile/view", userAuth, viewProfile);
profileRouter.get("/profile/view/:userId", userAuth, getPublicProfile);
profileRouter.patch("/profile/edit", userAuth, editProfile);
profileRouter.patch("/profile/password", userAuth, changePassword);
profileRouter.delete("/profile", userAuth, deleteProfile);
profileRouter.delete("/profile/delete", userAuth, deleteProfile);

module.exports = profileRouter;
