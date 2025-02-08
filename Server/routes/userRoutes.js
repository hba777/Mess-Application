const express = require("express");
const router = express.Router();

const { loginUser } = require("../controllers/userController");
const {
  createBill,
  getBills,
  getBillById,
  updateBill,
  deleteBill,
} = require("../controllers/userController");
const { authenticateJWT } = require("../middleware/authMiddleware");

// User Login Route (No Token Needed)
router.post("/login", loginUser);

// Protected routes for Admin (using Passport JWT authentication)
router.use(authenticateJWT);

// 🔹 Create Bill (User-specific access)
router.post("/bill", createBill);

// 🔹 Get All Bills (User-specific access)
router.get("/bills", getBills);

// 🔹 Get Bill by ID (User-specific access)
router.get("/bill/:id", getBillById);

// 🔹 Update Bill (User-specific access)
router.put("/bill/:id", updateBill);

// 🔹 Delete Bill (User-specific access)
router.delete("/bill/:id", deleteBill);

module.exports = router;
