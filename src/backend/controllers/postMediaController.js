import express from "express";
import { upload, insertMedia } from "../services/postMediaService.js";
const router = express.Router();

router.post("/upload", upload.single("file"), async (req, res, err) => {
  if (err) {
    res.status(400).json({ success: false, message: "No file uploaded." });
  } else {
    res.status(200).json({
      message: "File uploaded successfully",
      filename: req.file.filename,
    });

    // put this in a different function
    const fileName = req.file.filename;
    const date = new Date().toISOString().split("T")[0];
    const mediaType = req.file.mimetype.startsWith("image/")
      ? "image"
      : "video";

    const initiateResult = await insertMedia(fileName, date, mediaType);
    if (initiateResult) {
      res.json({ success: true });
    } else {
      res.status(500).json({ success: false });
    }
  }
});

export default router;
