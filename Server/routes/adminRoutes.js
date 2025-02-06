const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
  loginAdmin,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/adminController");
const { authenticateJWT, isAdmin } = require("../middleware/authMiddleware");

// Admin Login Route
router.post("/login", loginAdmin);

// Protected routes for Admin (using Passport JWT authentication)
router.use(authenticateJWT);

// Get All Users (Admin Only)
router.get("/users", isAdmin, getUsers);

// Create User (Admin Only)
router.post("/user", isAdmin, createUser);

// Update User (Admin Only)
router.put("/user/:CMIS_id", isAdmin, updateUser);

// Delete User (Admin Only)
router.delete("/user/:CMIS_id", isAdmin, deleteUser);

module.exports = router;
