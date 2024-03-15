import express from "express";
import {
  fetchFriendListFromDB,
  initiateOwners,
  insertFriendship,
  deleteFriendship,

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
    const { ownerid1, ownerid2, dateoffriendship } = req.body;
    const insertResult = await insertFriendship(
        ownerid1,
        ownerid2,
        dateoffriendship
    );
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
    });

router.delete("/delete-friendship", async (req, res) => {
    const { ownerid1, ownerid2} = req.body;
    const deleteResult = await deleteFriendship(
        ownerid1,
        ownerid2,
    );
    if (deleteResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
    });

export default router;