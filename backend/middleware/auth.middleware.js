import { AppError } from "../utils/AppError.js";
import { User } from "../models/User.js";
import { verifyAccessToken } from "../utils/jwt.js";

export const protect = async (req, res, next) => {
  try {
    const [scheme, token] = (req.headers.authorization || "").split(" ");
    if (scheme !== "Bearer" || !token)
      throw new AppError("Authentication is required", 401);

    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub);
    if (!user || !user.isActive)
      throw new AppError("Account is no longer active", 401);

    req.user = user;
    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return next(new AppError("Invalid or expired access token", 401));
    }
    next(error);
  }
};

export const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new AppError("You are not authorized to perform this action", 403),
      );
    next();
  };
