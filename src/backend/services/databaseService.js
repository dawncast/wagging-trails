import mysql from "mysql";
import dotenv from "dotenv";
dotenv.config();

console.log(mysql);

const dbConfig = {
  host: "localhost",
  user: process.env.USER,
  password: process.env.PASS,
  database: process.env.DATABASE,
  connectionLimit: 3,
  connectTimeout: 60 * 1000,
  multipleStatements: true,
  port: 3306,
};

const pool = mysql.createPool(dbConfig);

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Initialization error: " + err.message);
    return;
  }
  console.log("Connection pool started");
  connection.release();
});

function closePoolAndExit() {
  console.log("\nTerminating pool");
  pool.end((err) => {
    if (err) {
      console.error("Error on closing pool: " + err.message);
      process.exit(1);
    }
    console.log("Pool closed");
    process.exit(0);
  });
}

process.once("SIGTERM", closePoolAndExit).once("SIGINT", closePoolAndExit);

export default pool;
