const express = require("express");
const router = express.Router();

const {
  loginAdmin,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getTotalUsers,
  getTotalPendingBills,
  getTotalPaidBills,
  getTotalUsersWhoPaid,
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
router.put("/user/:cms_id", isAdmin, updateUser);

// Delete User (Admin Only)
router.delete("/user/:cms_id", isAdmin, deleteUser);

// KPIs (Admin Only)
router.get("/total-users", getTotalUsers);
router.get("/total-pending-bills", getTotalPendingBills);
router.get("/total-paid-bills", getTotalPaidBills);
router.get("/total-users-who-paid", getTotalUsersWhoPaid);

module.exports = router;
