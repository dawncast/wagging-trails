import express from "express";
import {
  walkSetup,
  insertWalk,
  fetchAllWalks,
  deleteWalk,
  updateWalkLocaton,
  updateWalkDate,
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


router.delete("/delete-walk", async (req, res) => {
  const { walkid } = req.body;
  const deleteResult = await deleteWalk(walkid);
  if (deleteResult) {
      res.json({ success: true });
  } else {
      res.status(500).json({ success: false });
  }
  });


  router.put("/:walkid/update-walk-location", async (req,res) => {
    const { walklocation } = req.body;
    const walkid = req.params.walkid;
    const updateResult = await updateWalkLocaton(walkid, walklocation);
    if (updateResult) {
      res.json({success : true});
    } else {
      res.status(500).json({ success: false});
    }
  });

  router.put("/:walkid/update-walk-date", async (req,res) => {
    const { walkdate} = req.body;
    const walkid = req.params.walkid;
    const updateResult = await updateWalkDate(walkid, walkdate);
    if (updateResult) {
      res.json({success : true});
    } else {
      res.status(500).json({ success: false});
    }
  });


export default router;
