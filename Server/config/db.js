// config/db.js

require("dotenv").config();
const { Client } = require("pg"); // For Local PostgreSQL
const { createClient } = require("@supabase/supabase-js"); // For Supabase

let dbClient;

// Determine which database to use based on environment variable
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

// Connect to the database
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

// Close the database connection
const closeDb = async () => {
  if (process.env.USE_SUPABASE !== "true") {
    await dbClient.end();
    console.log("🛑 PostgreSQL connection closed.");
  }
};

// Query function for both Supabase and PostgreSQL
const queryDb = async (queryText, params = []) => {
  try {
    if (process.env.USE_SUPABASE === "true") {
      // Supabase query
      const { data, error } = await dbClient
        .from("admin")
        .select()
        .eq("cmsid", params[0]);
      if (error) throw new Error(error.message);
      return data; // Supabase returns 'data' on successful query
    } else {
      // PostgreSQL query
      const result = await dbClient.query(queryText, params);
      return result.rows; // PostgreSQL returns 'rows' in the result
    }
  } catch (error) {
    console.error("❌ Error querying database:", error);
    throw error; // Rethrow error for handling at higher levels
  }
};

module.exports = { dbClient, connectDb, closeDb, queryDb };
