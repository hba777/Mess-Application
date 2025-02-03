// server.js (or app.js)

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const authRoutes = require("./routes/authRoutes");
const { connectDb, closeDb } = require("./config/db"); // Import the database functions

const app = express();

// Initialize Passport
app.use(passport.initialize());

// Middleware setup
app.use(cors());
app.use(express.json());

// Use the auth routes
app.use("/api/auth", authRoutes);

// Database connection check
(async () => {
  try {
    await connectDb(); // Check the DB connection
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1); // Exit process if DB connection fails
  }
})();

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🔻 Shutting down server...");
  await closeDb(); // Close the DB connection gracefully
  server.close(() => {
    console.log("🛑 Server shut down gracefully.");
    process.exit(0);
  });
});
