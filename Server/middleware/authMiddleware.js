const passport = require("passport");
const { Strategy, ExtractJwt } = require("passport-jwt");
const jwt = require("jsonwebtoken");
const pool = require("../db");

// JWT Passport Strategy Setup
passport.use(
  new Strategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (jwt_payload, done) => {
      try {
        const user = await pool.query("SELECT * FROM admin WHERE id = $1", [
          jwt_payload.id,
        ]);
        if (user.rows.length === 0) {
          return done(null, false); // User not found
        }
        return done(null, user.rows[0]); // User found
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

// JWT Authentication Middleware (Passport)
const authenticateJWT = passport.authenticate("jwt", { session: false });

// Function to check if the user is an admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next(); // User is admin, proceed to the next route
  }
  return res.status(403).json({ message: "Forbidden: You are not an admin" });
};

module.exports = { authenticateJWT, isAdmin };
