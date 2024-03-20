import express from "express";
import { fetchFriendListFromDB } from "../services/friendListService.js";

import { initiateDB } from "../services/databaseService.js";

const router = express.Router();

// router.get("/", (req, res) => {
//   res.json("hellop there");
// });

router.post("/initiate-all", async (req, res) => {
  const initiateResult = await initiateDB();
  if (initiateResult) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});

export default router;

