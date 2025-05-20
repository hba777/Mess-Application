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
    // 1. Insert the payment record
    const paymentResult = await queryDb(
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

    let remainingAmount = parseFloat(payment_amount);

    // 2. Fetch all unpaid or underpaid bills for that user
    const unpaidBills = await queryDb(
      `SELECT id, amount_received, gTotal 
       FROM bill 
       WHERE cms_id = $1 AND status != 'Paid'
       ORDER BY due_date ASC NULLS LAST, created_at ASC`,
      [payer_cms_id]
    );

    for (const bill of unpaidBills) {
      const { id, amount_received, gtotal } = bill;
      const pendingAmount = parseFloat(gtotal) - parseFloat(amount_received);

      if (remainingAmount <= 0) break;

      const payAmount = Math.min(remainingAmount, pendingAmount);
      const updatedAmountReceived = parseFloat(amount_received) + payAmount;

      const newStatus = updatedAmountReceived >= parseFloat(gtotal) ? "Paid" : "Pending";

      // 3. Update each bill accordingly
      await queryDb(
        `UPDATE bill 
         SET amount_received = $1,
             status = $2
         WHERE id = $3`,
        [updatedAmountReceived, newStatus, id]
      );

      remainingAmount -= payAmount;
    }

    res.status(201).json({
      message: "Bill payment recorded and bills updated successfully",
      payment: paymentResult[0],
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

// 🔹 Get Pending Amounts (All or Specific User ID)
const getPendingAmounts = async (req, res) => {
  const { cms_id } = req.params;

  try {
    let query = "SELECT * FROM track_pending_amount()";
    let values = [];

    if (cms_id) {
      query += " WHERE cms_id = $1";
      values.push(cms_id);
    }

    const result = await queryDb(query, values);

    if (!result || result.length === 0) {
      return res.status(404).json({ message: "No pending amount found" });
    }

    res.json(result.length === 1 ? result[0] : result);
  } catch (err) {
    console.error("Error in getPendingAmounts:", err);
    res.status(500).json({ message: "Error fetching pending amounts" });
  }
};

module.exports = {
  getBillPayments,
  getBillPaymentById,
  createBillPayment,
  updateBillPayment,
  deleteBillPayment,
  getPendingAmounts,
};
