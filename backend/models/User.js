import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true, maxlength: 50 },
    lastName: { type: String, required: true, trim: true, maxlength: 50 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ["ADMIN"], default: "ADMIN" },
    emailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String, select: false },
    emailVerificationExpiresAt: { type: Date, select: false },
    passwordResetToken: { type: String, select: false },
    passwordResetExpiresAt: { type: Date, select: false },
    refreshTokenHash: { type: String, select: false },
    isActive: { type: Boolean, default: false },
    lastLoginAt: Date,
  },
  { timestamps: true },
);

userSchema.methods.toProfile = function toProfile() {
  return {
    id: this._id.toString(),
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    mobileNumber: this.mobileNumber,
    role: this.role,
  };
};

export const User = mongoose.model("User", userSchema);
