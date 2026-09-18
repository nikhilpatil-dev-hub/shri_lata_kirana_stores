import { Transaction } from "../models/Transaction.js";
import { Payment } from "../models/Payment.js";
import { CustomerService } from "./customer.service.js";
import { getShopForUser } from "./shop.service.js";
import { AppError } from "../utils/AppError.js";
export const getTransactionBalances = async (shopId, customerId = null) => {
  const filter = { shop: shopId, ...(customerId && { customer: customerId }) };
  const [transactions, payments] = await Promise.all([
    Transaction.find(filter).sort({ transactionDate: 1, _id: 1 }),
    Payment.find(filter).sort({ paymentDate: 1, _id: 1 }),
  ]);
  const paid = new Map(transactions.map((transaction) => [String(transaction._id), 0]));
  const unallocated = [];
  for (const payment of payments) {
    if (payment.transaction && paid.has(String(payment.transaction))) {
      paid.set(String(payment.transaction), paid.get(String(payment.transaction)) + payment.amount);
    } else unallocated.push(payment);
  }
  // Customer-level payments settle the oldest outstanding entries first. This is
  // derived at read time, leaving both transaction and payment history immutable.
  for (const payment of unallocated) {
    let remaining = payment.amount;
    for (const transaction of transactions) {
      if (remaining <= 0) break;
      if (String(transaction.customer) !== String(payment.customer)) continue;
      const key = String(transaction._id);
      const applied = Math.min(remaining, Math.max(0, transaction.totalAmount - paid.get(key)));
      paid.set(key, paid.get(key) + applied);
      remaining -= applied;
    }
  }
  return { transactions, paid };
};

const decorate = async (transactions, shopId, customerId = null) => {
  if (!transactions.length) return [];
  const { paid } = await getTransactionBalances(shopId, customerId);
  return transactions.map((t) => {
    const paidAmount = paid.get(String(t._id)) || 0;
    const balance = Math.max(0, t.totalAmount - paidAmount);
    const status =
      balance === 0
        ? "SETTLED"
        : t.dueDate && t.dueDate < new Date()
          ? "OVERDUE"
          : (paid.get(String(t._id)) || 0) > 0
            ? "PARTIALLY_PAID"
            : "OPEN";
    return { ...t.toObject(), outstanding: balance, paidToDate: paidAmount, status };
  });
};
export const TransactionService = {
  create: async (userId, data) => {
    const { shop, customer } = await CustomerService.get(
      userId,
      data.customerId,
    );
    const total = Number(data.totalAmount);
    const paid = Number(data.paidAmount || 0);
    if (!Number.isFinite(total) || total <= 0 || paid < 0 || paid > total)
      throw new AppError("Amounts are invalid", 422);
    const type = data.transactionType;
    const expected =
      type === "CASH" || type === "UPI" ? total : type === "UDHAR" ? 0 : paid;
    if (paid !== expected)
      throw new AppError(
        "Paid amount does not match the transaction type",
        422,
      );
    const transactionDate = data.transactionDate
      ? new Date(data.transactionDate)
      : new Date();
    const dueDate =
      total > paid
        ? data.dueDate
          ? new Date(data.dueDate)
          : new Date(
              transactionDate.getTime() + customer.creditPeriod * 86400000,
            )
        : null;
    if (dueDate && dueDate < transactionDate)
      throw new AppError("Due date cannot be before transaction date", 422);
    const transaction = await Transaction.create({
      shop: shop._id,
      customer: customer._id,
      totalAmount: total,
      paidAmount: paid,
      dueAmount: total - paid,
      transactionType: type,
      items: data.items || [],
      notes: data.notes,
      transactionDate,
      dueDate,
    });
    if (paid > 0)
      await Payment.create({
        shop: shop._id,
        customer: customer._id,
        transaction: transaction._id,
        amount: paid,
        method: type === "UPI" ? "UPI" : "CASH",
        paymentDate: transactionDate,
        notes: "Initial payment",
      });
    return (await decorate([transaction], shop._id, customer._id))[0];
  },
  list: async (userId, { customerId, page = 1, limit = 20 } = {}) => {
    const shop = await getShopForUser(userId);
    const customer = customerId
      ? (await CustomerService.get(userId, customerId)).customer
      : null;
    const filter = {
      shop: shop._id,
      ...(customer && { customer: customer._id }),
    };
    const docs = await Transaction.find(filter)
      .populate("customer", "name mobileNumber")
      .sort({ transactionDate: -1 })
      .skip((Math.max(1, page) - 1) * Math.min(limit, 100))
      .limit(Math.min(limit, 100));
    return decorate(docs, shop._id, customer?._id || null);
  },
  get: async (userId, id) => {
    const shop = await getShopForUser(userId);
    const transaction = await Transaction.findOne({
      _id: id,
      shop: shop._id,
    }).populate("customer", "name mobileNumber");
    if (!transaction) throw new AppError("Transaction not found", 404);
    return (await decorate([transaction], shop._id, transaction.customer._id))[0];
  },
};
