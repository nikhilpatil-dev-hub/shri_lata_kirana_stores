import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  createCustomer,
  listCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
  searchCustomers,
  customerTransactions,
  customerPayments,
  customerLedger,
  customerStatement,
} from "../controllers/business.controller.js";
import {
  customerValidation,
  customerUpdateValidation,
  id,
  paginationValidation,
  statementValidation,
} from "../validators/business.validator.js";
const router = Router();
router.use(protect);
router.get("/search", searchCustomers);
router.get(
  "/:customerId/transactions",
  id("customerId"),
  paginationValidation,
  customerTransactions,
);
router.get("/:customerId/payments", id("customerId"), customerPayments);
router.get("/:customerId/ledger", id("customerId"), customerLedger);
router.get("/:customerId/statement", id("customerId"), statementValidation, customerStatement);
router
  .route("/")
  .post(customerValidation, createCustomer)
  .get(paginationValidation, listCustomers);
router
  .route("/:customerId")
  .get(id("customerId"), getCustomer)
  .put(id("customerId"), customerUpdateValidation, updateCustomer)
  .delete(id("customerId"), deleteCustomer);
export default router;
