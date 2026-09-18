import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import { dashboard } from "../controllers/business.controller.js";
const router = Router();
router.get("/", protect, dashboard);
export default router;
