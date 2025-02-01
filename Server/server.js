require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Initialize Passport
app.use(passport.initialize());

app.use(cors());
app.use(express.json());

// Use the auth routes
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
