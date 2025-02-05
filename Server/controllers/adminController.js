const bcrypt = require("bcrypt");
const { queryDb } = require("../config/db"); // Import the queryDb function

// Login Admin
const loginAdmin = async (req, res) => {
  const { cmsid, password } = req.body;

  try {
    // Query the database for the admin with the given cmsid
    const result = await queryDb("SELECT * FROM admin WHERE cmsid = $1", [
      cmsid,
    ]);

    if (!result || result.length === 0) {
      return res.status(401).json({ message: "Invalid CMS ID or password" });
    }

    const admin = result[0]; // Assuming you get the admin data from the first entry

    // Compare the raw password from the request with the stored password in the database
    if (password !== admin.password) {
      return res.status(401).json({ message: "Invalid CMS ID or password" });
    }

    // Login success, return token or success message (you can include a JWT here)
    res.status(200).json({ message: "Login successful", admin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Users (Admin Only)
const getUsers = async (req, res) => {
  try {
    // Query the database to fetch all users
    const users = await queryDb("SELECT * FROM user", []);
    res.json(users);
  } catch (err) {
    console.error("Error in getUsers:", err);
    res.status(500).json({ message: "Error fetching users", error: err });
  }
};

// Create User (Admin Only)
const createUser = async (req, res) => {
  const {
    CMIS_id,
    name,
    department,
    rank,
    Pma_course,
    degree,
    phone_number,
    pending_bill_id,
  } = req.body;

  try {
    const query = `
      INSERT INTO user (CMIS_id, name, department, rank, Pma_course, degree, phone_number, pending_bill_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;

    const user = await queryDb(query, [
      CMIS_id,
      name,
      department,
      rank,
      Pma_course,
      degree,
      phone_number,
      pending_bill_id,
    ]);

    res.status(201).json(user[0]); // Return the created user
  } catch (err) {
    console.error("Error in createUser:", err);
    res.status(500).json({ message: "Error creating user", error: err });
  }
};

// Update User (Admin Only)
const updateUser = async (req, res) => {
  const { CMIS_id } = req.params;
  const {
    name,
    department,
    rank,
    Pma_course,
    degree,
    phone_number,
    pending_bill_id,
  } = req.body;

  try {
    const query = `
      UPDATE user SET name = $1, department = $2, rank = $3, Pma_course = $4, degree = $5, phone_number = $6, pending_bill_id = $7
      WHERE CMIS_id = $8 RETURNING *`;

    const result = await queryDb(query, [
      name,
      department,
      rank,
      Pma_course,
      degree,
      phone_number,
      pending_bill_id,
      CMIS_id,
    ]);

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result[0]); // Return the updated user
  } catch (err) {
    console.error("Error in updateUser:", err);
    res.status(500).json({ message: "Error updating user", error: err });
  }
};

// Delete User (Admin Only)
const deleteUser = async (req, res) => {
  const { CMIS_id } = req.params;

  try {
    const query = "DELETE FROM user WHERE CMIS_id = $1 RETURNING *";
    const result = await queryDb(query, [CMIS_id]);

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error in deleteUser:", err);
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
