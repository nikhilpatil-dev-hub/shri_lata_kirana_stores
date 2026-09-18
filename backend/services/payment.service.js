import { Payment } from "../models/Payment.js";
import { Transaction } from "../models/Transaction.js";
import { CustomerService } from "./customer.service.js";
import { NotificationService } from "./notification.service.js";
import { LedgerService } from "./ledger.service.js";
import { getTransactionBalances } from "./transaction.service.js";
import { AppError } from "../utils/AppError.js";
export const PaymentService = {
  create: async (userId, data) => {
    const { shop, customer } = await CustomerService.get(
      userId,
      data.customerId,
    );
    let transaction = null;
    if (data.transactionId) {
      transaction = await Transaction.findOne({
        _id: data.transactionId,
        shop: shop._id,
        customer: customer._id,
      });
      if (!transaction)
        throw new AppError("Transaction not found for this customer", 404);
      const { paid } = await getTransactionBalances(shop._id, customer._id);
      if ((paid.get(String(transaction._id)) || 0) + Number(data.amount) > transaction.totalAmount)
        throw new AppError(
          "Payment exceeds this transaction's outstanding amount",
          422,
        );
    }
    else {
      const { outstanding } = await LedgerService.getOutstanding(userId, data.customerId);
      if (Number(data.amount) > outstanding)
        throw new AppError("Payment exceeds this customer's outstanding amount", 422);
    }
    const payment = await Payment.create({
      shop: shop._id,
      customer: customer._id,
      transaction: transaction?._id || null,
      amount: Number(data.amount),
      method: data.method,
      paymentDate: data.paymentDate || new Date(),
      notes: data.notes,
    });
    await NotificationService.create(shop, {
      customer: customer._id,
      type: "PAYMENT_RECEIVED",
      title: "Payment received",
      message: `₹${payment.amount} received from ${customer.name}`,
      metadata: { paymentId: payment._id, transactionId: transaction?._id },
    });
    return payment;
  },
  listForCustomer: async (userId, customerId) => {
    const { shop } = await CustomerService.get(userId, customerId);
    return Payment.find({ shop: shop._id, customer: customerId })
      .populate("transaction", "totalAmount transactionDate")
      .sort({ paymentDate: -1 });
  },
};
