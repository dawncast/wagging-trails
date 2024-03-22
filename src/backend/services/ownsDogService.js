import pool from "./databaseService.js";

async function fetchDogsFromDB() {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM Owns_Dog");
    client.release();
    return result.rows;
  } catch (error) {
    console.error("Error fetching dogs from the database:", error);
    throw error;
  }
}

async function insertDog(ownerID, name, breed, birthday) {
  let client;
  try {
    client = await pool.connect();

    // Start transaction
    await client.query("BEGIN");

    const dogInsertQuery =
      "INSERT INTO Owns_Dog (ownerID, name, breed) VALUES ($1, $2, $3) RETURNING dogID";
    const dogInsertValues = [ownerID, name, breed];
    const dogResult = await client.query(dogInsertQuery, dogInsertValues);
    const dogID = dogResult.rows[0].dogid;

    const dateInsertQuery =
      "INSERT INTO Owns_Dog_Birthday (dogID, ownerID, name, birthday) VALUES ($1, $2, $3, $4)";
    const dateInsertValues = [dogID, ownerID, name, birthday];
    await client.query(dateInsertQuery, dateInsertValues);

    // Commit the transaction
    await client.query("COMMIT");
    return true;
  } catch (error) {
    // Rollback the transaction in case of error
    await client.query("ROLLBACK");
    console.error("Error inserting dog:", error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
}





export { fetchDogsFromDB, insertDog, updateOwnerForDog };
