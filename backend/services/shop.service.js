import { Shop } from "../models/Shop.js";
import { AppError } from "../utils/AppError.js";
export const getShopForUser = async (userId) => {
  const shop = await Shop.findOne({ owner: userId });
  if (!shop)
    throw new AppError("Create your shop before managing records", 404);
  return shop;
};
export const ShopService = {
  create: async (userId, data) => {
    if (await Shop.exists({ owner: userId }))
      throw new AppError("A shop already exists for this account", 409);
    return Shop.create({
      shopName: data.shopName,
      ownerName: data.ownerName,
      mobileNumber: data.mobileNumber,
      address: data.address,
      defaultCreditPeriod: data.defaultCreditPeriod,
      owner: userId,
    });
  },
  get: (userId) => getShopForUser(userId),
  update: async (userId, data) => {
    const shop = await getShopForUser(userId);
    for (const field of ["shopName", "ownerName", "mobileNumber", "address", "defaultCreditPeriod"])
      if (data[field] !== undefined) shop[field] = data[field];
    return shop.save();
  },
};
