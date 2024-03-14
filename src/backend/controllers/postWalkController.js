import express from "express";

import { postWalkSetup, insertPost } from "../services/postWalkService.js";

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

export default router;
