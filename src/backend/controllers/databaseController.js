import express from "express";
import { fetchFriendListFromDB } from "../services/friendListService.js";

const router = express.Router();

// router.get("/", (req, res) => {
//   res.json("hellop there");
// });


router.get("/", async (req, res) => {
  try {
    const friendList = await fetchFriendListFromDB();
    res.json(friendList);
  } catch (error) {
    console.error("Error fetching friend list from the database:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
export default router;

