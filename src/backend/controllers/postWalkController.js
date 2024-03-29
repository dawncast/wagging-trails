import express from "express";

import {
  postWalkSetup,
  insertPost,
  fetchDataForPostPage,
  fetchDataForOwnerProfilePage,
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
  const { walkID, ownerID, content, tags } = req.body;
  const insertResult = await insertPost(walkID, ownerID, content, tags);
  if (insertResult) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});

// for fetching ALL posts made by a single owner
router.get("/:ownerID/fetch-posts", async (req, res) => {
  try {
    const ownerID = req.params.ownerID;
    const tableContent = await fetchDataForOwnerProfilePage(ownerID);
    if (!tableContent) {
      res.status(404).json({ error: "Post not found" });
      return;
    }
    res.json({ data: tableContent });
  } catch (err) {
    console.error("Error retrieving owner posts:", err);
    res.status(500).json({ err: "Internal server error" });
  }
});

// function to get all the data necessary for post page.
router.get("/:ownerID/:postID", async (req, res) => {
  try {
    const postID = req.params.postID;
    const ownerID = req.params.ownerID;
    const tableContent = await fetchDataForPostPage(postID, ownerID);
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
