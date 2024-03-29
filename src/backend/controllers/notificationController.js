import express from "express";
import {
  fetchOwnerWalkTask,
  fetchFromDB,
} from "../services/notificationService.js";

const router = express.Router();

/*
 * NOTE: This notification controller will include its subclasses.
 *       (FriendPost and WalkAlert)
 */
router.get("/", async (req, res) => {
  const tableContent = await fetchFromDB();
  res.json({ data: tableContent });
});

// for side scheduling bar. Fetches all walks tasks based on owner
router.get("/:ownerID", async (req, res) => {
  try {
    const ownerID = req.params.ownerID;
    const tableContent = await fetchOwnerWalkTask(ownerID);
    if (!tableContent) {
      res.status(404).json({ error: "WalkTasks not found" });
      return;
    }
    res.json({ data: tableContent });
  } catch (err) {
    console.error("Error retrieving walktasks:", err);
    res.status(500).json({ err: "Internal server error" });
  }
});

export default router;
