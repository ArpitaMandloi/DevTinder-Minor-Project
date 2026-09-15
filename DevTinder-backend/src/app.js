require("dotenv").config();
const express = require("express");
const http = require("http");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/database");
const { errorHandler } = require("./middlewares/error");

const app = express();
const server = http.createServer(app);

// 1. Allowed Origins for CORS
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:3000",
].filter(Boolean);

const isOriginAllowed = (origin, callback) => {
  // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
  if (!origin) return callback(null, true);

  if (
    allowedOrigins.includes(origin) ||
    origin.startsWith("http://localhost:")
  ) {
    return callback(null, true);
  }
  return callback(new Error("CORS policy violation: origin not allowed."));
};

// 2. Security & Utility Middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(
  cors({
    origin: isOriginAllowed,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// General Rate Limiting: 500 requests per 15 minutes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: "Too many requests from this IP, please try again after 15 minutes.",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(generalLimiter);

// Auth Rate Limiting: 50 requests per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: "Too many authentication attempts, please try again later.",
});

app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));
app.use(cookieParser());

// 3. Health Check Endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    project: "DevTinder Minor Project",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// 4. Mount Application Routes
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/signup", authLimiter);
app.use("/login", authLimiter);

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

// 5. Centralized Error Handler Middleware
app.use(errorHandler);

// 6. Start Server & Connect Database
const PORT = process.env.PORT || 7777;

connectDB()
  .then(() => {
    console.log("Database connection established successfully.");
    server.listen(PORT, () => {
      console.log(`🚀 DevTinder Minor Project server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  });

module.exports = { app, server };
