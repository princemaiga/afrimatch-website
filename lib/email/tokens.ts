import crypto from "crypto";
import { db } from "@/lib/db/client";

// In-memory token store (in production, use database)
const tokenStore = new Map<string, { email: string; type: string; expiresAt: Date }>();

/**
 * Generate email verification token
 */
export function generateVerificationToken(email: string): string {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  tokenStore.set(token, {
    email,
    type: "email_verification",
    expiresAt,
  });

  return token;
}

/**
 * Generate password reset token
 */
export function generatePasswordResetToken(email: string): string {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  tokenStore.set(token, {
    email,
    type: "password_reset",
    expiresAt,
  });

  return token;
}

/**
 * Verify token and get email
 */
export function verifyToken(token: string, type: string): string | null {
  const tokenData = tokenStore.get(token);

  if (!tokenData) {
    return null;
  }

  if (tokenData.type !== type) {
    return null;
  }

  if (new Date() > tokenData.expiresAt) {
    tokenStore.delete(token);
    return null;
  }

  return tokenData.email;
}

/**
 * Consume token (delete after use)
 */
export function consumeToken(token: string): void {
  tokenStore.delete(token);
}

/**
 * Clean up expired tokens (run periodically)
 */
export function cleanupExpiredTokens(): void {
  const now = new Date();

  for (const [token, data] of tokenStore.entries()) {
    if (now > data.expiresAt) {
      tokenStore.delete(token);
    }
  }
}

// Run cleanup every hour
setInterval(cleanupExpiredTokens, 60 * 60 * 1000);
