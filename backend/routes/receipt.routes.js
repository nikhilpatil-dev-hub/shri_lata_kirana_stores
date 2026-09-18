import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  transactionReceipt,
  paymentReceipt,
  agingReport,
} from "../controllers/business.controller.js";
import { id } from "../validators/business.validator.js";
const router = Router();
router.use(protect);
router.get(
  "/transactions/:transactionId",
  id("transactionId"),
  transactionReceipt,
);
router.get("/payments/:paymentId", id("paymentId"), paymentReceipt);
router.get("/aging-report", agingReport);
export default router;
