const express = require("express");
const router = express.Router();

const {
  loginAdmin,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/adminController");

const { getPendingAmounts } = require("../controllers/paymentController");

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
router.put("/user/:cms_id", isAdmin, updateUser);

// Delete User (Admin Only)
router.delete("/user/:cms_id", isAdmin, deleteUser);

// Get Pending Amounts (All or Specific CMS ID) (Admin Only)
router.get("/pending-amounts/:cms_id?", isAdmin, getPendingAmounts);

module.exports = router;
