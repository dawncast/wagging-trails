import pool from "./databaseService.js";
import { walkSetup, checkWalkTableExists } from "./walkService.js";

/**
 * setup are step functions that are for entities that have
 * not null foreign keys. This is a measure to initialize
 * tables in correct order.
 * @returns
 */
async function postWalkSetup() {
  try {
    const dependencyTableExist = await checkWalkTableExists();

    if (!dependencyTableExist) {
      await walkSetup();
    }

    const validity = await initiatePosts();
    return validity;
  } catch (error) {
    console.error("Error setting up Post_Walk:", error);
    throw error;
  }
}

// /**
//  * Initializes three normalized, post_walk tables.
//  * Drops existing tables to have a fresh set of tables.
//  *
//  * @returns true or error message.
//  */
// async function initiatePosts() {
//   // Add the tables you want to create.
//   const createTableQueries = [
//     "Post_Walk (postID SERIAL PRIMARY KEY, walkID INTEGER UNIQUE NOT NULL, FOREIGN KEY (walkID) REFERENCES Walk (walkID) ON DELETE CASCADE ON UPDATE CASCADE)",
//     "Post_Walk_Content (postID INTEGER PRIMARY KEY, content VARCHAR(255), FOREIGN KEY (postID) REFERENCES Post_Walk (postID) ON DELETE CASCADE)",
//     "Post_Walk_Tag (postID INTEGER PRIMARY KEY, tag VARCHAR(255), FOREIGN KEY (postID) REFERENCES Post_Walk (postID) ON DELETE CASCADE)",
//   ];

//   // Add the table names that should be dropped. Should be the same tables on createTableQueries.
//   const dropTables = ["Post_Walk_Content", "Post_Walk_Tag", "Post_Walk"]; // Make sure the order is Dependent->Source. Remove tables that depends on another table.

//   try {
//     const client = await pool.connect();
//     for (const table of dropTables) {
//       await client.query(`DROP TABLE IF EXISTS ${table}`);
//     }
//     for (const query of createTableQueries) {
//       await client.query(`CREATE TABLE IF NOT EXISTS ${query}`);
//     }
//     client.release();
//     return true;
//   } catch (error) {
//     console.error("Error initializing owners:", error);
//     throw error;
//   }
// }

async function insertPost(walkID, ownerID, content, tags) {
  let client;
  try {
    client = await pool.connect();

    // Start transaction
    await client.query("BEGIN");

    const postInsertQuery =
      "INSERT INTO Post_Walk (walkID) VALUES ($1) RETURNING postID";
    const postInsertValues = [walkID];
    const postResult = await client.query(postInsertQuery, postInsertValues);
    const postID = postResult.rows[0].postid;

    const ownerInsertQuery =
      "INSERT INTO Post_Walk_Owner (postID, ownerID) VALUES ($1, $2)";
    const ownerInsertValues = [postID, ownerID];
    await client.query(ownerInsertQuery, ownerInsertValues);

    const contentInsertQuery =
      "INSERT INTO Post_Walk_Content (postID, content) VALUES ($1, $2)";
    const contentInsertValues = [postID, content];
    await client.query(contentInsertQuery, contentInsertValues);

    // Insert tags using a loop
    for (const tag of tags) {
      const tagInsertQuery =
        "INSERT INTO Post_Walk_Tag (postID, tag) VALUES ($1, $2)";
      const tagInsertValues = [postID, tag];
      await client.query(tagInsertQuery, tagInsertValues);
    }

    // Commit the transaction
    await client.query("COMMIT");
    return true;
  } catch (error) {
    // Rollback the transaction in case of error
    await client.query("ROLLBACK");
    console.error("Error inserting post:", error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
}

/**
 * Fetches data from Owns_Dog(dogID, ownerID*), WentFor(dogID*, walkID*).
 * On_Meetup(meetupID, walkID*), TaggedIn(dogID*, postID*),
 * Post_Walk(content, tag) and Post_Media(postID*)
 *
 * To get:
 * - photo or video
 * - location
 * - date
 * - type (walk or meetup)
 * - post content
 * - tag
 *
 * @returns results
 */
// insert ownsdog, walk, postwalk, owner, wentfor done. Testing phase now.
async function fetchDataForPostPage(postID, ownerID) {
  try {
    const client = await pool.connect();
    const query = `
    SELECT 
          pw.postID,
          array_agg(DISTINCT od.name) AS dogs,
          own.ownerID,
          CONCAT(own.firstName, ' ', own.lastName) AS owner_name,
          pwc.content,
          w.location,
          wd.date,
          wdi.distance,
          omu.time,
          pm.url,
          array_agg(DISTINCT CASE WHEN od1.dogID <> od.dogID THEN od1.name END) AS tagged_dogs,
          array_agg(DISTINCT CASE WHEN own1.ownerID <> own.ownerID THEN CONCAT(own1.firstName, ' ', own1.lastName) END) AS met_up_owners,
          array_agg(DISTINCT pwt.tag) AS tags
    FROM Post_Walk pw
    JOIN Walk w ON pw.walkID = w.walkID
    JOIN WentFor wf ON w.walkID = wf.walkID
    JOIN Owns_Dog od ON wf.dogID = od.dogID
    JOIN Post_Walk_Owner pwo ON pw.postID = pwo.postID
    JOIN Owner_Name own ON own.ownerID = pwo.ownerID
    
    LEFT JOIN Post_Walk_Content pwc ON pw.postID = pwc.postID
    LEFT JOIN Post_Walk_Tag pwt ON pw.postID = pwt.postID
    LEFT JOIN TaggedIn ti ON pw.postID = ti.postID
    LEFT JOIN Post_Media pm ON pw.postID = pm.postID
    LEFT JOIN Owns_Dog od1 ON ti.dogID = od1.dogID
    LEFT JOIN Walk_Date wd ON w.walkID = wd.walkID
    LEFT JOIN Walk_Dist wdi ON w.walkID = wdi.walkID
    LEFT JOIN On_MeetUp omu ON w.walkID = omu.walkID
    LEFT JOIN Schedules s ON omu.meetUpID = s.meetUpID
    LEFT JOIN Owner_Name own1 ON s.ownerID = own1.ownerID
    WHERE pw.postID = ${postID} AND pwo.ownerID = ${ownerID}
    GROUP BY pw.postID, own.ownerID, own.firstName, own.lastName, pwc.content, w.location, wd.date, wdi.distance, omu.time, pm.url;
    `;
    const result = await client.query(query);
    client.release();
    return result.rows;
  } catch (error) {
    console.error("Error fetching data for post from the database:", error);
    throw error;
  }
}

export { postWalkSetup, insertPost, fetchDataForPostPage };
