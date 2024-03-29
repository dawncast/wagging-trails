import express from "express";
import { deleteDog, dogsForOwner, fetchDogsFromDB, insertDog, updateOwnerForDog } from "../services/ownsDogService.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const tableContent = await fetchDogsFromDB();
  res.json({ data: tableContent });
});

router.post("/insert-dog", async (req, res) => {
  const { ownerID, name, breed, birthday } = req.body;
  const insertResult = await insertDog(ownerID, name, breed, birthday);
  if (insertResult) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});

router.put("/:dogID/update-dog-owner", async (req, res) => {
  const { ownerIDNew} = req.body;
  const dogID = req.params.dogID;
  const updateResult = await updateOwnerForDog(ownerIDNew, dogID);
  if (updateResult) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});

router.delete("/delete-dog", async (req, res) => {
  const { dogID} = req.body;
  const deleteResult = await deleteDog(
      dogID
  );
  if (deleteResult) {
      res.json({ success: true });
  } else {
      res.status(500).json({ success: false });
  }
  });

  router.get("/:ownerid/get-dog-for", async (req, res) => {
    try {
      const ownerid = req.params.ownerid;
      const tableContent = await dogsForOwner(ownerid);
      if (!tableContent) {
        res.status(404).json({error: "Owner not found"});
        return;
      }
      res.json({data: tableContent});
  
    } catch (err) {
      console.error("Error retrieving dogs for owner: ", err);
      res.status(500).json({err: "Internal server error"});
    }
  });

export default router;
