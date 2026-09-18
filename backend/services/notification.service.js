import { Notification } from "../models/Notification.js";
import { getShopForUser } from "./shop.service.js";
import { AppError } from "../utils/AppError.js";
export const NotificationService = {
  create: (shop, data) => Notification.create({ ...data, shop: shop._id }),
  list: async (userId) => {
    const shop = await getShopForUser(userId);
    return Notification.find({ shop: shop._id })
      .sort({ createdAt: -1 })
      .limit(100)
      .populate("customer", "name mobileNumber");
  },
  markRead: async (userId, id) => {
    const shop = await getShopForUser(userId);
    const note = await Notification.findOneAndUpdate(
      { _id: id, shop: shop._id },
      { readAt: new Date() },
      { new: true },
    );
    if (!note) throw new AppError("Notification not found", 404);
    return note;
  },
  syncDueNotifications: async (shop, { dueToday = [], overdue = [] }) => {
    const candidates = [
      ...dueToday.map((entry) => ({ ...entry, type: "DUE_TODAY", title: "Payment due today", message: `₹${entry.amount} is due today from ${entry.customer.name}` })),
      ...overdue.map((entry) => ({ ...entry, type: "OVERDUE", title: "Payment overdue", message: `₹${entry.amount} is overdue from ${entry.customer.name}` })),
    ];
    await Promise.all(candidates.map(async (entry) => {
      const exists = await Notification.exists({ shop: shop._id, type: entry.type, "metadata.transactionId": entry.transactionId });
      if (!exists) await Notification.create({
        shop: shop._id,
        customer: entry.customer._id,
        type: entry.type,
        title: entry.title,
        message: entry.message,
        metadata: { transactionId: entry.transactionId, amount: entry.amount },
      });
    }));
  },
};
