import { Transaction } from "../models/Transaction.js";
import { Payment } from "../models/Payment.js";
import { Customer } from "../models/Customer.js";
import { getShopForUser } from "./shop.service.js";
import { CustomerService } from "./customer.service.js";
import { getTransactionBalances } from "./transaction.service.js";
const sum = async (Model, match, field) =>
  (
    await Model.aggregate([
      { $match: match },
      { $group: { _id: null, value: { $sum: `$${field}` } } },
    ])
  )[0]?.value || 0;
export const LedgerService = {
  getOutstanding: async (userId, customerId = null) => {
    const shop = await getShopForUser(userId);
    const customer = customerId
      ? (await CustomerService.get(userId, customerId)).customer
      : null;
    const filter = {
      shop: shop._id,
      ...(customer && { customer: customer._id }),
    };
    const [credit, payments] = await Promise.all([
      sum(Transaction, filter, "totalAmount"),
      sum(Payment, filter, "amount"),
    ]);
    return {
      totalCredit: credit,
      totalPayments: payments,
      outstanding: Math.max(0, credit - payments),
    };
  },
  getCustomerLedger: async (userId, customerId) => {
    const { shop, customer } = await CustomerService.get(userId, customerId);
    const [transactions, payments, summary] = await Promise.all([
      Transaction.find({ shop: shop._id, customer: customer._id }).sort({
        transactionDate: 1,
      }),
      Payment.find({ shop: shop._id, customer: customer._id }).sort({
        paymentDate: 1,
      }),
      LedgerService.getOutstanding(userId, customerId),
    ]);
    const entries = [
      ...transactions.map((x) => ({
        type: "TRANSACTION",
        date: x.transactionDate,
        amount: x.totalAmount,
        referenceId: x._id,
        transactionType: x.transactionType,
        notes: x.notes,
      })),
      ...payments.map((x) => ({
        type: "PAYMENT",
        date: x.paymentDate,
        amount: x.amount,
        referenceId: x._id,
        method: x.method,
        notes: x.notes,
      })),
    ].sort((a, b) => a.date - b.date);
    let runningBalance = 0;
    return {
      customer,
      summary,
      entries: entries.map((x) => {
        runningBalance += x.type === "TRANSACTION" ? x.amount : -x.amount;
        return { ...x, runningBalance: Math.max(0, runningBalance) };
      }),
    };
  },
  getStatement: async (userId, customerId, { from, to } = {}) => {
    const ledger = await LedgerService.getCustomerLedger(userId, customerId);
    const start = from ? new Date(from) : null;
    const end = to ? new Date(to) : null;
    return {
      ...ledger,
      entries: ledger.entries.filter(
        (entry) =>
          (!start || entry.date >= start) && (!end || entry.date <= end),
      ),
      period: { from: start, to: end },
    };
  },
  getAgingReport: async (userId) => {
    const shop = await getShopForUser(userId);
    const { transactions, paid } = await getTransactionBalances(shop._id);
    const customers = await Customer.find({ shop: shop._id }).select("name mobileNumber");
    const customerMap = new Map(customers.map((customer) => [String(customer._id), customer]));
    const now = Date.now();
    const buckets = { current: 0, days1to30: 0, days31to60: 0, days61plus: 0 };
    const overdue = [];
    for (const tx of transactions) {
      const balance = Math.max(0, tx.totalAmount - (paid.get(String(tx._id)) || 0));
      if (balance <= 0 || !tx.dueDate) continue;
      const days = Math.floor((now - tx.dueDate.getTime()) / 86400000);
      if (days <= 0) buckets.current += balance;
      else if (days <= 30) buckets.days1to30 += balance;
      else if (days <= 60) buckets.days31to60 += balance;
      else buckets.days61plus += balance;
      if (days > 0)
        overdue.push({
          transactionId: tx._id,
          customer: customerMap.get(String(tx.customer)),
          amount: balance,
          daysOverdue: days,
        });
    }
    return { buckets, overdue };
  },
  getOverdueCustomers: async (userId) => {
    const { overdue } = await LedgerService.getAgingReport(userId);
    const grouped = new Map();
    for (const entry of overdue) {
      const key = String(entry.customer?._id);
      const current = grouped.get(key) || { customer: entry.customer, outstanding: 0, daysOverdue: 0, transactions: [] };
      current.outstanding += entry.amount;
      current.daysOverdue = Math.max(current.daysOverdue, entry.daysOverdue);
      current.transactions.push({ transactionId: entry.transactionId, amount: entry.amount, daysOverdue: entry.daysOverdue });
      grouped.set(key, current);
    }
    return [...grouped.values()].sort((a, b) => b.outstanding - a.outstanding);
  },
};
