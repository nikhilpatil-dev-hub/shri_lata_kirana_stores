import { Transaction } from "../models/Transaction.js";
import { Payment } from "../models/Payment.js";
import { Customer } from "../models/Customer.js";
import { LedgerService } from "./ledger.service.js";
import { getTransactionBalances } from "./transaction.service.js";
import { NotificationService } from "./notification.service.js";
import { getShopForUser } from "./shop.service.js";

const startOfDay = (date = new Date()) => {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
};

export const DashboardService = {
  get: async (userId) => {
    const shop = await getShopForUser(userId);
    const today = startOfDay();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const [todayTransactions, outstandingSummary, overdueCustomers, recentTransactions, recentPayments, balanceData, customers] = await Promise.all([
      Transaction.find({ shop: shop._id, transactionDate: { $gte: today, $lt: tomorrow } }),
      LedgerService.getOutstanding(userId),
      LedgerService.getOverdueCustomers(userId),
      Transaction.find({ shop: shop._id }).populate("customer", "name mobileNumber").sort({ transactionDate: -1 }).limit(10),
      Payment.find({ shop: shop._id }).populate("customer", "name mobileNumber").populate("transaction", "totalAmount transactionDate").sort({ paymentDate: -1 }).limit(10),
      getTransactionBalances(shop._id),
      Customer.find({ shop: shop._id }).select("name mobileNumber"),
    ]);
    const customerMap = new Map(customers.map((customer) => [String(customer._id), customer]));
    const balanceFor = (transaction) => Math.max(0, transaction.totalAmount - (balanceData.paid.get(String(transaction._id)) || 0));
    const pending = balanceData.transactions.filter((transaction) => balanceFor(transaction) > 0);
    const dueToday = pending
      .filter((transaction) => transaction.dueDate >= today && transaction.dueDate < tomorrow)
      .map((transaction) => ({ transactionId: transaction._id, customer: customerMap.get(String(transaction.customer)), amount: balanceFor(transaction) }))
      .filter((entry) => entry.customer);
    const overdueNotifications = overdueCustomers.flatMap((entry) => entry.transactions.map((transaction) => ({ transactionId: transaction.transactionId, customer: entry.customer, amount: transaction.amount })));
    await NotificationService.syncDueNotifications(shop, { dueToday, overdue: overdueNotifications });

    let cashSales = 0, upiSales = 0, udharSales = 0;
    for (const transaction of todayTransactions) {
      if (transaction.transactionType === "CASH") cashSales += transaction.totalAmount;
      else if (transaction.transactionType === "UPI") upiSales += transaction.totalAmount;
      else if (transaction.transactionType === "UDHAR") udharSales += transaction.totalAmount;
      else { cashSales += transaction.paidAmount; udharSales += transaction.dueAmount; }
    }
    const overdueAmount = overdueCustomers.reduce((total, entry) => total + entry.outstanding, 0);
    return {
      todaySales: cashSales + upiSales + udharSales,
      cashSales,
      upiSales,
      udharSales,
      totalOutstanding: outstandingSummary.outstanding,
      overdueAmount,
      customersWithDue: new Set(pending.map((transaction) => String(transaction.customer))).size,
      overdueCustomers,
      recentTransactions,
      recentPayments,
      pendingEntries: pending.length,
    };
  },
};
