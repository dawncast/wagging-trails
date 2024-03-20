import pool from "./databaseService.js";

async function insertWentFor(dogID, walkID, rating) {
  let client;
  try {
    client = await pool.connect();

    // Start transaction
    await client.query("BEGIN");

    const insertQuery =
      "INSERT INTO WentFor (dogID, walkID, rating) VALUES ($1, $2, $3)";
    const insertValues = [dogID, walkID, rating];
    await client.query(insertQuery, insertValues);

    // Commit the transaction
    await client.query("COMMIT");
    return true;
  } catch (error) {
    // Rollback the transaction in case of error
    await client.query("ROLLBACK");
    console.error("Error inserting wentFor:", error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
}

export { insertWentFor };
