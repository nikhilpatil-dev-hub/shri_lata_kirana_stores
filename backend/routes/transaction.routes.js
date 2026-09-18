import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  createTransaction,
  listTransactions,
  getTransaction,
} from "../controllers/business.controller.js";
import {
  id,
  paginationValidation,
  transactionValidation,
} from "../validators/business.validator.js";
const router = Router();
router.use(protect);
router
  .route("/")
  .post(transactionValidation, createTransaction)
  .get(paginationValidation, listTransactions);
router.get("/:transactionId", id("transactionId"), getTransaction);
export default router;
