import { Router } from "express";
import {
  forgotPassword,
  getMe,
  login,
  logout,
  refreshToken,
  register,
  resendVerification,
  resetPassword,
  verifyEmail,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import {
  emailValidation,
  loginValidation,
  refreshTokenValidation,
  registerValidation,
  resetPasswordValidation,
  tokenValidation,
} from "../validators/auth.validator.js";

const router = Router();

router.post("/register", registerValidation, register);
router.post("/verify-email", tokenValidation, verifyEmail);
router.post("/resend-verification", emailValidation, resendVerification);
router.post("/login", loginValidation, login);
router.post("/forgot-password", emailValidation, forgotPassword);
router.post("/reset-password", resetPasswordValidation, resetPassword);
router.post("/refresh-token", refreshTokenValidation, refreshToken);
router.post("/logout", logout);
router.get("/me", protect, getMe);

export default router;
