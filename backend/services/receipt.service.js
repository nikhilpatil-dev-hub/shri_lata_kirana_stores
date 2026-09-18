import { TransactionService } from "./transaction.service.js";
import { Payment } from "../models/Payment.js";
import { getShopForUser } from "./shop.service.js";
import { AppError } from "../utils/AppError.js";
import { LedgerService } from "./ledger.service.js";
export const ReceiptService = {
  transaction: async (userId, id) => ({
    type: "TRANSACTION_RECEIPT",
    shop: await getShopForUser(userId),
    transaction: await TransactionService.get(userId, id),
  }),
  payment: async (userId, id) => {
    const shop = await getShopForUser(userId);
    const payment = await Payment.findOne({ _id: id, shop: shop._id })
      .populate("customer", "name mobileNumber")
      .populate("transaction", "totalAmount transactionDate");
    if (!payment) throw new AppError("Payment not found", 404);
    return { type: "PAYMENT_RECEIPT", shop, payment };
  },
  statement: async (userId, customerId, query) => ({
    type: "CUSTOMER_STATEMENT",
    shop: await getShopForUser(userId),
    ...(await LedgerService.getStatement(userId, customerId, query)),
  }),
};
