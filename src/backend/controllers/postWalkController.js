import express from "express";

import {
  postWalkSetup,
  insertPost,
  fetchDataForPostPage,
} from "../services/postWalkService.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json("hello there");
});

router.post("/initiate-posts", async (req, res) => {
  const initiateResult = await postWalkSetup();
  if (initiateResult) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});

router.post("/insert-post", async (req, res) => {
  const { walkID, content, tag } = req.body;
  const insertResult = await insertPost(walkID, content, tag);
  if (insertResult) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});

// function to get all the data necessary for post page.
router.get("/:postID", async (req, res) => {
  try {
    const postID = req.params.postID;
    const tableContent = await fetchDataForPostPage(postID);
    if (!tableContent) {
      res.status(404).json({ error: "Post not found" });
      return;
    }
    res.json({ data: tableContent });
  } catch (err) {
    console.error("Error retrieving post:", err);
    res.status(500).json({ err: "Internal server error" });
  }
});

export default router;
