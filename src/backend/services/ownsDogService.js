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
    console.log(ownerID);

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

async function updateOwnerForDog(ownerIDNew, dogID) {
  try {

    const client = await pool.connect();
    await client.query("BEGIN");
    const query1 =
      "UPDATE owns_dog SET ownerid = $1 WHERE dogID = $2";
    const values = [ownerIDNew, dogID];
    await client.query(query1, values);

    const query2 =
      "UPDATE owns_dog_birthday SET ownerid =$1 WHERE dogID = $2";
      const bday_values = [ownerIDNew, dogID];
      await client.query(query2, bday_values);

    await client.query("COMMIT");
    return true;
  } catch (error) {
    console.error("Error updating dog owner:", error);
    throw error;
  }
}

async function deleteDog(dogID) {
  let client;
  try{
    client = await pool.connect();

    await client.query("BEGIN");

    const deleteDogQuery1=
    "DELETE from owns_dog WHERE dogid = $1";
    const deleteDogValues1 = [dogID];
    await client.query(deleteDogQuery1, deleteDogValues1);

    await client.query("COMMIT");
    return true;
  } catch (error) {
    // Rollback the transaction in case of error
    await client.query("ROLLBACK");
    console.error("Error deleting dog:", error);
    throw error;
  } finally {
    if (client) {
    client.release();
    }
  }
}








export { fetchDogsFromDB, insertDog, updateOwnerForDog, deleteDog };
