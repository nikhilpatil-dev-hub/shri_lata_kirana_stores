import mongoose from "mongoose";
const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 150 },
    quantity: { type: Number, min: 0, default: 1 },
    unitPrice: { type: Number, min: 0, required: true },
    total: { type: Number, min: 0, required: true },
  },
  { _id: false },
);
const transactionSchema = new mongoose.Schema(
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
    totalAmount: { type: Number, required: true, min: 0.01 },
    paidAmount: { type: Number, required: true, min: 0, default: 0 },
    dueAmount: { type: Number, required: true, min: 0 },
    transactionType: {
      type: String,
      enum: ["CASH", "UPI", "UDHAR", "PARTIAL"],
      required: true,
    },
    items: { type: [itemSchema], default: [] },
    notes: { type: String, trim: true, maxlength: 1000, default: "" },
    transactionDate: { type: Date, required: true, default: Date.now },
    dueDate: { type: Date, default: null },
  },
  { timestamps: true },
);
transactionSchema.index({ shop: 1, transactionDate: -1 });
transactionSchema.index({ customer: 1, transactionDate: -1 });
transactionSchema.index({ shop: 1, dueDate: 1 });
export const Transaction = mongoose.model("Transaction", transactionSchema);
