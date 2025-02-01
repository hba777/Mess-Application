const { Pool } = require("pg");
require("dotenv").config();

// Create a connection pool to PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER, // DB username from .env
  host: process.env.DB_HOST, // DB host (localhost if running locally)
  database: process.env.DB_NAME, // Database name
  password: process.env.DB_PASS, // DB password
  port: process.env.DB_PORT, // DB port (5432 by default)
});

// Test the connection
pool.connect((err, client, release) => {
  if (err) {
    console.error("Database connection error:", err.stack);
  } else {
    console.log("Connected to the database");
  }
});

// Export the pool to use in other parts of the app
module.exports = pool;
