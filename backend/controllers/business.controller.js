import { validationResult } from "express-validator";
import { AppError } from "../utils/AppError.js";
import { ShopService } from "../services/shop.service.js";
import { CustomerService } from "../services/customer.service.js";
import { TransactionService } from "../services/transaction.service.js";
import { PaymentService } from "../services/payment.service.js";
import { LedgerService } from "../services/ledger.service.js";
import { NotificationService } from "../services/notification.service.js";
import { ReceiptService } from "../services/receipt.service.js";
import { DashboardService } from "../services/dashboard.service.js";
const run =
  (handler, status = 200) =>
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        throw new AppError("Validation failed", 422, errors.array());
      const data = await handler(req);
      res.status(status).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  };
export const createShop = run(
  (req) => ShopService.create(req.user.id, req.body),
  201,
);
export const getShop = run((req) => ShopService.get(req.user.id));
export const updateShop = run((req) =>
  ShopService.update(req.user.id, req.body),
);
export const createCustomer = run(
  (req) => CustomerService.create(req.user.id, req.body),
  201,
);
export const listCustomers = run((req) =>
  CustomerService.list(req.user.id, req.query),
);
export const getCustomer = run((req) =>
  CustomerService.get(req.user.id, req.params.customerId),
);
export const updateCustomer = run((req) =>
  CustomerService.update(req.user.id, req.params.customerId, req.body),
);
export const deleteCustomer = run((req) =>
  CustomerService.remove(req.user.id, req.params.customerId),
);
export const searchCustomers = run((req) =>
  CustomerService.search(req.user.id, req.query.q),
);
export const createTransaction = run(
  (req) => TransactionService.create(req.user.id, req.body),
  201,
);
export const listTransactions = run((req) =>
  TransactionService.list(req.user.id, req.query),
);
export const getTransaction = run((req) =>
  TransactionService.get(req.user.id, req.params.transactionId),
);
export const customerTransactions = run((req) =>
  TransactionService.list(req.user.id, {
    ...req.query,
    customerId: req.params.customerId,
  }),
);
export const createPayment = run(
  (req) => PaymentService.create(req.user.id, req.body),
  201,
);
export const customerPayments = run((req) =>
  PaymentService.listForCustomer(req.user.id, req.params.customerId),
);
export const customerLedger = run((req) =>
  LedgerService.getCustomerLedger(req.user.id, req.params.customerId),
);
export const customerStatement = run((req) =>
  ReceiptService.statement(req.user.id, req.params.customerId, req.query),
);
export const agingReport = run((req) =>
  LedgerService.getAgingReport(req.user.id),
);
export const notifications = run((req) =>
  NotificationService.list(req.user.id),
);
export const readNotification = run((req) =>
  NotificationService.markRead(req.user.id, req.params.notificationId),
);
export const transactionReceipt = run((req) =>
  ReceiptService.transaction(req.user.id, req.params.transactionId),
);
export const paymentReceipt = run((req) =>
  ReceiptService.payment(req.user.id, req.params.paymentId),
);
export const dashboard = run((req) => DashboardService.get(req.user.id));
