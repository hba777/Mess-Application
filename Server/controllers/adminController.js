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
    const { cms_id, password, phone_number } = req.body;

    // Validate required fields
    if (!cms_id || !password || !phone_number) {
      return res.status(400).json({
        message: "cms_id, password, and phone_number are required",
      });
    }

    // Hash the password before storing it in the database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Prepare query to insert user with cms_id, password, and phone_number
    const query = `INSERT INTO users (cms_id, password, phone_number) VALUES ($1, $2, $3) RETURNING cms_id, phone_number`;
    const values = [cms_id, hashedPassword, phone_number];

    // Insert new user into the database
    const result = await queryDb(query, values);

    if (!result || result.length === 0) {
      return res.status(500).json({ message: "User creation failed" });
    }

    res.status(201).json({
      message: "User created successfully",
      user: result[0],
    });
  } catch (err) {
    console.error("Error in createUser:", err);

    // Handle unique constraint violation (PostgreSQL error code 23505)
    if (err.code === "23505") {
      return res.status(400).json({ message: "User ID already exists" });
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

module.exports = {
  loginAdmin,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};
