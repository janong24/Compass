import { Router } from "express";
import {
  createNotificationPreference,
  getNotificationPreference,
  updateNotificationPreference,
  deleteNotificationPreference,
} from "../controllers/notificationPreferenceController";

const router = Router();

router.route("/:uid").post(createNotificationPreference);

router
  .route("/notifications/:uid")
  .get(getNotificationPreference)
  .delete(deleteNotificationPreference)
  .put(updateNotificationPreference);

export default router;
