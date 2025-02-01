const { Pool } = require("pg");
require("dotenv").config();

// Database connection pool
const pool = new Pool({
  host: "localhost", // Database host
  port: 5432, // PostgreSQL port
  user: "youruser", // Database username
  password: "yourpassword", // Database password
  database: "yourdatabase", // Database name
});

// Function to connect to the database
async function connectDB() {
  try {
    await pool.connect();
    console.log("Connected to the database successfully.");
  } catch (err) {
    console.error("Database connection error:", err);
  }
}

module.exports = {
  pool,
  connectDB,
};
