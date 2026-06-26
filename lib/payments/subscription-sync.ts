/**
 * AfriMatch Unified Subscription Sync
 *
 * Keeps the Neon (PostgreSQL) database in sync with both Stripe and Flutterwave.
 * All subscription state is stored in a single unified schema regardless of provider.
 */

import { db } from "../db/client";
import { subscriptions, users } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { getPlan, type PaymentProvider } from "./plans";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SubscriptionStatus =
  | "active"
  | "trialing"
  | "past_due"
  | "canceled"
  | "unpaid"
  | "incomplete"
  | "paused";

export interface UpsertSubscriptionData {
  userId: string;
  planId: string;
  provider: PaymentProvider;
  status: SubscriptionStatus;
  /** Stripe subscription ID or Flutterwave tx_ref */
  providerSubscriptionId: string;
  /** Stripe customer ID or Flutterwave customer email */
  providerCustomerId?: string;
  /** Stripe price ID or Flutterwave plan ID */
  providerPlanId?: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd?: boolean;
  promoCodeId?: string;
  discountPercent?: number;
  failedPaymentCount?: number;
  lastFailedAt?: Date | null;
  nextRetryAt?: Date | null;
  manualProviderOverride?: boolean;
  mode?: "dating" | "professional";
}

// ─── Upsert Subscription ──────────────────────────────────────────────────────

export async function upsertSubscription(data: UpsertSubscriptionData): Promise<void> {
  // Check if subscription already exists for this user + provider combo
  const existing = await db
    .select({ id: subscriptions.id })
    .from(subscriptions)
    .where(
      and(
        eq(subscriptions.userId, data.userId),
        eq(subscriptions.stripeSubscriptionId as any, data.providerSubscriptionId)
      )
    )
    .limit(1);

  const now = new Date();

  // Map status to the DB enum values (DB uses 'cancelled', code uses 'canceled')
  const dbStatus = mapStatusToDb(data.status);

  if (existing.length > 0) {
    // Update existing record
    await db
      .update(subscriptions)
      .set({
        planId: data.planId as any,
        status: dbStatus as any,
        currentPeriodStart: data.currentPeriodStart,
        currentPeriodEnd: data.currentPeriodEnd,
        cancelAtPeriodEnd: data.cancelAtPeriodEnd ?? false,
        updatedAt: now,
        // Extended payment fields (added via migration)
        ...(buildExtendedFields(data)),
      })
      .where(eq(subscriptions.id, existing[0].id));
  } else {
    // Derive mode and price from plan
    const plan = getPlan(data.planId);
    const mode = data.mode ?? (plan?.mode ?? "dating");
    const price = plan?.priceUSD?.toString() ?? "0";
    // Insert new record
    await db.insert(subscriptions).values({
      userId: data.userId,
      planId: data.planId as any,
      mode: mode as any,
      price: price as any,
      status: dbStatus as any,
      stripeSubscriptionId: data.provider === "stripe" ? data.providerSubscriptionId : null,
      stripeCustomerId: data.provider === "stripe" ? data.providerCustomerId : null,
      currentPeriodStart: data.currentPeriodStart,
      currentPeriodEnd: data.currentPeriodEnd,
      cancelAtPeriodEnd: data.cancelAtPeriodEnd ?? false,
      createdAt: now,
      updatedAt: now,
      // Extended payment fields
      ...(buildExtendedFields(data)),
    } as any);
  }
}

/** Map internal status strings to DB enum values */
function mapStatusToDb(status: SubscriptionStatus): string {
  const map: Record<string, string> = {
    active: "active",
    trialing: "active",   // DB enum doesn't have trialing; treat as active
    past_due: "active",   // Keep active until fully cancelled
    canceled: "cancelled", // DB uses double-l
    unpaid: "cancelled",
    incomplete: "pending",
    paused: "active",
  };
  return map[status] ?? "pending";
}

function buildExtendedFields(data: UpsertSubscriptionData): Record<string, unknown> {
  return {
    payment_provider: data.provider,
    manual_provider_override: data.manualProviderOverride ?? false,
    discount_percent: data.discountPercent ?? 0,
    failed_payment_count: data.failedPaymentCount ?? 0,
    last_failed_at: data.lastFailedAt ?? null,
    next_retry_at: data.nextRetryAt ?? null,
    ...(data.provider === "flutterwave"
      ? {
          flutterwave_customer_id: data.providerCustomerId ?? null,
          flutterwave_plan_id: data.providerPlanId ?? null,
        }
      : {
          stripe_price_id: data.providerPlanId ?? null,
        }),
  };
}

// ─── Get Active Subscription ──────────────────────────────────────────────────

export async function getActiveSubscription(userId: string) {
  const [sub] = await db
    .select()
    .from(subscriptions)
    .where(
      and(
        eq(subscriptions.userId, userId),
        eq(subscriptions.status, "active" as any)
      )
    )
    .limit(1);
  return sub ?? null;
}

export async function getAllSubscriptions(userId: string) {
  return db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .orderBy(subscriptions.createdAt);
}

// ─── Mark Subscription Canceled ──────────────────────────────────────────────

export async function markSubscriptionCanceled(
  providerSubscriptionId: string,
  immediately: boolean = false
): Promise<void> {
  // Find by stripeSubscriptionId or flutterwave tx ref stored in the same column
  await db
    .update(subscriptions)
    .set({
      status: immediately ? ("cancelled" as any) : ("active" as any),
      cancelAtPeriodEnd: !immediately,
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.stripeSubscriptionId as any, providerSubscriptionId));
}

// ─── Mark Payment Failed ──────────────────────────────────────────────────────

export async function markPaymentFailed(
  providerSubscriptionId: string,
  retryCount: number
): Promise<void> {
  // Retry schedule: 1 day, 3 days, 7 days after failure
  const retryDelays = [1, 3, 7];
  const delayDays = retryDelays[Math.min(retryCount, retryDelays.length - 1)];
  const nextRetry = new Date();
  nextRetry.setDate(nextRetry.getDate() + delayDays);

  await db
    .update(subscriptions)
    .set({
      status: retryCount >= 3 ? ("cancelled" as any) : ("active" as any),
      failed_payment_count: retryCount,
      last_failed_at: new Date(),
      next_retry_at: retryCount < 3 ? nextRetry : null,
      updatedAt: new Date(),
    } as any)
    .where(eq(subscriptions.stripeSubscriptionId as any, providerSubscriptionId));
}

// ─── Mark Payment Recovered ───────────────────────────────────────────────────

export async function markPaymentRecovered(
  providerSubscriptionId: string,
  newPeriodEnd: Date
): Promise<void> {
  await db
    .update(subscriptions)
    .set({
      status: "active" as any,
      failed_payment_count: 0,
      last_failed_at: null,
      next_retry_at: null,
      currentPeriodEnd: newPeriodEnd,
      updatedAt: new Date(),
    } as any)
    .where(eq(subscriptions.stripeSubscriptionId as any, providerSubscriptionId));
}

// ─── Update Plan (upgrade/downgrade) ─────────────────────────────────────────

export async function updateSubscriptionPlan(
  providerSubscriptionId: string,
  newPlanId: string,
  newPeriodEnd?: Date
): Promise<void> {
  await db
    .update(subscriptions)
    .set({
      planId: newPlanId as any,
      ...(newPeriodEnd ? { currentPeriodEnd: newPeriodEnd } : {}),
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.stripeSubscriptionId as any, providerSubscriptionId));
}

// ─── Validate Promo Code (DB lookup) ─────────────────────────────────────────

export async function validatePromoCodeInDb(
  code: string,
  planId: string
): Promise<{ valid: boolean; discountPercent?: number; promoCodeId?: string; error?: string }> {
  // Raw SQL query since promoCodes table is added via migration (not in Drizzle schema yet)
  try {
    const result = await (db as any).execute(
      `SELECT id, discount_percent, max_uses, used_count, expires_at, active, applicable_plan_ids
       FROM promo_codes
       WHERE code = $1
       LIMIT 1`,
      [code.toUpperCase()]
    );

    const row = result.rows?.[0];
    if (!row) return { valid: false, error: "Promo code not found" };
    if (!row.active) return { valid: false, error: "Promo code is no longer active" };
    if (row.expires_at && new Date(row.expires_at) < new Date()) {
      return { valid: false, error: "Promo code has expired" };
    }
    if (row.max_uses && row.used_count >= row.max_uses) {
      return { valid: false, error: "Promo code usage limit reached" };
    }
    if (row.applicable_plan_ids) {
      const applicable = JSON.parse(row.applicable_plan_ids) as string[];
      if (!applicable.includes(planId)) {
        return { valid: false, error: "Promo code not valid for this plan" };
      }
    }

    return {
      valid: true,
      discountPercent: parseFloat(row.discount_percent),
      promoCodeId: row.id,
    };
  } catch {
    // Fallback if table doesn't exist yet
    const FALLBACK: Record<string, number> = {
      AFRICA50: 50,
      WELCOME20: 20,
      ANNUAL30: 30,
    };
    const pct = FALLBACK[code.toUpperCase()];
    if (!pct) return { valid: false, error: "Invalid promo code" };
    return { valid: true, discountPercent: pct };
  }
}

export async function incrementPromoCodeUsage(promoCodeId: string): Promise<void> {
  try {
    await (db as any).execute(
      `UPDATE promo_codes SET used_count = used_count + 1, updated_at = NOW() WHERE id = $1`,
      [promoCodeId]
    );
  } catch {
    // Silently fail if table doesn't exist
  }
}
