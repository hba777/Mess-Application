require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const authRoutes = require("./routes/authRoutes");
const pool = require("./db/db");

const app = express();

// Initialize Passport
app.use(passport.initialize());

app.use(cors());
app.use(express.json());

// Use the auth routes
app.use("/api/auth", authRoutes);

// Database connection
pool
  .connect()
  .then(() => {
    console.log("Connected to the database successfully.");
  })
  .catch((err) => {
    console.error("Database connection error:", err.stack);
    process.exit(1);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
