const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      index: true,
      minLength: 2,
      maxLength: 50,
      trim: true,
    },

    lastName: {
      type: String,
      trim: true,
      maxLength: 50,
      default: "",
    },

    emailId: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      required: [true, "Email address is required"],
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address: " + value);
        }
      },
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error(
            "Password must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 symbol."
          );
        }
      },
    },

    age: {
      type: Number,
      min: 18,
      max: 100,
    },

    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: `{VALUE} is not a valid gender type`,
      },
    },

    headline: {
      type: String,
      trim: true,
      maxLength: 120,
      default: "Full Stack Developer",
    },

    yearsOfExperience: {
      type: Number,
      default: 0,
      min: 0,
      max: 50,
    },

    location: {
      type: String,
      trim: true,
      default: "Remote",
    },

    githubUsername: {
      type: String,
      trim: true,
      default: "",
    },

    githubUrl: {
      type: String,
      trim: true,
      default: "",
    },

    linkedinUrl: {
      type: String,
      trim: true,
      default: "",
    },

    portfolioUrl: {
      type: String,
      trim: true,
      default: "",
    },

    twitterUrl: {
      type: String,
      trim: true,
      default: "",
    },

    photoUrl: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=500&auto=format&fit=crop",
      validate(value) {
        if (
          value &&
          !validator.isURL(value) &&
          !value.startsWith("data:image/")
        ) {
          throw new Error("Invalid photo URL or format: " + value);
        }
      },
    },

    about: {
      type: String,
      default: "Passionate developer looking to build great projects together!",
      maxLength: 1000,
    },

    skills: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ firstName: 1, lastName: 1 });
userSchema.index({ skills: 1 });

// Sanitize user object to never expose password
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  return user;
};

// Generate JWT authentication token
userSchema.methods.getJWT = async function () {
  const user = this;
  const secret = process.env.JWT_SECRET || "DEV_TINDER_MINOR_PROJECT_SECRET_KEY_2026";
  const token = jwt.sign({ _id: user._id }, secret, { expiresIn: "7d" });
  return token;
};

// Validate user password using bcrypt
userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  return bcrypt.compare(passwordInputByUser, user.password);
};

module.exports = mongoose.model("User", userSchema);
