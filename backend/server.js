import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { connectDB } from "./config/db.js";

import { AppError } from "./utils/AppError.js";
import { notFoundMiddleware } from "./middleware/notFoundMiddleware.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import shopRoutes from "./routes/shop.routes.js";
import customerRoutes from "./routes/customer.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import receiptRoutes from "./routes/receipt.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// ==========================
// Middleware
// ==========================

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/api/auth", authRoutes);
app.use("/api/shop", shopRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/receipts", receiptRoutes);
app.use("/api/dashboard", dashboardRoutes);

// ==========================
// Health Check
// ==========================

app.get("/api/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Shri Lata Kirana Stores API is running",
  });
});

app.get("/api/test-error", (req, res, next) => {
  next(new AppError("This is a test error", 400));
});

// Gloal Error Handling Middleware
app.use(notFoundMiddleware);
app.use(errorMiddleware);
// Connect to MongoDB
connectDB();

// ==========================
// Start Server
// ==========================

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
