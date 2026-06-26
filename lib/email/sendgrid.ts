/**
 * AfriMatch Email Service — migrated from SendGrid to Resend
 * Keeps the same function signatures so existing imports continue to work.
 */

import { Resend } from "resend";

const FROM = process.env.RESEND_FROM_EMAIL || "AfriMatch <onboarding@resend.dev>";
const APP_URL = process.env.NEXTAUTH_URL || "https://afrimatch.app";

// ─── Internal helper ──────────────────────────────────────────────────────────
async function sendEmail(to: string, subject: string, html: string, text?: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("Email service is not configured");
  }
  const resend = new Resend(apiKey);
  return resend.emails.send({ from: FROM, to, subject, html, text });
}

// ─── Email verification ───────────────────────────────────────────────────────
export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${APP_URL}/auth/verify-email?token=${token}`;
  return sendEmail(
    email,
    "Verify Your AfriMatch Account",
    `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
      <h2 style="color:#d97706;">Verify your email address</h2>
      <p>Click the button below to verify your AfriMatch account. This link expires in 24 hours.</p>
      <a href="${verificationUrl}" style="display:inline-block;padding:12px 28px;background:#d97706;color:#fff;border-radius:8px;text-decoration:none;font-weight:700;">Verify Email</a>
      <p style="color:#64748b;font-size:13px;margin-top:24px;">If you didn't create this account, you can safely ignore this email.</p>
    </div>`,
    `Verify your AfriMatch account: ${verificationUrl}`
  );
}

// ─── Password reset ───────────────────────────────────────────────────────────
export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${APP_URL}/auth/reset-password?token=${token}`;
  return sendEmail(
    email,
    "Reset Your AfriMatch Password",
    `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
      <h2 style="color:#d97706;">Reset your password</h2>
      <p>We received a request to reset your AfriMatch password. Click below to set a new one. This link expires in 1 hour.</p>
      <a href="${resetUrl}" style="display:inline-block;padding:12px 28px;background:#d97706;color:#fff;border-radius:8px;text-decoration:none;font-weight:700;">Reset Password</a>
      <p style="color:#64748b;font-size:13px;margin-top:24px;">If you didn't request this, your password will remain unchanged.</p>
    </div>`,
    `Reset your AfriMatch password: ${resetUrl}`
  );
}

// ─── Welcome email ────────────────────────────────────────────────────────────
export async function sendWelcomeEmail(email: string, name: string, mode?: string) {
  const modeText = mode === "dating" ? "Dating" : mode === "professional" ? "Professional" : "Dating & Professional";
  return sendEmail(
    email,
    "Welcome to AfriMatch — Let's Get Started! 🚀",
    `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
      <h2 style="color:#d97706;">Welcome, ${name}! 🎉</h2>
      <p>Your account has been created in <strong>${modeText}</strong> mode. Complete your profile to start getting matches.</p>
      <a href="${APP_URL}/auth/profile-setup" style="display:inline-block;padding:12px 28px;background:#d97706;color:#fff;border-radius:8px;text-decoration:none;font-weight:700;">Complete Your Profile →</a>
    </div>`,
    `Welcome to AfriMatch, ${name}! Complete your profile: ${APP_URL}/auth/profile-setup`
  );
}

// ─── Subscription confirmation ────────────────────────────────────────────────
export async function sendSubscriptionConfirmationEmail(
  email: string,
  name: string,
  planName: string,
  amount: number,
  currency: string,
  billingCycle: string
) {
  return sendEmail(
    email,
    `Welcome to ${planName} Plan — AfriMatch Premium 🎉`,
    `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
      <h2 style="color:#d97706;">Subscription Confirmed! ✅</h2>
      <p>Hi ${name}, your <strong>${planName}</strong> plan is now active.</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;">
        <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0;">Plan</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;font-weight:700;">${planName}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #e2e8f0;">Billing</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;">${billingCycle}</td></tr>
        <tr><td style="padding:8px;font-weight:700;">Amount</td><td style="padding:8px;font-weight:700;">${currency} ${amount}</td></tr>
      </table>
      <a href="${APP_URL}/dashboard" style="display:inline-block;padding:12px 28px;background:#d97706;color:#fff;border-radius:8px;text-decoration:none;font-weight:700;">Access Premium Features →</a>
    </div>`,
    `Subscription confirmed: ${planName} — ${currency} ${amount}/${billingCycle}`
  );
}

// ─── Payment failure ──────────────────────────────────────────────────────────
export async function sendPaymentFailureEmail(email: string, name: string, reason: string) {
  return sendEmail(
    email,
    "Payment Failed — AfriMatch",
    `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
      <h2 style="color:#ef4444;">Payment Failed ⚠️</h2>
      <p>Hi ${name}, we were unable to process your payment: <strong>${reason}</strong></p>
      <a href="${APP_URL}/account/billing" style="display:inline-block;padding:12px 28px;background:#d97706;color:#fff;border-radius:8px;text-decoration:none;font-weight:700;">Update Payment Method</a>
    </div>`,
    `Payment failed: ${reason}. Update your payment method: ${APP_URL}/account/billing`
  );
}

// ─── Account suspension ───────────────────────────────────────────────────────
export async function sendAccountSuspensionEmail(email: string, name: string, reason: string) {
  return sendEmail(
    email,
    "Account Suspended — AfriMatch",
    `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
      <h2 style="color:#ef4444;">Account Suspended</h2>
      <p>Hi ${name}, your account has been suspended for the following reason: <strong>${reason}</strong></p>
      <p>If you believe this is a mistake, please contact <a href="mailto:support@afrimatch.app">support@afrimatch.app</a>.</p>
    </div>`,
    `Your AfriMatch account has been suspended. Reason: ${reason}. Contact support@afrimatch.app`
  );
}

// ─── Match notification ───────────────────────────────────────────────────────
export async function sendMatchNotificationEmail(
  email: string,
  recipientName: string,
  matchName: string,
  matchPhotoUrl?: string
) {
  return sendEmail(
    email,
    `${matchName} liked your profile on AfriMatch! 💛`,
    `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
      <h2 style="color:#d97706;">You have a new match! 💛</h2>
      <p>Hi ${recipientName.split(" ")[0]}, <strong>${matchName}</strong> liked your profile. Don't keep them waiting!</p>
      ${matchPhotoUrl ? `<img src="${matchPhotoUrl}" width="80" height="80" style="border-radius:50%;object-fit:cover;border:3px solid #d97706;" />` : ""}
      <br/><br/>
      <a href="${APP_URL}/dating" style="display:inline-block;padding:12px 28px;background:#e11d48;color:#fff;border-radius:8px;text-decoration:none;font-weight:700;">View Your Match →</a>
    </div>`,
    `${matchName} liked your profile on AfriMatch! Visit ${APP_URL}/dating to respond.`
  );
}
