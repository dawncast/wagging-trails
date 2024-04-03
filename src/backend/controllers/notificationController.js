import express from "express";
import {
  fetchOwnerWalkTask,
  fetchFromDB,
  insertWalkTask,
  insertReceivesAndWalk,
  insertOrganizesWalk,
  insertLog,
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
router.get("/walk-task/:ownerID", async (req, res) => {
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

// insert full walk from side scheduling bar.
// insert by notification -> walk alert -> walk task -> logs
router.post("/insert-walk-task", async (req, res) => {
  const { ownerID, notifContent, dogName, date, walkeventtype } = req.body;
  const insertResult = await insertWalkTask(
    ownerID,
    notifContent,
    dogName,
    date,
    walkeventtype
  );
  if (insertResult) {
    // split up dog names here just in case. Eg. "a,b" -> ["a","b"]
    const dogNamesArray = dogName.split(",").map((name) => name.trim());
    res.json({ success: true, dogNames: dogNamesArray });
  } else {
    res.status(500).json({ success: false });
  }
});

router.post("/insert-walk-alert", async (req, res) => {
  const {ownerID, notifContent, dogName } = req.body;
  const notificationID = await insertReceivesAndWalk(ownerID, notifContent, dogName);
  if (notificationID) {
    res.json({ notificationID });
  } else {
    res.status(500).json({ success: false });
  }
});

router.post("/insert-organizes-walk", async (req, res) => {
  const {ownerID, data, walkeventtype } = req.body;
  const taskID = await insertOrganizesWalk(ownerID, data, walkeventtype);
  if (taskID) {
    res.json({ taskID });
  } else {
    res.status(500).json({ success: false });
  }
});

router.post("/insert-log", async (req, res) => {
  const {notificationID, taskID } = req.body;
  const result = await insertLog(notificationID, taskID);
  if (result) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});

export default router;
