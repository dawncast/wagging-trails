import pool from "./databaseService.js";
import multer from "multer";
import path from "path";

// storage engine via multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Determine destination directory based on file's MIME type
    const uploadDir = file.mimetype.startsWith("image/")
      ? "../backend/uploads/images"
      : "../backend/uploads/videos";
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + " - " + Date.now() + path.extname(file.originalname)
    );
  },
});

// initialize upload, uses storage engine
const upload = multer({ storage: storage });

// ----------------------------------------------------------------
// Query functions here
// ----------------------------------------------------------------

async function insertMedia(fileName, date, mediaType) {
  let client;
  try {
    client = await pool.connect();

    // Start transaction
    await client.query("BEGIN");

    const ownerInsertQuery =
      "INSERT INTO Owner (email) VALUES ($1) RETURNING ownerID"; // RETURNING ownerID gets the ownerID for Owner_Name to use.
    const ownerInsertValues = [email];
    const ownerResult = await client.query(ownerInsertQuery, ownerInsertValues);
    const ownerID = ownerResult.rows[0].ownerid;

    const nameInsertQuery =
      "INSERT INTO Owner_Name (ownerID, firstName, lastName) VALUES ($1, $2, $3)";
    const nameInsertValues = [ownerID, firstName, lastName];
    await client.query(nameInsertQuery, nameInsertValues);

    const contactInsertQuery =
      "INSERT INTO Owner_Contact (email, phoneNumber) VALUES ($1, $2)";
    const contactInsertValues = [email, phoneNumber];
    await client.query(contactInsertQuery, contactInsertValues);

    // Commit the transaction
    await client.query("COMMIT");
    return true;
  } catch (error) {
    // Rollback the transaction in case of error
    await client.query("ROLLBACK");
    console.error("Error inserting owner:", error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
}

export { upload, insertMedia };
