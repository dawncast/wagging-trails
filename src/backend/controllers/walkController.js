import express from "express";
import {
  walkSetup,
  insertWalk,
  fetchAllWalks,
} from "../services/walkService.js";

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

// for side scheduling bar. Fetches all walks. UPCOMING WALKS WILL BE MANAGED BY WALK TASK.
router.get("/:ownerID", async (req, res) => {
  try {
    const ownerID = req.params.ownerID;
    const tableContent = await fetchAllWalks(ownerID);
    if (!tableContent) {
      res.status(404).json({ error: "Walks not found" });
      return;
    }
    res.json({ data: tableContent });
  } catch (err) {
    console.error("Error retrieving walks:", err);
    res.status(500).json({ err: "Internal server error" });
  }
});

export default router;
