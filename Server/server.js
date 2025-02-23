require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const { connectDb, closeDb } = require("./config/db");
const restrictIp = require("./middleware/ipMiddleware");

// Initialize the application
const app = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Passport Initialization
app.use(passport.initialize());

// Apply IP restriction middleware globally
console.log("🔍 Debug restrictIp:", restrictIp); // Add this line

app.use(restrictIp); // Make sure it's used correctly

// Routes
app.use("/api/admin", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/pay", paymentRoutes);

// Database connection
(async () => {
  try {
    await connectDb(); // Ensure DB is connected at the start
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1); // Exit if DB connection fails
  }
})();

// Error handling middleware (for handling errors globally)
app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" });
});

// Server and graceful shutdown
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

process.on("SIGINT", async () => {
  console.log("\n🔻 Shutting down server...");
  await closeDb();
  server.close(() => {
    console.log("🛑 Server shut down gracefully.");
    process.exit(0);
  });
});

process.on("SIGTERM", async () => {
  console.log("\n🔻 Server shutting down...");
  await closeDb();
  server.close(() => {
    console.log("🛑 Server shut down successfully.");
    process.exit(0);
  });
});
