import pool from "./databaseService.js";
import multer from "multer";
import path from "path";

// storage engine via multer
const storage = multer.diskStorage({
  destination: "../backend/images/uploads",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + " - " + Date.now() + path.extname(file.originalname)
    );
  },
});

// initialize upload, uses storage engine
const upload = multer({ storage: storage });

export { upload };
