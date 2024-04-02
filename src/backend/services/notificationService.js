import pool from "./databaseService.js";

async function fetchFromDB() {}

// should retrieve walkID, dogName, and date of walk.
async function fetchOwnerWalkTask(ownerID) {
  try {
    const client = await pool.connect();
    const query = {
      text: `
      SELECT owt.taskID, wa.dogName, owt.date, owt.walkeventtype
      FROM Organizes_WalkTask owt 
      JOIN Logs l ON owt.taskID = l.taskID
      JOIN WalkAlert wa ON l.notificationID = wa.notificationID
      WHERE owt.ownerID = $1
      ORDER BY owt.date DESC NULLS LAST;
    `,
      values: [ownerID],
    };
    const result = await client.query(query);
    client.release();
    return result.rows;
  } catch (error) {
    console.error("Error fetching data walk tasks from database:", error);
    throw error;
  }
}

async function insertWalkTask(
  ownerID,
  notifContent,
  dogName,
  date,
  walkeventtype
) {
  let client;
  try {
    client = await pool.connect();
    // Start transaction
    await client.query("BEGIN");

    const notifInsertQuery =
      "INSERT INTO Receives_Notifications (ownerID, notifContent) VALUES ($1, $2) RETURNING notificationID";
    const notifInsertValues = [ownerID, notifContent];
    const notifResult = await client.query(notifInsertQuery, notifInsertValues);
    const notificationID = notifResult.rows[0].notificationid;

    const walkAlertInsertQuery =
      "INSERT INTO walkalert (notificationID, dogName) VALUES ($1, $2)";
    const walkAlertInsertValues = [notificationID, dogName];
    await client.query(walkAlertInsertQuery, walkAlertInsertValues);

    const taskInsertQuery =
      "INSERT INTO organizes_walktask (ownerID, date, walkeventtype) VALUES ($1, $2, $3) RETURNING taskID";
    const taskInsertValues = [ownerID, date, walkeventtype];
    const taskResult = await client.query(taskInsertQuery, taskInsertValues);
    const taskID = taskResult.rows[0].taskid;

    const logsInsertQuery =
      "INSERT INTO logs (notificationID, taskID) VALUES ($1, $2)";
    const logsInsertValues = [notificationID, taskID];
    await client.query(logsInsertQuery, logsInsertValues);

    // Commit the transaction
    await client.query("COMMIT");
    return true;
  } catch (error) {
    // Rollback the transaction in case of error
    await client.query("ROLLBACK");
    console.error("Error inserting notification and walk tasks:", error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
}

export { fetchFromDB, fetchOwnerWalkTask, insertWalkTask };
