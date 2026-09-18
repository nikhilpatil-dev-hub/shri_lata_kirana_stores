import nodemailer from "nodemailer";
import { AppError } from "../utils/AppError.js";

const getTransporter = () => {
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_PORT ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASS
  ) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
};

const sendEmail = async ({ to, subject, html }) => {
  const transporter = getTransporter();
  if (!transporter) {
    if (process.env.NODE_ENV === "production") {
      throw new AppError("Email service is not configured", 503);
    }
    console.warn(
      `Email not sent (SMTP is not configured). Intended recipient: ${to}; subject: ${subject}`,
    );
    return;
  }

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to,
    subject,
    html,
  });
};

const frontendUrl = () =>
  (process.env.CLIENT_URL || "http://localhost:5173").replace(/\/$/, "");
const tokenExpiryMinutes =
  Number(process.env.EMAIL_TOKEN_EXPIRES_IN_MINUTES) || 15;

const escapeHtml = (value) =>
  String(value).replace(
    /[&<>'"]/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[
        character
      ],
  );

const createEmailTemplate = ({
  title,
  preview,
  greeting,
  message,
  actionLabel,
  actionUrl,
  token,
}) => `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
  </head>
  <body style="margin:0;background:#f5f7f4;color:#1f2937;font-family:Arial,Helvetica,sans-serif;">
    <span style="display:none!important;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preview)}</span>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:32px 16px;background:#f5f7f4;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 24px rgba(31,41,55,.08);">
          <tr><td style="padding:28px 40px;background:#166534;color:#ffffff;">
            <div style="font-size:12px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;">Shri Lata Kirana Stores</div>
            <div style="margin-top:8px;font-size:25px;font-weight:700;line-height:1.25;">Your digital khata, made simple.</div>
          </td></tr>
          <tr><td style="padding:36px 40px 16px;">
            <h1 style="margin:0 0 18px;font-size:25px;line-height:1.3;color:#111827;">${escapeHtml(title)}</h1>
            <p style="margin:0 0 16px;font-size:16px;line-height:1.6;">Hello ${escapeHtml(greeting)},</p>
            <p style="margin:0 0 28px;font-size:16px;line-height:1.6;">${escapeHtml(message)}</p>
            <table role="presentation" cellspacing="0" cellpadding="0"><tr><td style="border-radius:8px;background:#15803d;">
              <a href="${actionUrl}" style="display:inline-block;padding:14px 22px;color:#ffffff;font-size:16px;font-weight:700;text-decoration:none;">${escapeHtml(actionLabel)}</a>
            </td></tr></table>
          </td></tr>
          <tr><td style="padding:12px 40px 28px;">
            <div style="padding:16px;border:1px solid #fde68a;border-radius:8px;background:#fffbeb;color:#92400e;font-size:14px;line-height:1.55;">
              <strong>This link expires in ${tokenExpiryMinutes} minutes.</strong><br />
              If the button does not work, use this verification code: <span style="font-family:monospace;font-size:12px;word-break:break-all;">${escapeHtml(token)}</span>
            </div>
            <p style="margin:24px 0 0;color:#6b7280;font-size:13px;line-height:1.55;">If you did not request this, you can safely ignore this email. Do not share this link or code with anyone.</p>
          </td></tr>
          <tr><td style="padding:20px 40px;background:#f9fafb;color:#6b7280;font-size:12px;text-align:center;">© ${new Date().getFullYear()} Shri Lata Kirana Stores</td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;

export const EmailService = {
  sendVerificationEmail: (user, token) =>
    sendEmail({
      to: user.email,
      subject: "Verify your Shri Lata Kirana Stores account",
      html: createEmailTemplate({
        title: "Verify your email address",
        preview: "Confirm your email to activate your account.",
        greeting: user.firstName,
        message:
          "Welcome! Please verify your email address to activate your account and start managing your khata.",
        actionLabel: "Verify Email Address",
        actionUrl: `${frontendUrl()}/verify-email?token=${encodeURIComponent(token)}`,
        token,
      }),
    }),
  sendResetPasswordEmail: (user, token) =>
    sendEmail({
      to: user.email,
      subject: "Reset your Shri Lata Kirana Stores password",
      html: createEmailTemplate({
        title: "Reset your password",
        preview: "Use this secure link to choose a new password.",
        greeting: user.firstName,
        message:
          "We received a request to reset your password. Choose a new secure password to continue.",
        actionLabel: "Reset Password",
        actionUrl: `${frontendUrl()}/reset-password?token=${encodeURIComponent(token)}`,
        token,
      }),
    }),
};
