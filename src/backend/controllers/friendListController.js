import express from "express";
import {
  fetchFriendListFromDB,
  initiateOwners,
  insertFriendship,
  //deleteFriendship,

} from "../services/friendListService.js";

const router = express.Router();


router.get("/", async (req, res) => {
    const tableContent = await fetchFriendListFromDB();
    res.json({ data: tableContent });
  });

router.post("/initiate-owners", async (req, res) => {
    const initiateResult = await initiateOwners();
    console.log("a");
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
    });

router.post("/insert-friendship", async (req, res) => {
    const { ownerID1, ownerID2, date } = req.body;
    const insertResult = await insertFriendship(
        ownerID1,
        ownerID2,
        date
    );
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
    });

export default router;