import express from "express";
import { walkSetup, insertWalk } from "../services/walkService";

const router = express.Router();

router.get("/", (req, res) => {
  res.json("hello there");
});

router.post("/initiate-walks", async (req, res) => {
  const initiateResult = await walkSetup();
  if (initiateResult) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});

router.post("/insert-walk", async (req, res) => {
  const { location, date, distance } = req.body;
  const insertResult = await insertWalk(location, date, distance);
  if (insertResult) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});

export default router;
