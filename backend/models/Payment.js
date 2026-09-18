import mongoose from "mongoose";
const paymentSchema = new mongoose.Schema(
  {
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
      index: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true,
    },
    transaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
      default: null,
      index: true,
    },
    amount: { type: Number, required: true, min: 0.01 },
    method: { type: String, enum: ["CASH", "UPI"], required: true },
    paymentDate: { type: Date, default: Date.now },
    notes: { type: String, trim: true, maxlength: 500, default: "" },
  },
  { timestamps: true },
);
paymentSchema.index({ customer: 1, paymentDate: -1 });
paymentSchema.index({ shop: 1, paymentDate: -1 });
export const Payment = mongoose.model("Payment", paymentSchema);
