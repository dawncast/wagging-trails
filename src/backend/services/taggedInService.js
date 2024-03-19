import pool from "./databaseService.js";

async function insertTaggedDog(dogIDs, postID) {
  let client;
  try {
    client = await pool.connect();

    // Start transaction
    await client.query("BEGIN");

    // Insert tags using a loop
    for (const dog of dogIDs) {
      const tagInsertQuery =
        "INSERT INTO TaggedIn (dogID, postID) VALUES ($1, $2)";
      const tagInsertValues = [dog, postID];
      await client.query(tagInsertQuery, tagInsertValues);
    }

    // Commit the transaction
    await client.query("COMMIT");
    return true;
  } catch (error) {
    // Rollback the transaction in case of error
    await client.query("ROLLBACK");
    console.error("Error inserting tagged dogs:", error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
}

export { insertTaggedDog };
