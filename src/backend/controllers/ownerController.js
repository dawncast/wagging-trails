import express from "express";
import {
  fetchOwnersFromDB,
  initiateOwners,
  insertOwner,
  updateOwnerName,
  updateOwnerContact,
} from "../services/ownerService.js";

const router = express.Router();

//----------------------------------------------------------------
// API Endpoints Notes
//
// Currently, we are using GET, POST, and PUT.
// GET request the needed data (eg. owner emails).
// POST submits the data
// PUT is used to update or replace data. (eg. email -> new email)
//
// Each of these methods calls functions from their own service.js.
// So for this file "ownerController", you can check "ownerService".
//----------------------------------------------------------------
router.get("/", async (req, res) => {
  const tableContent = await fetchOwnersFromDB();
  res.json({ data: tableContent });
});

router.post("/initiate-owners", async (req, res) => {
  const initiateResult = await initiateOwners();
  if (initiateResult) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});

router.post("/insert-owner", async (req, res) => {
  const { email, firstName, lastName, phoneNumber } = req.body;
  const insertResult = await insertOwner(
    email,
    firstName,
    lastName,
    phoneNumber
  );
  if (insertResult) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});

router.put("/:ownerID/update-name", async (req, res) => {
  const { firstName, lastName } = req.body;
  const ownerID = req.params.ownerID;
  const updateResult = await updateOwnerName(ownerID, firstName, lastName);
  if (updateResult) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});

router.put("/:ownerID/update-contact", async (req, res) => {
  const { email, phoneNumber } = req.body;
  const ownerID = req.params.ownerID;
  const updateResult = await updateOwnerContact(ownerID, email, phoneNumber);
  if (updateResult) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});

export default router;
