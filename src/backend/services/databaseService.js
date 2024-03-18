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

/**
 * Initializes all normalized tables and enum types.
 * Note that this will drop all your existing tables
 * to have a fresh set of tables. So save your db if
 * you need to.
 *
 * @returns true or error message.
 */
export async function initiateDB() {
  const createEnumTypes = [
    // create enum types
    "event_type AS ENUM('walk', 'run', 'hike', 'dog park')",
    "rate_score AS ENUM('1', '2', '3', '4', '5')",
  ];

  const dropEnumTypes = ["event_type", "rate_score"];

  const createTableQueries = [
    // owner tables
    "Owner (ownerID SERIAL PRIMARY KEY, email VARCHAR(255) UNIQUE NOT NULL)",
    "Owner_Name (ownerID INTEGER PRIMARY KEY, firstName VARCHAR(255) NOT NULL, lastName VARCHAR(255) NOT NULL, FOREIGN KEY (ownerID) REFERENCES Owner (ownerID) ON DELETE CASCADE)",
    "Owner_Contact (email VARCHAR(255) PRIMARY KEY, phoneNumber VARCHAR(255) UNIQUE, FOREIGN KEY (email) REFERENCES Owner (email) ON DELETE CASCADE ON UPDATE CASCADE)",

    // friendship table
    "Friendship (ownerID1 INTEGER, ownerID2 INTEGER, dateOfFriendship DATE NOT NULL, PRIMARY KEY(ownerID1, ownerID2), FOREIGN KEY (ownerID1) REFERENCES Owner (ownerID) ON DELETE CASCADE ON UPDATE CASCADE, FOREIGN KEY (ownerID2) REFERENCES Owner (ownerID) ON DELETE CASCADE ON UPDATE CASCADE)",

    // notification table
    "Receives_Notifications (notificationID SERIAL PRIMARY KEY, ownerID INTEGER NOT NULL, notifContent VARCHAR(255), FOREIGN KEY (ownerID) REFERENCES Owner (ownerID) ON DELETE CASCADE ON UPDATE CASCADE)",

    // friend post tables
    "FriendPost_Link (notificationID INTEGER PRIMARY KEY, postLink VARCHAR(255) UNIQUE NOT NULL, FOREIGN KEY (notificationID) REFERENCES Receives_Notifications (notificationID) ON DELETE CASCADE)",
    "FriendPost_Name (postLink VARCHAR(255) PRIMARY KEY, friendName VARCHAR(255) NOT NULL, FOREIGN KEY (postLink) REFERENCES FriendPost_Link (postLink) ON DELETE CASCADE)",

    // walk alert tables
    "WalkAlert (notificationID INTEGER PRIMARY KEY, dogName VARCHAR(255) NOT NULL, FOREIGN KEY (notificationID) REFERENCES Receives_Notifications (notificationID) ON DELETE CASCADE)",

    // organizes walk task tables
    "Organizes_WalkTask (taskID SERIAL PRIMARY KEY, ownerID INTEGER NOT NULL, date DATE, walkEventType event_type, FOREIGN KEY (ownerID) REFERENCES Owner (ownerID) ON DELETE NO ACTION ON UPDATE CASCADE)",

    // log table
    "Logs (notificationID INTEGER, taskID INTEGER, PRIMARY KEY (notificationID, taskID), FOREIGN KEY (notificationID) REFERENCES Receives_Notifications (notificationID) ON DELETE CASCADE, FOREIGN KEY (taskID) REFERENCES Organizes_WalkTask (taskID) ON DELETE CASCADE)",

    // dog tables
    "Owns_Dog (dogID SERIAL PRIMARY KEY, ownerID INTEGER NOT NULL, name VARCHAR(255), breed VARCHAR(255), UNIQUE (name, ownerID, breed), FOREIGN KEY (ownerID) REFERENCES Owner (ownerID) ON DELETE NO ACTION ON UPDATE CASCADE)",
    "Owns_Dog_Birthday (dogID INTEGER PRIMARY KEY, ownerID INTEGER NOT NULL, name VARCHAR(255), birthday DATE, UNIQUE (name, ownerID, birthday), FOREIGN KEY (dogID) REFERENCES Owns_Dog (dogID) ON DELETE CASCADE, FOREIGN KEY (ownerID) REFERENCES Owner (ownerID) ON DELETE NO ACTION ON UPDATE CASCADE)",

    // walk tables
    "Walk (walkID SERIAL PRIMARY KEY, location VARCHAR(255) NOT NULL)",
    "Walk_Date (walkID INTEGER PRIMARY KEY, date DATE, FOREIGN KEY (walkID) REFERENCES Walk (walkID) ON DELETE CASCADE)",
    "Walk_Dist (walkID INTEGER PRIMARY KEY, distance FLOAT, FOREIGN KEY (walkID) REFERENCES Walk (walkID) ON DELETE CASCADE)",

    // went for table (dog-walk relationship)
    "WentFor (dogID INTEGER, walkID INTEGER, rating rate_score, PRIMARY KEY (dogID, walkID), FOREIGN KEY (dogID) REFERENCES Owns_Dog (dogID) ON DELETE CASCADE, FOREIGN KEY (walkID) REFERENCES Walk (walkID) ON DELETE CASCADE)",

    // post walk tables
    "Post_Walk (postID SERIAL PRIMARY KEY, walkID INTEGER UNIQUE NOT NULL, FOREIGN KEY (walkID) REFERENCES Walk (walkID) ON DELETE CASCADE ON UPDATE CASCADE)",
    "Post_Walk_Content (postID INTEGER PRIMARY KEY, content VARCHAR(255), FOREIGN KEY (postID) REFERENCES Post_Walk (postID) ON DELETE CASCADE)",
    "Post_Walk_Tag (postID INTEGER, tag VARCHAR(255), PRIMARY KEY (postID, tag), FOREIGN KEY (postID) REFERENCES Post_Walk (postID) ON DELETE CASCADE)",

    // meet up table
    "On_MeetUp (meetUpID SERIAL PRIMARY KEY, walkID INTEGER NOT NULL, time TIME, location VARCHAR(255), date DATE, FOREIGN KEY (walkID) REFERENCES Walk (walkID) ON DELETE NO ACTION ON UPDATE CASCADE)",

    // schedule table
    "Schedules (meetUpID INTEGER, ownerID INTEGER, PRIMARY KEY (meetUpID, ownerID), FOREIGN KEY (meetUpID) REFERENCES On_MeetUp (meetUpID), FOREIGN KEY (ownerID) REFERENCES Owner (ownerID) ON DELETE NO ACTION ON UPDATE CASCADE)",

    // post media tables
    "Post_Media (postID INTEGER, mediaID SERIAL UNIQUE, url VARCHAR(255) UNIQUE NOT NULL, PRIMARY KEY (postID, mediaID), FOREIGN KEY (postID) REFERENCES Post_Walk (postID) ON DELETE CASCADE)",
    "Post_Media_Date (url VARCHAR(255) PRIMARY KEY, dateCreated DATE, FOREIGN KEY (url) REFERENCES Post_Media (url) ON DELETE CASCADE)",

    // video table
    "Video (mediaID INTEGER PRIMARY KEY, duration TIME, FOREIGN KEY (mediaID) REFERENCES Post_Media (mediaID) ON DELETE CASCADE)",

    // photo table
    "Photo (mediaID INTEGER PRIMARY KEY, filter VARCHAR(255), FOREIGN KEY (mediaID) REFERENCES Post_Media (mediaID) ON DELETE CASCADE)",

    // tagged in table
    "TaggedIn (dogID INTEGER, postID INTEGER, PRIMARY KEY (dogID, postID), FOREIGN KEY (dogID) REFERENCES Owns_Dog (dogID), FOREIGN KEY (postID) REFERENCES Post_Walk (postID))",
  ];

  // Add the table names tht should be dropped. Should be the same tables on createTableQueries.
  const dropTables = [
    "TaggedIn",
    "Photo",
    "Video",
    "Post_Media_Date",
    "Post_Media",
    "Schedules",
    "On_MeetUp",
    "Post_Walk_Tag",
    "Post_Walk_Content",
    "Post_Walk",
    "WentFor",
    "Walk_Dist",
    "Walk_Date",
    "Walk",
    "Owns_Dog_Birthday",
    "Owns_Dog",
    "Logs",
    "Organizes_WalkTask",
    "WalkAlert",
    "FriendPost_Name",
    "FriendPost_Link",
    "Receives_Notifications",
    "Friendship",
    "Owner_Name",
    "Owner_Contact",
    "Owner",
  ]; // Make sure the order is Dependent->Source. Remove tables that depends on another table.

  try {
    const client = await pool.connect();

    for (const table of dropTables) {
      await client.query(`DROP TABLE IF EXISTS ${table} CASCADE`);
    }

    for (const enumQuery of dropEnumTypes) {
      await client.query(`DROP TYPE IF EXISTS ${enumQuery}`);
    }

    for (const enumQuery of createEnumTypes) {
      await client.query(`CREATE TYPE ${enumQuery}`);
    }

    for (const query of createTableQueries) {
      await client.query(`CREATE TABLE IF NOT EXISTS ${query}`);
    }
    client.release();
    return true;
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}

export default pool;
