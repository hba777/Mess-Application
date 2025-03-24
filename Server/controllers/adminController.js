const bcrypt = require("bcrypt");
const { generateToken } = require("../config/passport");
const { queryDb } = require("../config/db");

// Login Admin
const loginAdmin = async (req, res) => {
  const { cmsid, password } = req.body;

  try {
    const result = await queryDb("SELECT * FROM admin WHERE cmsid = $1", [
      cmsid,
    ]);

    if (!result || result.length === 0 || result[0].password !== password) {
      return res.status(401).json({ message: "Invalid User ID or password" });
    }

    const admin = result[0];
    const token = generateToken(admin); // Generate JWT

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error("Error in loginAdmin:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Users (Admin Only)
const getUsers = async (req, res) => {
  try {
    const users = await queryDb("SELECT * FROM users");
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    res.json(users);
  } catch (err) {
    console.error("Error in getUsers:", err);
    res.status(500).json({ message: "Error fetching users", error: err });
  }
};

const createUser = async (req, res) => {
  try {
    const { cms_id, password, phone_number, link_id, is_clerk } = req.body;

    // Validate required fields
    if (!cms_id || !phone_number) {
      return res.status(400).json({
        message: "cms_id and phone_number are required",
      });
    }

    const isClerk = Boolean(is_clerk); // Ensure boolean type

    // If is_clerk is true, password is required
    if (isClerk && !password) {
      return res.status(400).json({
        message: "Password is required for clerks",
      });
    }

    let hashedPassword = null;

    // Hash password only if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    // Ensure password is null for non-clerks to satisfy the CHECK constraint
    if (!isClerk) {
      hashedPassword = null;
    }

    // Prepare query to insert user
    const query = `
      INSERT INTO users (cms_id, password, phone_number, link_id, is_clerk) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING cms_id, phone_number, link_id, is_clerk
    `;
    const values = [cms_id, hashedPassword, phone_number, link_id, isClerk];

    // Insert new user into the database
    const result = await queryDb(query, values);

    if (!result || result.length === 0) {
      return res.status(500).json({ message: "User creation failed" });
    }

    res
      .status(201)
      .json({ message: "User created successfully", user: result[0] });
  } catch (err) {
    console.error("Error in createUser:", err);

    // Handle unique constraint violation (PostgreSQL error code 23505)
    if (err.code === "23505") {
      return res
        .status(400)
        .json({ message: "CMS ID or Link ID already exists" });
    }

    res
      .status(500)
      .json({ message: "Error creating user", error: err.message });
  }
};

// Update User (Admin Only)
const updateUser = async (req, res) => {
  const { cms_id } = req.params;
  const updates = req.body;

  try {
    const fields = Object.keys(updates).map(
      (key, index) => `"${key}" = $${index + 1}`
    );
    const values = Object.values(updates);

    const query = `UPDATE users SET ${fields.join(", ")} WHERE "cms_id" = $${
      values.length + 1
    } RETURNING *`;

    const result = await queryDb(query, [...values, cms_id]);

    if (!result || result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated successfully", user: result[0] });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete User (Admin Only)
const deleteUser = async (req, res) => {
  const { cms_id } = req.params;

  try {
    const result = await queryDb(
      "DELETE FROM users WHERE cms_id = $1 RETURNING *",
      [cms_id]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user", error: err });
  }
};

const getTotalUsers = async (req, res) => {
  try {
    const result = await queryDb("SELECT get_total_users() AS total_users");
    res.json({ total_users: result[0].total_users });
  } catch (err) {
    console.error("Error in getTotalUsers:", err);
    res.status(500).json({ message: "Error fetching total users" });
  }
};

const getTotalPendingBills = async (req, res) => {
  try {
    const result = await queryDb(
      "SELECT get_total_pending_bills() AS total_pending"
    );
    res.json({ total_pending: result[0].total_pending });
  } catch (err) {
    console.error("Error in getTotalPendingBills:", err);
    res.status(500).json({ message: "Error fetching total pending bills" });
  }
};

const getTotalPaidBills = async (req, res) => {
  try {
    const result = await queryDb("SELECT get_total_paid_bills() AS total_paid");
    res.json({ total_paid: result[0].total_paid });
  } catch (err) {
    console.error("Error in getTotalPaidBills:", err);
    res.status(500).json({ message: "Error fetching total paid bills" });
  }
};

const getTotalUsersWhoPaid = async (req, res) => {
  try {
    const result = await queryDb(
      "SELECT get_total_users_who_paid() AS total_users_paid"
    );
    res.json({ total_users_paid: result[0].total_users_paid });
  } catch (err) {
    console.error("Error in getTotalUsersWhoPaid:", err);
    res.status(500).json({ message: "Error fetching total users who paid" });
  }
};

module.exports = {
  loginAdmin,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getTotalUsers,
  getTotalPendingBills,
  getTotalPaidBills,
  getTotalUsersWhoPaid,
};
