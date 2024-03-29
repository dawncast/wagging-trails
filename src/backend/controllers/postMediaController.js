import express from "express";
import { upload } from "../services/postMediaService.js";
const router = express.Router();

router.post("/upload", upload.single("file"), (req, res, err) => {
  if (err) {
    res.status(500).json({ success: false });
  } else {
    res.status(200).json({
      message: "File uploaded successfully",
      filename: req.file.filename,
    });
  }
});

export default router;
