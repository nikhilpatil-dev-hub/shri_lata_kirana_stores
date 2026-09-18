import { validationResult } from "express-validator";
import { AuthService } from "../services/auth.service.js";
import { AppError } from "../utils/AppError.js";

const validate = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    throw new AppError("Validation failed", 422, errors.array());
};

const execute = (handler) => async (req, res, next) => {
  try {
    validate(req);
    await handler(req, res);
  } catch (error) {
    next(error);
  }
};

export const register = execute(async (req, res) => {
  const user = await AuthService.register(req.body);
  res
    .status(201)
    .json({
      success: true,
      message: "Registration successful. Please verify your email address.",
      user,
    });
});

export const verifyEmail = execute(async (req, res) => {
  const user = await AuthService.verifyEmail(req.body.token);
  res
    .status(200)
    .json({ success: true, message: "Email verified successfully", user });
});

export const resendVerification = execute(async (req, res) => {
  await AuthService.resendVerification(req.body.email);
  res
    .status(200)
    .json({
      success: true,
      message:
        "If an unverified account exists, a verification email has been sent",
    });
});

export const login = execute(async (req, res) => {
  const result = await AuthService.login(req.body.email, req.body.password);
  res.status(200).json({ success: true, ...result });
});

export const forgotPassword = execute(async (req, res) => {
  await AuthService.forgotPassword(req.body.email);
  res
    .status(200)
    .json({
      success: true,
      message: "If an account exists, a password reset email has been sent",
    });
});

export const resetPassword = execute(async (req, res) => {
  await AuthService.resetPassword(req.body.token, req.body.password);
  res
    .status(200)
    .json({
      success: true,
      message: "Password reset successfully. Please log in again.",
    });
});

export const refreshToken = execute(async (req, res) => {
  const result = await AuthService.refreshTokens(req.body.refreshToken);
  res.status(200).json({ success: true, ...result });
});

export const logout = async (req, res, next) => {
  try {
    await AuthService.logout(req.body.refreshToken);
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res) => {
  res.status(200).json({ success: true, user: req.user.toProfile() });
};
