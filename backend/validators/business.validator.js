import { body, param, query } from "express-validator";
export const id = (name) =>
  param(name).isMongoId().withMessage(`${name} must be valid`);
export const shopValidation = [
  body("shopName").trim().isLength({ min: 2, max: 100 }),
  body("ownerName").trim().isLength({ min: 2, max: 100 }),
  body("mobileNumber")
    .trim()
    .matches(/^\+?[1-9]\d{7,14}$/),
  body("defaultCreditPeriod").optional().isInt({ min: 0, max: 365 }),
];
export const shopUpdateValidation = [
  body("shopName").optional().trim().isLength({ min: 2, max: 100 }),
  body("ownerName").optional().trim().isLength({ min: 2, max: 100 }),
  body("mobileNumber")
    .optional()
    .trim()
    .matches(/^\+?[1-9]\d{7,14}$/),
  body("defaultCreditPeriod").optional().isInt({ min: 0, max: 365 }),
];
export const customerValidation = [
  body("name").trim().isLength({ min: 2, max: 100 }),
  body("mobileNumber")
    .trim()
    .matches(/^\+?[1-9]\d{7,14}$/),
  body("email").optional({ values: "falsy" }).isEmail(),
  body("creditPeriod").optional().isInt({ min: 0, max: 365 }),
];
export const customerUpdateValidation = [
  body("name").optional().trim().isLength({ min: 2, max: 100 }),
  body("mobileNumber")
    .optional()
    .trim()
    .matches(/^\+?[1-9]\d{7,14}$/),
  body("email").optional({ values: "falsy" }).isEmail(),
  body("creditPeriod").optional().isInt({ min: 0, max: 365 }),
];
export const transactionValidation = [
  body("customerId").isMongoId(),
  body("totalAmount").isFloat({ gt: 0 }),
  body("paidAmount").optional().isFloat({ min: 0 }),
  body("transactionType").isIn(["CASH", "UPI", "UDHAR", "PARTIAL"]),
  body("transactionDate").optional().isISO8601(),
  body("dueDate").optional({ values: "null" }).isISO8601(),
  body("items").optional().isArray(),
  body("items.*.name").optional().trim().notEmpty(),
  body("items.*.unitPrice").optional().isFloat({ min: 0 }),
  body("items.*.total").optional().isFloat({ min: 0 }),
];
export const paymentValidation = [
  body("customerId").isMongoId(),
  body("transactionId").optional({ values: "falsy" }).isMongoId(),
  body("amount").isFloat({ gt: 0 }),
  body("method").isIn(["CASH", "UPI"]),
  body("paymentDate").optional().isISO8601(),
];
export const paginationValidation = [
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 }),
];
export const statementValidation = [
  query("from").optional().isISO8601(),
  query("to").optional().isISO8601(),
];
