const jwt = require("jsonwebtoken");
const { queryDb } = require("../config/db"); // Import the queryDb function

// Middleware to authenticate JWT and attach user info to request object
const authenticateJWT = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Expecting "Bearer <token>"

  if (!token) {
    return res
      .status(403)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user data from JWT payload to the request object
    next();
  } catch (err) {
    console.error("JWT Authentication error:", err);
    return res.status(400).json({ message: "Invalid or expired token." });
  }
};

// Middleware to check if the user is an Admin
const isAdmin = async (req, res, next) => {
  const cmsid = req.user.cmsid; // Extract CMS ID from decoded JWT payload

  try {
    // Query the admin table to check if the user exists
    const admin = await queryDb("SELECT * FROM admin WHERE cmsid = $1", [
      cmsid,
    ]);

    if (!admin || admin.length === 0) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    next(); // User is an admin, proceed to the next middleware or route handler
  } catch (err) {
    console.error("Error in isAdmin middleware:", err);
    return res.status(500).json({
      message: "Server error while checking admin status.",
      error: err,
    });
  }
};

// Middleware to check if the user is a regular user
const isUser = async (req, res, next) => {
  const cmsid = req.user.cmsid; // Extract CMS ID from decoded JWT payload

  try {
    const user = await queryDb("SELECT * FROM users WHERE cmsid = $1", [cmsid]);

    if (!user || user.length === 0) {
      return res.status(403).json({ message: "Access denied. Users only." });
    }

    next(); // User exists, proceed to the next middleware or route handler
  } catch (err) {
    console.error("Error in isUser middleware:", err);
    return res.status(500).json({
      message: "Server error while checking user status.",
      error: err,
    });
  }
};

module.exports = { authenticateJWT, isAdmin, isUser };
