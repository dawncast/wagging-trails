import express from "express";
import { deleteDog, fetchDogsFromDB, insertDog, updateOwnerForDog } from "../services/ownsDogService.js";

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

export default router;
