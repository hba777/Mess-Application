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
  const userId = req.user.id; // User ID from decoded JWT payload

  try {
    // Query the database to find the user and check if they have the 'admin' role
    const user = await queryDb("SELECT * FROM admin WHERE cmsid = $1", [
      userId,
    ]);

    if (!user || user.length === 0) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // Check if the user is an admin (assuming the "admin" field or logic based on your requirements)
    if (user[0].role !== "admin") {
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

module.exports = { authenticateJWT, isAdmin };
