require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL Connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Test API
app.get("/", (req, res) => {
  res.send("API is working!");
  console.log("Database Password:", process.env.DB_PASSWORD);

});

// Test Database Connection
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ message: "Connected to DB!", timestamp: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database connection failed", error });
  }
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
