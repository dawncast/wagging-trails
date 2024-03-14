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

export { walkSetup, checkWalkTableExists };
