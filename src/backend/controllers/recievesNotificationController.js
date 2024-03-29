import express from "express";
import { 
  insertNotification,
  fetchNotificationsFromDB,
  deleteNotification
} from "../services/recieveNotificationService.js";


const router = express.Router();

router.get("/", async (req, res) => {
  const tableContent = await fetchNotificationsFromDB();
  res.json({ data: tableContent });
});

router.post("/insert-notif", async (req, res) => {
  const { ownerId, notificationId, notifContent } = req.body;
  const insertResult = await insertNotification(
    ownerId,
    notificationId,
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
