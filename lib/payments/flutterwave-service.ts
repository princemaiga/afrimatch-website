/**
 * AfriMatch Flutterwave Payment Service
 *
 * Handles all Flutterwave subscription lifecycle operations:
 * - Create payment (hosted checkout)
 * - Upgrade / downgrade plan
 * - Cancel subscription
 * - Retry failed payment
 * - Apply promo codes
 * - Verify transactions
 */

import { getPlan, type Plan } from "./plans";
import { getFlutterwaveAmount, getPreferredCurrency } from "./routing";

const FLW_BASE_URL = "https://api.flutterwave.com/v3";
const FLW_SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY || "";

// ─── HTTP Helper ──────────────────────────────────────────────────────────────

async function flwRequest<T>(
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  path: string,
  body?: unknown
): Promise<T> {
  const res = await fetch(`${FLW_BASE_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${FLW_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const data = await res.json();
  if (!res.ok || data.status === "error") {
    throw new Error(data.message || `Flutterwave API error: ${res.status}`);
  }
  return data;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FlwPaymentLink {
  link: string;
  txRef: string;
}

export interface FlwVerifyResult {
  success: boolean;
  txRef: string;
  flwRef?: string;
  amount?: number;
  currency?: string;
  status?: string;
  planId?: string;
  userId?: string;
  customerId?: string;
}

// ─── Create Payment (Hosted Checkout) ────────────────────────────────────────

export interface CreateFlwPaymentOptions {
  planId: string;
  userId: string;
  email: string;
  name: string;
  phone?: string;
  countryCode: string;
  successUrl: string;
  cancelUrl: string;
  promoCode?: string;
  discountPercent?: number;
}

export async function createFlutterwavePayment(
  opts: CreateFlwPaymentOptions
): Promise<FlwPaymentLink> {
  const plan = getPlan(opts.planId);
  const currency = getPreferredCurrency(opts.countryCode);
  let { amount } = getFlutterwaveAmount(plan.priceUSD, currency);

  // Apply discount
  if (opts.discountPercent && opts.discountPercent > 0) {
    amount = Math.round(amount * (1 - opts.discountPercent / 100) * 100) / 100;
  }

  const txRef = `afrimatch-${opts.userId}-${Date.now()}`;

  const payload = {
    tx_ref: txRef,
    amount,
    currency,
    redirect_url: opts.successUrl,
    customer: {
      email: opts.email,
      name: opts.name,
      phonenumber: opts.phone,
    },
    customizations: {
      title: "AfriMatch",
      description: `Subscribe to ${plan.name}`,
      logo: "https://afrimatch.app/images/afrimatch-logo.png",
    },
    meta: {
      userId: opts.userId,
      planId: opts.planId,
      provider: "flutterwave",
      promoCode: opts.promoCode || "",
      countryCode: opts.countryCode,
    },
    payment_options: "card,mobilemoney,ussd,banktransfer,mpesa,barter,account",
  };

  const response = await flwRequest<{ status: string; data: { link: string } }>(
    "POST",
    "/payments",
    payload
  );

  return { link: response.data.link, txRef };
}

// ─── Verify Transaction ───────────────────────────────────────────────────────

export async function verifyFlutterwaveTransaction(
  transactionId: string
): Promise<FlwVerifyResult> {
  try {
    const response = await flwRequest<{
      status: string;
      data: {
        id: number;
        tx_ref: string;
        flw_ref: string;
        amount: number;
        currency: string;
        status: string;
        meta: Record<string, string>;
        customer: { email: string };
      };
    }>("GET", `/transactions/${transactionId}/verify`);

    const { data } = response;
    return {
      success: data.status === "successful",
      txRef: data.tx_ref,
      flwRef: data.flw_ref,
      amount: data.amount,
      currency: data.currency,
      status: data.status,
      planId: data.meta?.planId,
      userId: data.meta?.userId,
    };
  } catch (err: any) {
    return { success: false, txRef: transactionId, status: "failed" };
  }
}

// ─── Flutterwave Plans (Recurring) ───────────────────────────────────────────

export async function getOrCreateFlutterwavePlan(plan: Plan): Promise<string> {
  // List existing plans
  const response = await flwRequest<{
    status: string;
    data: Array<{ id: number; name: string; amount: number; interval: string }>;
  }>("GET", "/payment-plans");

  const existing = response.data.find((p) => p.name === `AfriMatch-${plan.id}`);
  if (existing) return String(existing.id);

  // Create new plan
  const currency = "USD";
  const { amount } = getFlutterwaveAmount(plan.priceUSD, currency);

  const created = await flwRequest<{
    status: string;
    data: { id: number };
  }>("POST", "/payment-plans", {
    amount,
    name: `AfriMatch-${plan.id}`,
    interval: plan.billingCycle === "monthly" ? "monthly" : "yearly",
    currency,
  });

  return String(created.data.id);
}

// ─── Cancel Subscription ──────────────────────────────────────────────────────

export async function cancelFlutterwavePlan(planId: string): Promise<boolean> {
  try {
    await flwRequest("PUT", `/payment-plans/${planId}/cancel`, {});
    return true;
  } catch {
    return false;
  }
}

// ─── Retry Failed Payment ─────────────────────────────────────────────────────

export async function retryFlutterwavePayment(opts: {
  userId: string;
  email: string;
  name: string;
  planId: string;
  countryCode: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<FlwPaymentLink> {
  // For Flutterwave, retry = create a new payment link
  return createFlutterwavePayment({
    ...opts,
    phone: undefined,
  });
}

// ─── Webhook Verification ─────────────────────────────────────────────────────

export function verifyFlutterwaveWebhook(
  payload: unknown,
  signature: string
): boolean {
  const secret = process.env.FLUTTERWAVE_WEBHOOK_SECRET;
  if (!secret) return true; // Skip verification if not configured

  const crypto = require("crypto");
  const hash = crypto
    .createHmac("sha256", secret)
    .update(JSON.stringify(payload))
    .digest("hex");

  return hash === signature;
}

// ─── Promo Code Validation ────────────────────────────────────────────────────

const KNOWN_PROMOS: Record<string, { discountPercent: number; maxUses?: number }> = {
  AFRICA50: { discountPercent: 50, maxUses: 1000 },
  WELCOME20: { discountPercent: 20 },
  ANNUAL30: { discountPercent: 30 },
};

export function validateFlutterwavePromoCode(
  promoCode: string,
  planId: string
): { valid: boolean; discountPercent?: number; error?: string } {
  const promo = KNOWN_PROMOS[promoCode.toUpperCase()];
  if (!promo) return { valid: false, error: "Invalid promo code" };
  return { valid: true, discountPercent: promo.discountPercent };
}

// ─── Get Transaction List ─────────────────────────────────────────────────────

export async function getFlutterwaveTransactions(
  email: string,
  limit = 10
): Promise<Array<{ id: number; tx_ref: string; amount: number; status: string; created_at: string }>> {
  try {
    const response = await flwRequest<{
      status: string;
      data: Array<{ id: number; tx_ref: string; amount: number; status: string; created_at: string }>;
    }>("GET", `/transactions?customer_email=${encodeURIComponent(email)}&count=${limit}`);
    return response.data ?? [];
  } catch {
    return [];
  }
}
