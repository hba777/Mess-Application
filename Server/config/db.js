require("dotenv").config();
const { Client } = require("pg"); // PostgreSQL client

// PostgreSQL connection settings
const localDbUrl = process.env.LOCAL_DATABASE_URL;
const dbClient = new Client({
  connectionString: localDbUrl,
});

// Connect to the database
const connectDb = async () => {
  try {
    await dbClient.connect();
    console.log("🔗 Connected to Local PostgreSQL.");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1); // Exit process if connection fails
  }
};

// Close the database connection
const closeDb = async () => {
  try {
    await dbClient.end();
    console.log("🛑 PostgreSQL connection closed.");
  } catch (error) {
    console.error("❌ Error closing database connection:", error);
  }
};

const queryDb = async (queryText, params = []) => {
  console.log("Executing Query:", queryText);
  console.log("With Params:", params);
  try {
    const result = await dbClient.query(queryText, params);
    console.log("Query Result:", result.rows); // Log query result
    return result.rows;
  } catch (error) {
    console.error("❌ Error querying database:", error);
    throw error;
  }
};

module.exports = { dbClient, connectDb, closeDb, queryDb };
