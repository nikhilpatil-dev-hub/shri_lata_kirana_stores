import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import { createPayment } from "../controllers/business.controller.js";
import { paymentValidation } from "../validators/business.validator.js";
const router = Router();
router.use(protect);
router.post("/", paymentValidation, createPayment);
export default router;
