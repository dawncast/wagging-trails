import express from "express";
import { insertWentFor } from "../services/wentForService.js";

const router = express.Router();

router.post("/insert-went-for", async (req, res) => {
  const { dogID, walkID, rating } = req.body;
  const insertResult = await insertWentFor(dogID, walkID, rating);
  if (insertResult) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});

export default router;
