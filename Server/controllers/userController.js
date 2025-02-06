const { queryDb } = require("../config/db");

// User Login
const loginUser = async (req, res) => {
  const { cmsid, password } = req.body; // Assuming CMS ID and password are provided

  try {
    const result = await queryDb(
      "SELECT * FROM users WHERE cmsid = $1 AND password = $2",
      [cmsid, password] // Simple password check (in real-world, hash and salt passwords)
    );

    if (!result || result.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result[0];

    // Create and sign JWT token
    const token = jwt.sign(
      { cmsid: user.cmsid, role: user.role }, // Payload includes CMS ID and user role
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    res.json({ token });
  } catch (err) {
    console.error("Error in loginUser:", err);
    res.status(500).json({ message: "Server error during login", error: err });
  }
};

// Create a Bill
const createBill = async (req, res) => {
  const { CMIS_id, amount, due_date, status, receipt_number } = req.body;

  try {
    const result = await queryDb(
      "INSERT INTO bill (CMIS_id, amount, due_date, status, receipt_number) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [CMIS_id, amount, due_date, status, receipt_number]
    );

    if (!result || result.length === 0) {
      return res.status(400).json({ message: "Bill creation failed" });
    }

    res.status(201).json(result[0]); // Return the created bill
  } catch (err) {
    console.error("Error in createBill:", err);
    res.status(500).json({ message: "Error creating bill", error: err });
  }
};

// Get All Bills
const getBills = async (req, res) => {
  try {
    const bills = await queryDb("SELECT * FROM bill");

    if (!bills || bills.length === 0) {
      return res.status(404).json({ message: "No bills found" });
    }

    res.json(bills);
  } catch (err) {
    console.error("Error in getBills:", err);
    res.status(500).json({ message: "Error fetching bills", error: err });
  }
};

// Get Bill by ID
const getBillById = async (req, res) => {
  const { bill_id } = req.params;

  try {
    const result = await queryDb("SELECT * FROM bill WHERE bill_id = $1", [
      bill_id,
    ]);

    if (!result || result.length === 0) {
      return res.status(404).json({ message: "Bill not found" });
    }

    res.json(result[0]);
  } catch (err) {
    console.error("Error in getBillById:", err);
    res.status(500).json({ message: "Error fetching bill", error: err });
  }
};

// Update Bill
const updateBill = async (req, res) => {
  const { bill_id } = req.params;
  const { CMIS_id, amount, due_date, status, receipt_number } = req.body;

  try {
    const result = await queryDb(
      "UPDATE bill SET CMIS_id = $1, amount = $2, due_date = $3, status = $4, receipt_number = $5 WHERE bill_id = $6 RETURNING *",
      [CMIS_id, amount, due_date, status, receipt_number, bill_id]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "Bill not found" });
    }

    res.json(result[0]); // Return the updated bill
  } catch (err) {
    console.error("Error in updateBill:", err);
    res.status(500).json({ message: "Error updating bill", error: err });
  }
};

// Delete Bill
const deleteBill = async (req, res) => {
  const { bill_id } = req.params;

  try {
    const result = await queryDb(
      "DELETE FROM bill WHERE bill_id = $1 RETURNING *",
      [bill_id]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "Bill not found" });
    }

    res.json({ message: "Bill deleted successfully" });
  } catch (err) {
    console.error("Error in deleteBill:", err);
    res.status(500).json({ message: "Error deleting bill", error: err });
  }
};

module.exports = {
  loginUser,
  createBill,
  getBills,
  getBillById,
  updateBill,
  deleteBill,
};
