import express from "express";
import { upload, insertMedia, deletePhoto } from "../services/postMediaService.js";
const router = express.Router();

router.post("/upload", upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded." });
    }
    const postID = req.body.postID;
    console.log(postID);
    if (!postID) {
      return res
        .status(400)
        .json({ success: false, message: "postID is required." });
    }
    const fileName = req.file.filename;
    const date = new Date().toISOString().split("T")[0];
    const mediaType = req.file.mimetype.startsWith("image/")
      ? "image"
      : "video";

    const initiateResult = await insertMedia(fileName, date, mediaType, postID);

    if (initiateResult) {
      res.status(200).json({
        success: true,
        message: "File uploaded and saved successfully.",
      });
    } else {
      res
        .status(500)
        .json({ success: false, message: "Failed to save media." });
    }
  } catch (error) {
    console.error("Error:", error);
    console.error(error.message);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

router.post("/insert", async (req, res) => {
  const { fileName, date, mediaType, postID } = req.body;
  console.log("here");
  const insertResult = await insertMedia(fileName, date, mediaType, postID);
  if (insertResult) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false, postID: postID });
  }
});

router.delete("/delete-photo", async (req, res) => {
  const { mediaid } = req.body;
  const deleteResult = await deletePhoto(
      mediaid
  );
  if (deleteResult) {
      res.json({ success: true });
  } else {
      res.status(500).json({ success: false });
  }
  });

export default router;
