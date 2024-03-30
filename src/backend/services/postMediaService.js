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
