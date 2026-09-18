import mongoose from "mongoose";
const notificationSchema = new mongoose.Schema(
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
      default: null,
    },
    type: {
      type: String,
      enum: ["DUE_TODAY", "OVERDUE", "PAYMENT_RECEIVED"],
      required: true,
    },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    readAt: { type: Date, default: null },
  },
  { timestamps: true },
);
notificationSchema.index({ shop: 1, createdAt: -1 });
notificationSchema.index({ shop: 1, type: 1, "metadata.transactionId": 1 });
export const Notification = mongoose.model("Notification", notificationSchema);
