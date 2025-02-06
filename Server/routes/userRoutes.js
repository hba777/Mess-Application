const express = require("express");
const router = express.Router();
const { authenticateJWT, isAdmin } = require("../middleware/authMiddleware");
const {
  createBill,
  getBills,
  getBillById,
  updateBill,
  deleteBill,
} = require("../controllers/userController");

// Protected routes for Bills (using JWT authentication)
router.use(authenticateJWT);

// Create Bill (Admin Only)
router.post("/bill", isAdmin, createBill);

// Get All Bills
router.get("/bills", isAdmin, getBills);

// Get Bill by ID
router.get("/bill/:bill_id", isAdmin, getBillById);

// Update Bill (Admin Only)
router.put("/bill/:bill_id", isAdmin, updateBill);

// Delete Bill (Admin Only)
router.delete("/bill/:bill_id", isAdmin, deleteBill);

module.exports = router;
