const passport = require("passport");
const jwt = require("jsonwebtoken");
const { Strategy, ExtractJwt } = require("passport-jwt");
const queryDb = require("./db");

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || "your_secret_key", // Change this in production
};

// JWT Strategy for authentication
passport.use(
  new Strategy(opts, async (payload, done) => {
    try {
      const result = await queryDb("SELECT * FROM admin WHERE cmsid = $1", [
        payload.cmsid,
      ]);

      if (!result || result.length === 0) {
        return done(null, false);
      }

      return done(null, result[0]); // Admin found
    } catch (err) {
      return done(err, false);
    }
  })
);

// Function to generate JWT token
const generateToken = (userOrAdmin) => {
  const isAdmin = userOrAdmin.cmsid !== undefined; // Detects admin user
  const payload = isAdmin
    ? { cmsid: userOrAdmin.cmsid, role: "admin" } // Auto-set admin role
    : { cms_id: userOrAdmin.cms_id, name: userOrAdmin.name, role: "user" }; // Auto-set user role

  return jwt.sign(payload, process.env.JWT_SECRET || "your_secret_key", {
    expiresIn: "1h",
  });
};

module.exports = { passport, generateToken };
