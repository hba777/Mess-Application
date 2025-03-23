const { queryDb } = require("../config/db");
const { generateToken } = require("../config/passport");
const bcrypt = require("bcrypt");

// Login User
const loginUser = async (req, res) => {
  const { cms_id, password } = req.body;
  try {
    const result = await queryDb("SELECT * FROM users WHERE cms_id = $1", [
      cms_id,
    ]);

    if (!result || result.length === 0) {
      return res.status(401).json({ message: "Invalid CMS ID or password" });
    }

    const user = result[0];

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid CMS ID or password" });
    }

    const token = generateToken(user); // Generate JWT

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error("Error in loginUser:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new bill
const createBill = async (req, res) => {
  try {
    const {
      cms_id,
      rank = null, // Default to null if not provided
      name = null, // Default to null if not provided
      course,
      m_subs,
      saving,
      c_fund,
      messing,
      e_messing,
      sui_gas_per_day,
      sui_gas_25_percent,
      tea_bar_mcs,
      dining_hall_charges,
      swpr,
      laundry,
      gar_mess,
      room_maint,
      elec_charges_160_block,
      internet,
      svc_charges,
      sui_gas_boqs,
      sui_gas_166_cd,
      sui_gas_166_block,
      lounge_160,
      rent_charges,
      fur_maint,
      sui_gas_elec_fts,
      mat_charges,
      hc_wa,
      gym,
      cafe_maint_charges,
      dine_out,
      payamber,
      student_societies_fund,
      dinner_ni_jscmcc_69,
      current_bill,
      arrear,
      receipt_no,
      amount_received,
      gTotal,
      balAmount,
    } = req.body;

    // Validate required fields
    if (!cms_id || !course) {
      return res.status(400).json({
        message: "CMS ID, Course, and Current Bill are required",
      });
    }

    // Insert new bill into the database
    const result = await queryDb(
      `INSERT INTO bill (
        cms_id, rank, name, course, m_subs, saving, c_fund, messing, e_messing,
        sui_gas_per_day, sui_gas_25_percent, tea_bar_mcs, dining_hall_charges, swpr,
        laundry, gar_mess, room_maint, elec_charges_160_block, internet, svc_charges,
        sui_gas_boqs, sui_gas_166_cd, sui_gas_166_block, lounge_160, rent_charges,
        fur_maint, sui_gas_elec_fts, mat_charges, hc_wa, gym, cafe_maint_charges,
        dine_out, payamber, student_societies_fund, dinner_ni_jscmcc_69,
        current_bill, arrear, receipt_no, amount_received, gTotal, balAmount
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
        $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41
      ) RETURNING *`,
      [
        cms_id,
        rank, // Now optional
        name, // Now optional
        course,
        m_subs,
        saving,
        c_fund,
        messing,
        e_messing,
        sui_gas_per_day,
        sui_gas_25_percent,
        tea_bar_mcs,
        dining_hall_charges,
        swpr,
        laundry,
        gar_mess,
        room_maint,
        elec_charges_160_block,
        internet,
        svc_charges,
        sui_gas_boqs,
        sui_gas_166_cd,
        sui_gas_166_block,
        lounge_160,
        rent_charges,
        fur_maint,
        sui_gas_elec_fts,
        mat_charges,
        hc_wa,
        gym,
        cafe_maint_charges,
        dine_out,
        payamber,
        student_societies_fund,
        dinner_ni_jscmcc_69,
        current_bill,
        arrear,
        receipt_no,
        amount_received,
        gTotal,
        balAmount,
      ]
    );

    if (!result || result.length === 0) {
      return res.status(500).json({ message: "Bill creation failed" });
    }

    res
      .status(201)
      .json({ message: "Bill created successfully", bill: result[0] });
  } catch (err) {
    console.error("Error in createBill:", err);

    // Handle unique constraint violation (PostgreSQL error code 23505)
    if (err.code === "23505") {
      return res
        .status(400)
        .json({ message: "Bill with this CMS ID already exists" });
    }

    res
      .status(500)
      .json({ message: "Error creating bill", error: err.message });
  }
};

// Get all bills
const getBills = async (req, res) => {
  try {
    const bills = await queryDb("SELECT * FROM bill ORDER BY id DESC");

    if (!bills || bills.length === 0) {
      return res.status(404).json({ message: "No bills found" });
    }

    res.status(200).json({ message: "Bills retrieved successfully", bills });
  } catch (error) {
    console.error("Error fetching bills:", error);
    res
      .status(500)
      .json({ message: "Error fetching bills", error: error.message });
  }
};

// Get bill by ID
const getBillById = async (req, res) => {
  try {
    const { id } = req.params;
    const bill = await queryDb("SELECT * FROM bill WHERE id = $1", [id]);

    if (bill.rows.length === 0) {
      return res.status(404).json({ message: "Bill not found" });
    }

    res.json(bill.rows[0]);
  } catch (error) {
    console.error("Error fetching bill:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update bill
const updateBill = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    console.log("Request Body:", updates); // Debugging step
    console.log("Bill ID:", id);

    // Ensure the ID and at least one field are provided
    if (!id) {
      return res.status(400).json({ message: "Bill ID is required" });
    }

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No fields provided for update" });
    }

    // Build the dynamic update query
    const fields = Object.keys(updates).map(
      (key, index) => `${key} = $${index + 1}`
    );
    const values = Object.values(updates);

    // Add ID at the end for the WHERE clause
    values.push(id);

    console.log("Fields to update:", fields);
    console.log("Values:", values);

    // Execute the update query
    const result = await queryDb(
      `UPDATE bill 
       SET ${fields.join(", ")}
       WHERE id = $${values.length} 
       RETURNING *`,
      values
    );

    console.log("Query Result:", result);

    if (!result || result.length === 0) {
      return res.status(404).json({ message: "Bill not found or not updated" });
    }

    res
      .status(200)
      .json({ message: "Bill updated successfully", bill: result[0] });
  } catch (err) {
    console.error("Error updating bill:", err);
    res
      .status(500)
      .json({ message: "Error updating bill", error: err.message });
  }
};

// Delete bill
const deleteBill = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("Bill ID to delete:", id); // Debugging step

    // Ensure the ID is provided
    if (!id) {
      return res.status(400).json({ message: "Bill ID is required" });
    }

    // Execute the delete query
    const result = await queryDb("DELETE FROM bill WHERE id = $1 RETURNING *", [
      id,
    ]);

    console.log("Query Result:", result);

    // Check if the bill was found and deleted
    if (!result || result.length === 0) {
      return res
        .status(404)
        .json({ message: "Bill not found or already deleted" });
    }

    res
      .status(200)
      .json({ message: "Bill deleted successfully", deletedBill: result[0] });
  } catch (err) {
    console.error("Error deleting bill:", err);
    res
      .status(500)
      .json({ message: "Error deleting bill", error: err.message });
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
