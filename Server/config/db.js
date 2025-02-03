// config/db.js

require("dotenv").config();
const { Client } = require("pg"); // For Local PostgreSQL
const { createClient } = require("@supabase/supabase-js"); // For Supabase

let dbClient;

if (process.env.USE_SUPABASE === "true") {
  // Connecting to Supabase
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
  dbClient = createClient(supabaseUrl, supabaseAnonKey);
  console.log("🔗 Connected to Supabase.");
} else {
  // Connecting to Local PostgreSQL
  const localDbUrl = process.env.LOCAL_DATABASE_URL;
  dbClient = new Client({
    connectionString: localDbUrl,
  });
  console.log("🔗 Connected to Local PostgreSQL.");
}

const connectDb = async () => {
  if (process.env.USE_SUPABASE !== "true") {
    try {
      await dbClient.connect();
      console.log("🔗 Database connected successfully.");
    } catch (error) {
      console.error("❌ Database connection failed:", error);
      process.exit(1); // Exit process if DB connection fails
    }
  }
};

const closeDb = async () => {
  if (process.env.USE_SUPABASE !== "true") {
    await dbClient.end();
    console.log("🛑 PostgreSQL connection closed.");
  }
};

module.exports = { dbClient, connectDb, closeDb };
