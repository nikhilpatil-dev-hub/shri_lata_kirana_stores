import mongoose from "mongoose";
const shopSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    shopName: { type: String, required: true, trim: true, maxlength: 100 },
    ownerName: { type: String, required: true, trim: true, maxlength: 100 },
    mobileNumber: {
      type: String,
      required: true,
      trim: true,
      match: /^\+?[1-9]\d{7,14}$/,
    },
    address: { type: String, trim: true, maxlength: 300, default: "" },
    defaultCreditPeriod: { type: Number, min: 0, max: 365, default: 30 },
    settings: {
      currency: { type: String, default: "INR", uppercase: true },
      reminderEnabled: { type: Boolean, default: true },
      reminderDaysBeforeDue: { type: Number, min: 0, max: 30, default: 1 },
    },
  },
  { timestamps: true },
);
// shopSchema.index({ owner: 1 }, { unique: true });
export const Shop = mongoose.model("Shop", shopSchema);
