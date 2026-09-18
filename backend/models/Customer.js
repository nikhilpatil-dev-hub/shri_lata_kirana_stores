import mongoose from "mongoose";
const customerSchema = new mongoose.Schema(
  {
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    mobileNumber: {
      type: String,
      required: true,
      trim: true,
      match: /^\+?[1-9]\d{7,14}$/,
    },
    address: { type: String, trim: true, maxlength: 300, default: "" },
    email: { type: String, trim: true, lowercase: true, default: "" },
    notes: { type: String, trim: true, maxlength: 1000, default: "" },
    creditPeriod: { type: Number, min: 0, max: 365, default: 30 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);
customerSchema.index({ shop: 1, mobileNumber: 1 }, { unique: true });
customerSchema.index({ shop: 1, name: 1 });
export const Customer = mongoose.model("Customer", customerSchema);
