import express from "express";
import { insertMeetup } from "../services/onMeetupService.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json("hello there");
});

// this insert meet up function is primarily for who hosts the meetup.
// owners that would like to join the meetup, will have to use the
// schedules functionality.
router.post("/insert-meetup", async (req, res) => {
  const { walkID, time, location, date, ownerID } = req.body;
  const insertResult = await insertMeetup(
    walkID,
    time,
    location,
    date,
    ownerID
  );
  if (insertResult) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});

export default router;
