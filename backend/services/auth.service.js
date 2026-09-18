import bcrypt from "bcryptjs";
import { AppError } from "../utils/AppError.js";
import { User } from "../models/User.js";
import { EmailService } from "./email.service.js";
import {
  createAccessToken,
  createOpaqueToken,
  createRefreshToken,
  hashToken,
  verifyRefreshToken,
} from "../utils/jwt.js";

const tokenExpiryMinutes =
  Number(process.env.EMAIL_TOKEN_EXPIRES_IN_MINUTES) || 15;
const TOKEN_EXPIRY_MS = tokenExpiryMinutes * 60 * 1000;

const tokenExpiry = () => new Date(Date.now() + TOKEN_EXPIRY_MS);

const issueTokens = async (user) => {
  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);
  user.refreshTokenHash = hashToken(refreshToken);
  await user.save();
  return { accessToken, refreshToken };
};

const findValidTokenUser = (field, token) => {
  const expiryField = field.replace("Token", "ExpiresAt");
  return User.findOne({
    [field]: hashToken(token),
    [expiryField]: { $gt: new Date() },
  }).select(`+${field} +${expiryField}`);
};

export const AuthService = {
  async register(data) {
    const email = data.email.toLowerCase();
    const existingUser = await User.findOne({
      $or: [{ email }, { mobileNumber: data.mobileNumber }],
    });
    if (existingUser) {
      throw new AppError(
        existingUser.email === email
          ? "Email address is already registered"
          : "Mobile number is already registered",
        409,
      );
    }

    const verificationToken = createOpaqueToken();
    const user = await User.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email,
      mobileNumber: data.mobileNumber,
      passwordHash: await bcrypt.hash(data.password, 12),
      emailVerificationToken: hashToken(verificationToken),
      emailVerificationExpiresAt: tokenExpiry(),
    });

    await EmailService.sendVerificationEmail(user, verificationToken);
    return user.toProfile();
  },

  async verifyEmail(token) {
    const user = await findValidTokenUser("emailVerificationToken", token);
    if (!user)
      throw new AppError("Verification token is invalid or has expired", 400);

    user.emailVerified = true;
    user.isActive = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpiresAt = undefined;
    await user.save();
    return user.toProfile();
  },

  async resendVerification(email) {
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+emailVerificationToken +emailVerificationExpiresAt",
    );
    if (!user) return;
    if (user.emailVerified)
      throw new AppError("Email address is already verified", 400);

    const verificationToken = createOpaqueToken();
    user.emailVerificationToken = hashToken(verificationToken);
    user.emailVerificationExpiresAt = tokenExpiry();
    await user.save();
    await EmailService.sendVerificationEmail(user, verificationToken);
  },

  async login(email, password) {
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+passwordHash +refreshTokenHash",
    );
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new AppError("Invalid email or password", 401);
    }
    if (!user.emailVerified || !user.isActive)
      throw new AppError(
        "Please verify your email address before logging in",
        403,
      );

    user.lastLoginAt = new Date();
    const tokens = await issueTokens(user);
    return { ...tokens, user: user.toProfile() };
  },

  async forgotPassword(email) {
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+passwordResetToken +passwordResetExpiresAt",
    );
    if (!user) return;

    const resetToken = createOpaqueToken();
    user.passwordResetToken = hashToken(resetToken);
    user.passwordResetExpiresAt = tokenExpiry();
    await user.save();
    await EmailService.sendResetPasswordEmail(user, resetToken);
  },

  async resetPassword(token, password) {
    const user = await findValidTokenUser("passwordResetToken", token);
    if (!user) throw new AppError("Reset token is invalid or has expired", 400);

    user.passwordHash = await bcrypt.hash(password, 12);
    user.passwordResetToken = undefined;
    user.passwordResetExpiresAt = undefined;
    user.refreshTokenHash = undefined;
    await user.save();
  },

  async refreshTokens(refreshToken) {
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new AppError("Invalid or expired refresh token", 401);
    }
    if (payload.type !== "refresh")
      throw new AppError("Invalid refresh token", 401);

    const currentHash = hashToken(refreshToken);
    const user = await User.findOne({
      _id: payload.sub,
      refreshTokenHash: currentHash,
    }).select("+refreshTokenHash");
    if (!user || !user.isActive)
      throw new AppError("Refresh token has been revoked", 401);

    const accessToken = createAccessToken(user);
    const nextRefreshToken = createRefreshToken(user);
    const update = await User.updateOne(
      { _id: user._id, refreshTokenHash: currentHash },
      { $set: { refreshTokenHash: hashToken(nextRefreshToken) } },
    );
    if (update.modifiedCount !== 1)
      throw new AppError("Refresh token has already been used", 401);

    return {
      accessToken,
      refreshToken: nextRefreshToken,
      user: user.toProfile(),
    };
  },

  async logout(refreshToken) {
    if (!refreshToken) return;
    const tokenHash = hashToken(refreshToken);
    await User.updateOne(
      { refreshTokenHash: tokenHash },
      { $unset: { refreshTokenHash: 1 } },
    );
  },
};
