const { queryDb } = require("../config/db");

// 🔹 Get All Bill Payments
const getBillPayments = async (req, res) => {
  try {
    const result = await queryDb("SELECT * FROM bill_payment");
    if (!result || result.length === 0) {
      return res.status(404).json({ message: "No bill payments found" });
    }
    res.json(result);
  } catch (err) {
    console.error("Error in getBillPayments:", err);
    res.status(500).json({ message: "Error fetching bill payments" });
  }
};

// 🔹 Get Bill Payment by ID
const getBillPaymentById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await queryDb("SELECT * FROM bill_payment WHERE id = $1", [
      id,
    ]);
    if (!result || result.length === 0) {
      return res.status(404).json({ message: "Bill payment not found" });
    }
    res.json(result[0]);
  } catch (err) {
    console.error("Error in getBillPaymentById:", err);
    res.status(500).json({ message: "Error fetching bill payment" });
  }
};

// 🔹 Create Bill Payment
const createBillPayment = async (req, res) => {
  const {
    bill_id,
    transaction_id,
    payer_cms_id,
    payment_amount,
    payment_method,
    receipt_number,
    status,
  } = req.body;

  if (!bill_id || !transaction_id || !payer_cms_id || !payment_amount) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const result = await queryDb(
      `INSERT INTO bill_payment 
      (bill_id, transaction_id, payer_cms_id, payment_amount, payment_method, receipt_number, status) 
      VALUES ($1, $2, $3, $4, $5, $6, COALESCE($7, 'Pending')) 
      RETURNING *`,
      [
        bill_id,
        transaction_id,
        payer_cms_id,
        payment_amount,
        payment_method,
        receipt_number,
        status,
      ]
    );

    res.status(201).json({
      message: "Bill payment recorded successfully",
      payment: result[0],
    });
  } catch (err) {
    console.error("Error in createBillPayment:", err);
    res.status(500).json({ message: "Error creating bill payment" });
  }
};

// 🔹 Update Bill Payment
const updateBillPayment = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const fields = Object.keys(updates).map(
      (key, index) => `"${key}" = $${index + 1}`
    );
    const values = Object.values(updates);

    if (fields.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const query = `UPDATE bill_payment SET ${fields.join(", ")} WHERE id = $${
      values.length + 1
    } RETURNING *`;

    const result = await queryDb(query, [...values, id]);

    if (!result || result.length === 0) {
      return res.status(404).json({ message: "Bill payment not found" });
    }

    res.json({
      message: "Bill payment updated successfully",
      payment: result[0],
    });
  } catch (error) {
    console.error("Error in updateBillPayment:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 🔹 Delete Bill Payment
const deleteBillPayment = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await queryDb(
      "DELETE FROM bill_payment WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "Bill payment not found" });
    }

    res.json({ message: "Bill payment deleted successfully" });
  } catch (err) {
    console.error("Error in deleteBillPayment:", err);
    res.status(500).json({ message: "Error deleting bill payment" });
  }
};

module.exports = {
  getBillPayments,
  getBillPaymentById,
  createBillPayment,
  updateBillPayment,
  deleteBillPayment,
};
