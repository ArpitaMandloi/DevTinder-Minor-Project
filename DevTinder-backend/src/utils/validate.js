const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, emailId, password } = req.body;

  if (!firstName || !firstName.trim()) {
    throw new Error("First name is required.");
  }

  if (!emailId || !emailId.trim()) {
    throw new Error("Email address is required.");
  }

  if (!password) {
    throw new Error("Password is required.");
  }

  if (!validator.isEmail(emailId.trim())) {
    throw new Error("Email address is not valid.");
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character."
    );
  }
};

const validateEditProfileData = (req) => {
  const restrictedFields = ["password"];
  const isRestrictedPresent = Object.keys(req.body).some((field) =>
    restrictedFields.includes(field)
  );

  return !isRestrictedPresent;
};

const validatePasswordChange = (req) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new Error("Current password and new password are required.");
  }

  if (currentPassword === newPassword) {
    throw new Error("New password cannot be the same as current password.");
  }

  if (!validator.isStrongPassword(newPassword)) {
    throw new Error(
      "New password must be at least 8 characters long and include an uppercase, lowercase, number, and special character."
    );
  }
};

module.exports = {
  validateSignUpData,
  validateEditProfileData,
  validatePasswordChange,
};
