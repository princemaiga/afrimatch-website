/**
 * AfriMatch Email Service — powered by Resend
 * Handles all transactional emails: welcome, verification, match notifications, etc.
 */

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Use a verified sender. Falls back to onboarding@resend.dev for testing
// when a custom domain is not yet verified.
const FROM = process.env.RESEND_FROM_EMAIL || "AfriMatch <onboarding@resend.dev>";
const APP_URL = process.env.NEXTAUTH_URL || "https://afrimatch.app";

// ─── Shared HTML wrapper ──────────────────────────────────────────────────────
function emailWrapper(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AfriMatch</title>
</head>
<body style="margin:0;padding:0;background:#0a0f1e;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#e2e8f0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0f1e;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#111827;border-radius:16px;overflow:hidden;border:1px solid #1e293b;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#d97706,#ea580c);padding:32px 40px;text-align:center;">
              <h1 style="margin:0;font-size:28px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">AfriMatch</h1>
              <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.8);">Connecting Africa's Hearts & Minds</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #1e293b;text-align:center;">
              <p style="margin:0;font-size:12px;color:#64748b;">
                © ${new Date().getFullYear()} AfriMatch · 
                <a href="${APP_URL}" style="color:#d97706;text-decoration:none;">afrimatch.app</a> · 
                <a href="${APP_URL}/unsubscribe" style="color:#64748b;text-decoration:none;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─── Button helper ────────────────────────────────────────────────────────────
function ctaButton(text: string, href: string, color = "#d97706"): string {
  return `<a href="${href}" style="display:inline-block;padding:14px 32px;background:${color};color:#ffffff;font-weight:700;font-size:15px;text-decoration:none;border-radius:10px;margin-top:8px;">${text}</a>`;
}

// ─── 1. Welcome email ─────────────────────────────────────────────────────────
export async function sendWelcomeEmail(to: string, name: string) {
  const firstName = name.split(" ")[0];
  const html = emailWrapper(`
    <h2 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#f1f5f9;">
      Welcome to AfriMatch, ${firstName}! 🎉
    </h2>
    <p style="margin:0 0 20px;font-size:15px;color:#94a3b8;line-height:1.6;">
      You've just joined Africa's fastest-growing platform for meaningful connections — 
      whether you're looking for love, building your professional network, or both.
    </p>
    <p style="margin:0 0 8px;font-size:15px;color:#e2e8f0;font-weight:600;">Here's how to get started:</p>
    <table cellpadding="0" cellspacing="0" style="margin:0 0 24px;width:100%;">
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #1e293b;">
          <span style="color:#d97706;font-weight:700;">1.</span>
          <span style="color:#94a3b8;margin-left:8px;">Complete your profile to get better matches</span>
        </td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #1e293b;">
          <span style="color:#d97706;font-weight:700;">2.</span>
          <span style="color:#94a3b8;margin-left:8px;">Choose your mode: Dating ❤️ or Professional 💼</span>
        </td>
      </tr>
      <tr>
        <td style="padding:10px 0;">
          <span style="color:#d97706;font-weight:700;">3.</span>
          <span style="color:#94a3b8;margin-left:8px;">Start discovering people across Africa</span>
        </td>
      </tr>
    </table>
    <div style="text-align:center;">
      ${ctaButton("Complete Your Profile →", `${APP_URL}/auth/profile-setup`)}
    </div>
    <p style="margin:28px 0 0;font-size:13px;color:#64748b;text-align:center;">
      Questions? Reply to this email or visit our <a href="${APP_URL}/help" style="color:#d97706;text-decoration:none;">Help Center</a>.
    </p>
  `);

  return resend.emails.send({
    from: FROM,
    to,
    subject: `Welcome to AfriMatch, ${firstName}! 🌍`,
    html,
  });
}

// ─── 2. Email verification ────────────────────────────────────────────────────
export async function sendVerificationEmail(to: string, name: string, token: string) {
  const firstName = name.split(" ")[0];
  const verifyUrl = `${APP_URL}/api/auth/verify-email?token=${token}`;
  const html = emailWrapper(`
    <h2 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#f1f5f9;">
      Verify your email address
    </h2>
    <p style="margin:0 0 24px;font-size:15px;color:#94a3b8;line-height:1.6;">
      Hi ${firstName}, please click the button below to verify your email address and activate your AfriMatch account.
      This link expires in <strong style="color:#e2e8f0;">24 hours</strong>.
    </p>
    <div style="text-align:center;">
      ${ctaButton("Verify Email Address", verifyUrl)}
    </div>
    <p style="margin:24px 0 0;font-size:13px;color:#64748b;">
      If you didn't create an AfriMatch account, you can safely ignore this email.
    </p>
  `);

  return resend.emails.send({
    from: FROM,
    to,
    subject: "Verify your AfriMatch email address",
    html,
  });
}

// ─── 3. New match notification ────────────────────────────────────────────────
export async function sendMatchNotificationEmail(
  to: string,
  recipientName: string,
  matchName: string,
  matchPhotoUrl?: string
) {
  const firstName = recipientName.split(" ")[0];
  const photoHtml = matchPhotoUrl
    ? `<img src="${matchPhotoUrl}" alt="${matchName}" width="80" height="80" style="border-radius:50%;object-fit:cover;border:3px solid #d97706;margin-bottom:12px;" />`
    : `<div style="width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#d97706,#ea580c);display:flex;align-items:center;justify-content:center;margin:0 auto 12px;font-size:32px;line-height:80px;text-align:center;">💛</div>`;

  const html = emailWrapper(`
    <h2 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#f1f5f9;">
      You have a new match! 💛
    </h2>
    <p style="margin:0 0 24px;font-size:15px;color:#94a3b8;line-height:1.6;">
      Great news, ${firstName}! <strong style="color:#e2e8f0;">${matchName}</strong> liked your profile. 
      Don't keep them waiting — say hello!
    </p>
    <div style="text-align:center;margin-bottom:24px;">
      ${photoHtml}
      <p style="margin:0;font-size:18px;font-weight:700;color:#f1f5f9;">${matchName}</p>
    </div>
    <div style="text-align:center;">
      ${ctaButton("View Your Match →", `${APP_URL}/dating`, "#e11d48")}
    </div>
    <p style="margin:24px 0 0;font-size:13px;color:#64748b;text-align:center;">
      Upgrade to <a href="${APP_URL}/pricing" style="color:#d97706;text-decoration:none;">Premium</a> to see all your matches and send unlimited messages.
    </p>
  `);

  return resend.emails.send({
    from: FROM,
    to,
    subject: `${matchName} liked your profile on AfriMatch! 💛`,
    html,
  });
}

// ─── 4. Password reset ────────────────────────────────────────────────────────
export async function sendPasswordResetEmail(to: string, name: string, token: string) {
  const firstName = name.split(" ")[0];
  const resetUrl = `${APP_URL}/auth/reset-password?token=${token}`;
  const html = emailWrapper(`
    <h2 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#f1f5f9;">
      Reset your password
    </h2>
    <p style="margin:0 0 24px;font-size:15px;color:#94a3b8;line-height:1.6;">
      Hi ${firstName}, we received a request to reset your AfriMatch password. 
      Click the button below to create a new password. This link expires in <strong style="color:#e2e8f0;">1 hour</strong>.
    </p>
    <div style="text-align:center;">
      ${ctaButton("Reset Password", resetUrl)}
    </div>
    <p style="margin:24px 0 0;font-size:13px;color:#64748b;">
      If you didn't request a password reset, please ignore this email. Your password will not change.
    </p>
  `);

  return resend.emails.send({
    from: FROM,
    to,
    subject: "Reset your AfriMatch password",
    html,
  });
}

// ─── 5. Premium subscription confirmation ────────────────────────────────────
export async function sendSubscriptionConfirmationEmail(
  to: string,
  name: string,
  planName: string,
  mode: "dating" | "professional"
) {
  const firstName = name.split(" ")[0];
  const modeLabel = mode === "dating" ? "Dating Premium ❤️" : "Professional Premium 💼";
  const html = emailWrapper(`
    <h2 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#f1f5f9;">
      You're now Premium! ⭐
    </h2>
    <p style="margin:0 0 20px;font-size:15px;color:#94a3b8;line-height:1.6;">
      Congratulations, ${firstName}! Your <strong style="color:#d97706;">${planName} — ${modeLabel}</strong> subscription is now active.
    </p>
    <table cellpadding="0" cellspacing="0" style="margin:0 0 24px;width:100%;background:#1e293b;border-radius:10px;padding:20px;">
      <tr>
        <td style="padding:8px 0;color:#94a3b8;font-size:14px;">
          ${mode === "dating"
            ? `✅ Unlimited likes &amp; super likes<br/>✅ See who liked you<br/>✅ Profile boost<br/>✅ Advanced filters<br/>✅ Read receipts`
            : `✅ InMail messaging<br/>✅ Featured profile<br/>✅ Advanced job filters<br/>✅ Mentor booking priority<br/>✅ Profile analytics`
          }
        </td>
      </tr>
    </table>
    <div style="text-align:center;">
      ${ctaButton("Go to Dashboard →", `${APP_URL}/dashboard`)}
    </div>
    <p style="margin:24px 0 0;font-size:13px;color:#64748b;text-align:center;">
      Manage your subscription anytime from the <a href="${APP_URL}/pricing" style="color:#d97706;text-decoration:none;">pricing page</a>.
    </p>
  `);

  return resend.emails.send({
    from: FROM,
    to,
    subject: `Welcome to AfriMatch Premium, ${firstName}! ⭐`,
    html,
  });
}

// ─── 6. Contact form confirmation ─────────────────────────────────────────────
export async function sendContactConfirmationEmail(to: string, name: string, subject: string) {
  const firstName = name.split(" ")[0];
  const html = emailWrapper(`
    <h2 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#f1f5f9;">
      We received your message ✅
    </h2>
    <p style="margin:0 0 20px;font-size:15px;color:#94a3b8;line-height:1.6;">
      Hi ${firstName}, thank you for reaching out! We've received your message about 
      <strong style="color:#e2e8f0;">"${subject}"</strong> and will get back to you within 24–48 hours.
    </p>
    <p style="margin:0 0 24px;font-size:15px;color:#94a3b8;line-height:1.6;">
      In the meantime, you can browse our <a href="${APP_URL}/help" style="color:#d97706;text-decoration:none;">Help Center</a> 
      for quick answers to common questions.
    </p>
    <div style="text-align:center;">
      ${ctaButton("Visit Help Center", `${APP_URL}/help`)}
    </div>
  `);

  return resend.emails.send({
    from: FROM,
    to,
    subject: "We received your message — AfriMatch Support",
    html,
  });
}
