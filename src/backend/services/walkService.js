import pool from "./databaseService.js";

async function walkSetup() {
  try {
    // use this if there is a dependency.
    // const dependencyTableExist = await dependencyTableExists();
    // if (!dependencyTableExist) await dependencySetup();

    const validity = await initiateWalk();
    return validity;
  } catch (error) {
    console.error("Error setting up Walk:", error);
    throw error;
  }
}

/**
 * Initializes three normalized, walk tables.
 * Drops existing tables to have a fresh set of tables.
 *
 * @returns true or error message.
 */
async function initiateWalk() {
  // Add the tables you want to create.
  const createTableQueries = [
    "Walk (walkID SERIAL PRIMARY KEY, location VARCHAR(255) NOT NULL)",
    "Walk_Date (walkID INTEGER PRIMARY KEY, date DATE, FOREIGN KEY (walkID) REFERENCES Walk (walkID) ON DELETE CASCADE)",
    "Walk_Dist (walkID INTEGER PRIMARY KEY, distance FLOAT, FOREIGN KEY (walkID) REFERENCES Walk (walkID) ON DELETE CASCADE)",
  ];

  // Add the table names tht should be dropped. Should be the same tables on createTableQueries.
  const dropTables = ["Walk_Date", "Walk_Dist", "Walk"]; // Make sure the order is Dependent->Source. Remove tables that depends on another table.

  try {
    const client = await pool.connect();
    for (const table of dropTables) {
      await client.query(`DROP TABLE IF EXISTS ${table} CASCADE`);
    }
    for (const query of createTableQueries) {
      await client.query(`CREATE TABLE IF NOT EXISTS ${query}`);
    }
    client.release();
    return true;
  } catch (error) {
    console.error("Error initializing owners:", error);
    throw error;
  }
}

async function checkWalkTableExists() {
  try {
    const query = `
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_name = 'Walk'
      );
    `;

    const result = await pool.query(query);
    // result.rows[0].exists will be true if the table exists, otherwise false
    return result.rows[0].exists;
  } catch (error) {
    console.error("Error checking if Walk table exists:", error);
    throw error;
  }
}

async function insertWalk(location, date, distance) {
  let client;
  try {
    client = await pool.connect();

    // Start transaction
    await client.query("BEGIN");

    const walkInsertQuery =
      "INSERT INTO Walk (location) VALUES ($1) RETURNING walkID";
    const walkInsertValues = [location];
    const walkResult = await client.query(walkInsertQuery, walkInsertValues);
    const walkID = walkResult.rows[0].walkid;

    const dateInsertQuery =
      "INSERT INTO Walk_Date (walkID, date) VALUES ($1, $2)";
    const dateInsertValues = [walkID, date];
    await client.query(dateInsertQuery, dateInsertValues);

    const distInsertQuery =
      "INSERT INTO Walk_Dist (walkID, distance) VALUES ($1, $2)";
    const distInsertValues = [walkID, distance];
    await client.query(distInsertQuery, distInsertValues);

    // Commit the transaction
    await client.query("COMMIT");
    return true;
  } catch (error) {
    // Rollback the transaction in case of error
    await client.query("ROLLBACK");
    console.error("Error inserting walk:", error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
}

// should retrieve walkID, dogID, dogName, and date of walk.
// if postID is null, we can provide a chance for the owner to
// create the post for the said walk.
async function fetchAllWalks(ownerID) {
  try {
    const client = await pool.connect();
    const query = {
      text: `
      SELECT w.walkID, od.dogID, od.name, wd.date, wdi.distance, pw.postID
      FROM Walk w 
      JOIN WentFor wf ON w.walkID = wf.walkID
      JOIN Owns_Dog od ON wf.dogID = od.dogID
      LEFT JOIN Walk_Date wd ON w.walkID = wd.walkID
      LEFT JOIN Walk_Dist wdi ON w.walkID = wdi.walkID 
      LEFT JOIN Post_Walk pw ON w.walkID = pw.walkID
      WHERE od.ownerID = $1
      ORDER BY wd.date DESC NULLS LAST;
    `,
      values: [ownerID],
    };
    const result = await client.query(query);
    client.release();
    return result.rows;
  } catch (error) {
    console.error("Error fetching data for post from the database:", error);
    throw error;
  }
}

export { walkSetup, checkWalkTableExists, insertWalk, fetchAllWalks };
