import express from "express";
import { fetchDogsFromDB, insertDog } from "../services/ownsDogService.js";

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

router.put("/:ownsDog/update-dog-owner", async (req, res) => {
  const { ownerIDNew} = req.body;
  const ownerID1 = req.params.ownerID;
  const updateResult = await updateOwnerForDow(ownerID1, ownerIDNew);
  if (updateResult) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});

export default router;
