import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import {connectDB} from './config/db.js'; 

import { AppError } from "./utils/AppError.js";
import { notFoundMiddleware } from "./middleware/notFoundMiddleware.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

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