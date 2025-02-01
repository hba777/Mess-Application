const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db"); // PostgreSQL connection

// Admin login
const loginAdmin = async (req, res) => {
  try {
    const { loginid, password } = req.body;

    // Find admin by loginid (since admin is the only user type)
    const admin = await pool.query("SELECT * FROM admin WHERE loginid = $1", [
      loginid,
    ]);

    if (admin.rows.length === 0) {
      return res.status(400).send("Invalid credentials");
    }

    // Compare passwords
    const validPassword = await bcrypt.compare(
      password,
      admin.rows[0].password
    );
    if (!validPassword) {
      return res.status(400).send("Invalid credentials");
    }

    // Create JWT token with the admin's id and role
    const token = jwt.sign(
      { id: admin.rows[0].id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

module.exports = { loginAdmin };
