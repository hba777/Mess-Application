const jwt = require("jsonwebtoken");
const { queryDb } = require("../config/db"); // Assuming queryDb is your DB query method

const loginAdmin = async (req, res) => {
  try {
    const { cmsid, password } = req.body;

    // Query to get the admin by cmsid
    const userQuery = "SELECT * FROM admin WHERE cmsid = $1";
    const result = await queryDb(userQuery, [cmsid]);

    // Check if the user was found
    if (result.length === 0) {
      return res.status(400).json({ message: "Invalid CMS ID or password" });
    }

    const user = result[0];

    // Compare the entered password directly with the stored password (no hashing)
    if (password !== user.password) {
      return res.status(400).json({ message: "Invalid CMS ID or password" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user.id, cmsid: user.cmsid },
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
