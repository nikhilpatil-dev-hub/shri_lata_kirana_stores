import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  notifications,
  readNotification,
} from "../controllers/business.controller.js";
import { id } from "../validators/business.validator.js";
const router = Router();
router.use(protect);
router.get("/", notifications);
router.patch("/:notificationId/read", id("notificationId"), readNotification);
export default router;
