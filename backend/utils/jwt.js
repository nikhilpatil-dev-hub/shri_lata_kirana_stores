import jwt from "jsonwebtoken";
import crypto from "crypto";

const accessSecret = () =>
  process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET;
const refreshSecret = () =>
  process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;

const requireSecret = (secret, name) => {
  if (!secret) throw new Error(`${name} must be configured`);
  return secret;
};

export const createAccessToken = (user) =>
  jwt.sign(
    { sub: user._id.toString(), role: user.role },
    requireSecret(accessSecret(), "JWT_ACCESS_SECRET"),
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    },
  );

export const createRefreshToken = (user) =>
  jwt.sign(
    { sub: user._id.toString(), type: "refresh", jti: crypto.randomUUID() },
    requireSecret(refreshSecret(), "JWT_REFRESH_SECRET"),
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    },
  );

export const verifyAccessToken = (token) =>
  jwt.verify(token, requireSecret(accessSecret(), "JWT_ACCESS_SECRET"));
export const verifyRefreshToken = (token) =>
  jwt.verify(token, requireSecret(refreshSecret(), "JWT_REFRESH_SECRET"));
export const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");
export const createOpaqueToken = () => crypto.randomBytes(32).toString("hex");
