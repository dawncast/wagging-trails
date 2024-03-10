import path from "path";
import dotenv from "dotenv";
import pg from "pg";

const { Pool } = pg;
dotenv.config();

// Database connection configuration
const dbConfig = {
  user: process.env.USER,
  password: process.env.PASSWORD,
  host: process.env.HOST,
  port: process.env.PORT,
  database: process.env.DATABASE,
};

// Create a new PostgreSQL client
const pool = new Pool(dbConfig);

pool.connect(async (err, client, release) => {
  if (err) {
    console.error("Error connecting to PostgreSQL server: ", err.message);
    return;
  }
  console.log("Pool connected.");
  try {
    const { rows } = await client.query("SELECT current_user");
    const currentUser = rows[0]["current_user"];
    console.log("Current user:", currentUser);
  } catch (err) {
    console.error("Error executing query", err);
  } finally {
    release();
  }
});

function closePoolAndExit() {
  console.log("\nTerminating pool...");
  pool.end((err) => {
    if (err) {
      console.error("Error on closing pool: ", err.message);
      process.exit(1);
    }
    console.log("Pool closed.");
    process.exit(0);
  });
}

// Close the pool when the Node.js process terminates
process.once("SIGTERM", closePoolAndExit).once("SIGINT", closePoolAndExit);

export default pool;

// this function was merged to pool connection test.
// (async () => {
//   try {
//     const { rows } = await pool.query("SELECT current_user");
//     const currentUser = rows[0]["current_user"];
//     console.log("Current user:", currentUser);
//   } catch (err) {
//     console.error("Error executing query", err);
//   }
// })();
