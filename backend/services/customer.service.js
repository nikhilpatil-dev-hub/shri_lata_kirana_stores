import { Customer } from "../models/Customer.js";
import { Transaction } from "../models/Transaction.js";
import { Payment } from "../models/Payment.js";
import { AppError } from "../utils/AppError.js";
import { getShopForUser } from "./shop.service.js";
const get = async (userId, customerId) => {
  const shop = await getShopForUser(userId);
  const customer = await Customer.findOne({ _id: customerId, shop: shop._id });
  if (!customer) throw new AppError("Customer not found", 404);
  return { shop, customer };
};
export const CustomerService = {
  create: async (userId, data) => {
    const shop = await getShopForUser(userId);
    return Customer.create({
      name: data.name,
      mobileNumber: data.mobileNumber,
      address: data.address,
      notes: data.notes,
      email: data.email,
      shop: shop._id,
      creditPeriod: data.creditPeriod ?? shop.defaultCreditPeriod,
    });
  },
  list: async (userId, { page = 1, limit = 20 } = {}) => {
    const shop = await getShopForUser(userId);
    const skip = (Math.max(1, page) - 1) * Math.min(limit, 100);
    const [customers, total] = await Promise.all([
      Customer.find({ shop: shop._id, isActive: true })
        .sort({ name: 1 })
        .skip(skip)
        .limit(Math.min(limit, 100)),
      Customer.countDocuments({ shop: shop._id, isActive: true }),
    ]);
    return {
      customers,
      pagination: { page: Number(page), limit: Math.min(limit, 100), total },
    };
  },
  get,
  update: async (userId, id, data) => {
    const { customer } = await get(userId, id);
    for (const field of ["name", "mobileNumber", "address", "notes", "email", "creditPeriod"])
      if (data[field] !== undefined) customer[field] = data[field];
    return customer.save();
  },
  remove: async (userId, id) => {
    const { customer } = await get(userId, id);
    const [transactions, payments] = await Promise.all([
      Transaction.exists({ customer: id }),
      Payment.exists({ customer: id }),
    ]);
    if (transactions || payments) {
      customer.isActive = false;
      await customer.save();
      return { archived: true };
    }
    await customer.deleteOne();
    return { deleted: true };
  },
  search: async (userId, query) => {
    const shop = await getShopForUser(userId);
    const term = String(query || "").trim();
    if (term.length < 2)
      throw new AppError("Search query must be at least 2 characters", 422);
    return Customer.find({
      shop: shop._id,
      isActive: true,
      $or: [
        { name: { $regex: term, $options: "i" } },
        { mobileNumber: { $regex: term.replace(/[-\s]/g, ""), $options: "i" } },
      ],
    })
      .sort({ name: 1 })
      .limit(20);
  },
};
