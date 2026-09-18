import { body } from "express-validator";

const passwordRule = body("password")
  .isString()
  .withMessage("Password is required")
  .isLength({ min: 8 })
  .withMessage("Password must be at least 8 characters")
  .matches(/[A-Z]/)
  .withMessage("Password must include an uppercase letter")
  .matches(/[a-z]/)
  .withMessage("Password must include a lowercase letter")
  .matches(/\d/)
  .withMessage("Password must include a number")
  .matches(/[^A-Za-z0-9]/)
  .withMessage("Password must include a special character");

const emailRule = body("email")
  .trim()
  .isEmail()
  .withMessage("Provide a valid email address")
  .normalizeEmail();
const tokenRule = body("token")
  .trim()
  .isLength({ min: 32 })
  .withMessage("A valid token is required");

export const registerValidation = [
  body("firstName")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be 2 to 50 characters"),
  body("lastName")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be 2 to 50 characters"),
  emailRule,
  body("mobileNumber")
    .trim()
    .matches(/^\+?[1-9]\d{7,14}$/)
    .withMessage("Provide a valid mobile number"),
  passwordRule,
  body("confirmPassword")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match"),
];

export const loginValidation = [
  emailRule,
  body("password").isString().notEmpty().withMessage("Password is required"),
];
export const emailValidation = [emailRule];
export const tokenValidation = [tokenRule];
export const resetPasswordValidation = [
  tokenRule,
  passwordRule,
  body("confirmPassword")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match"),
];
export const refreshTokenValidation = [
  body("refreshToken")
    .isString()
    .notEmpty()
    .withMessage("Refresh token is required"),
];
