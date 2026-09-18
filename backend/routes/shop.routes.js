import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  createShop,
  getShop,
  updateShop,
} from "../controllers/business.controller.js";
import {
  shopValidation,
  shopUpdateValidation,
} from "../validators/business.validator.js";
const router = Router();
router.use(protect);
router
  .route("/")
  .post(shopValidation, createShop)
  .get(getShop)
  .put(shopUpdateValidation, updateShop);
export default router;
