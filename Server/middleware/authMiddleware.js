const jwt = require("jsonwebtoken");

// Middleware to authenticate JWT and attach user info
const authenticateJWT = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Expecting "Bearer <token>"

  if (!token) {
    return res
      .status(403)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user data (cms_id and role) from the token payload
    req.user = { cms_id: decoded.cms_id, role: decoded.role };
    next();
  } catch (err) {
    console.error("JWT Authentication error:", err);
    return res.status(400).json({ message: "Invalid or expired token." });
  }
};

// Middleware to check if the user is an Admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

module.exports = { authenticateJWT, isAdmin };
