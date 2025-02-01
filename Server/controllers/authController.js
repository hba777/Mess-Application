const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db/db.js");

const loginAdmin = async (req, res) => {
  try {
    const { cmsid, password } = req.body;

    // Check if cmsid exists in the database
    const userQuery = "SELECT * FROM admin WHERE cmsid = $1";
    const user = await pool.query(userQuery, [cmsid]);

    if (user.rows.length === 0) {
      return res.status(400).json({ message: "Invalid CMS ID or password" });
    }

    // Compare the password with the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(
      password,
      user.rows[0].password
    );
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid CMS ID or password" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user.rows[0].id, cmsid: user.rows[0].cmsid },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1h" }
    );

    // Send response with token
    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  loginAdmin,
};
