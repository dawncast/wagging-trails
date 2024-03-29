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

export { fetchFromDB, fetchOwnerWalkTask };
