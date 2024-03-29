import express from "express";
import {
  fetchNotificationsFromDB,
  insertNotification,
  deleteNotification,
} from "../services/recieveNotificationService";

const router = express.Router();

router.get("/get-notifs", async (req, res) => {
  const tableContent = await fetchNotificationsFromDB();
  res.json({ data: tableContent });
});

router.post("/insert-notif", async (req, res) => {
  const { ownerID, notificationID, notifContent } = req.body;
  const insertResult = await insertNotification(
    ownerID,
    notificationID,
    notifContent
  );
  if (insertResult) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});

router.post("/delete-notif", async (req, res) => {
  const { notificationID } = req.body;
  const deleteResult = await deleteNotification(notificationID);
  if (deleteResult) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});

export default router;
