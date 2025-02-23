const express = require("express");
const router = express.Router();
const {
  getBillPayments,
  getBillPaymentById,
  createBillPayment,
  updateBillPayment,
  deleteBillPayment,
} = require("../controllers/paymentController");
const { authenticateJWT } = require("../middleware/authMiddleware");

// Apply authentication middleware
router.use(authenticateJWT);

// 🔹 Get All Bill Payments
router.get("/bill-payments", getBillPayments);

// 🔹 Get Bill Payment by ID
router.get("/bill-payment/:id", getBillPaymentById);

// 🔹 Create Bill Payment
router.post("/bill-payment", createBillPayment);

// 🔹 Update Bill Payment
router.put("/bill-payment/:id", updateBillPayment);

// 🔹 Delete Bill Payment
router.delete("/bill-payment/:id", deleteBillPayment);

module.exports = router;
