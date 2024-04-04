import express from "express";
import {
  insertTaggedDog,
  deleteTaggedIn,
} from "../services/taggedInService.js";

const router = express.Router();

// inserts a list of dogs who participated in a walk.
router.post("/insert-tagged-in", async (req, res) => {
  const { dogIDs, postID } = req.body;
  const insertResult = await insertTaggedDog(dogIDs, postID);
  if (insertResult) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});

router.delete("/:postid/delete-tagged-in", async (req, res) => {
  const postID = req.params.postid;
  const insertResult = await deleteTaggedIn(postID);
  if (insertResult) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});

export default router;
