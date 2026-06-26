/**
 * AfriMatch Stripe Payment Service
 *
 * Handles all Stripe subscription lifecycle operations:
 * - Create subscription (checkout session)
 * - Upgrade / downgrade plan
 * - Cancel subscription
 * - Retry failed payment
 * - Apply promo codes
 * - Manage customer portal
 */

import Stripe from "stripe";
import { getPlan, type Plan } from "./plans";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
  typescript: true,
});

export { stripe };

// ─── Customer Management ──────────────────────────────────────────────────────

export async function getOrCreateStripeCustomer(
  email: string,
  userId: string,
  name?: string
): Promise<string> {
  const existing = await stripe.customers.list({ email, limit: 1 });
  if (existing.data.length > 0) return existing.data[0].id;

  const customer = await stripe.customers.create({
    email,
    name: name ?? email,
    metadata: { userId },
  });
  return customer.id;
}

// ─── Checkout Session (new subscription) ─────────────────────────────────────

export interface CreateStripeCheckoutOptions {
  planId: string;
  userId: string;
  email: string;
  name?: string;
  successUrl: string;
  cancelUrl: string;
  promoCode?: string;
  discountPercent?: number;
  countryCode?: string;
  trialDays?: number;
}

export async function createStripeCheckoutSession(
  opts: CreateStripeCheckoutOptions
): Promise<{ url: string; sessionId: string }> {
  const plan = getPlan(opts.planId);
  const customerId = await getOrCreateStripeCustomer(opts.email, opts.userId, opts.name);

  // Resolve promo code to Stripe coupon
  let discounts: Stripe.Checkout.SessionCreateParams.Discount[] | undefined;
  if (opts.promoCode) {
    try {
      const coupon = await getOrCreateStripeCoupon(opts.promoCode);
      if (coupon) discounts = [{ coupon: coupon.id }];
    } catch {
      // Invalid promo — proceed without discount
    }
  }

  // Create or retrieve Stripe Price for this plan
  const priceId = await getOrCreateStripePrice(plan);

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    customer: customerId,
    payment_method_types: ["card"],
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: opts.successUrl,
    cancel_url: opts.cancelUrl,
    metadata: {
      userId: opts.userId,
      planId: opts.planId,
      provider: "stripe",
    },
    subscription_data: {
      metadata: {
        userId: opts.userId,
        planId: opts.planId,
        provider: "stripe",
      },
      ...(opts.trialDays ? { trial_period_days: opts.trialDays } : {}),
    },
    allow_promotion_codes: !discounts,
    ...(discounts ? { discounts } : {}),
  };

  const session = await stripe.checkout.sessions.create(sessionParams);
  return { url: session.url!, sessionId: session.id };
}

// ─── Stripe Price Management ──────────────────────────────────────────────────

const priceCache = new Map<string, string>();

export async function getOrCreateStripePrice(plan: Plan): Promise<string> {
  const cacheKey = plan.id;
  if (priceCache.has(cacheKey)) return priceCache.get(cacheKey)!;

  // Search for existing price with matching metadata
  const prices = await stripe.prices.list({
    active: true,
    limit: 100,
    lookup_keys: [plan.id],
  });

  if (prices.data.length > 0) {
    priceCache.set(cacheKey, prices.data[0].id);
    return prices.data[0].id;
  }

  // Create product + price
  const product = await stripe.products.create({
    name: `AfriMatch — ${plan.name}`,
    metadata: { planId: plan.id, mode: plan.mode },
  });

  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: plan.stripeAmountCents,
    currency: "usd",
    recurring: {
      interval: plan.stripeInterval,
      interval_count: 1,
    },
    lookup_key: plan.id,
    metadata: { planId: plan.id },
  });

  priceCache.set(cacheKey, price.id);
  return price.id;
}

// ─── Upgrade / Downgrade ──────────────────────────────────────────────────────

export async function changeStripeSubscriptionPlan(
  stripeSubscriptionId: string,
  newPlanId: string,
  prorate: boolean = true
): Promise<Stripe.Subscription> {
  const plan = getPlan(newPlanId);
  const priceId = await getOrCreateStripePrice(plan);

  const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);
  const itemId = subscription.items.data[0].id;

  const updated = await stripe.subscriptions.update(stripeSubscriptionId, {
    items: [{ id: itemId, price: priceId }],
    proration_behavior: prorate ? "create_prorations" : "none",
    metadata: { planId: newPlanId },
  });

  return updated;
}

// ─── Cancellation ─────────────────────────────────────────────────────────────

export async function cancelStripeSubscription(
  stripeSubscriptionId: string,
  immediately: boolean = false
): Promise<Stripe.Subscription> {
  if (immediately) {
    return stripe.subscriptions.cancel(stripeSubscriptionId);
  }
  // Cancel at period end (user keeps access until billing period ends)
  return stripe.subscriptions.update(stripeSubscriptionId, {
    cancel_at_period_end: true,
  });
}

export async function reactivateStripeSubscription(
  stripeSubscriptionId: string
): Promise<Stripe.Subscription> {
  return stripe.subscriptions.update(stripeSubscriptionId, {
    cancel_at_period_end: false,
  });
}

// ─── Failed Payment Retry ─────────────────────────────────────────────────────

export async function retryStripePayment(
  stripeSubscriptionId: string
): Promise<{ success: boolean; invoiceId?: string; error?: string }> {
  try {
    const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);
    const latestInvoiceId = subscription.latest_invoice as string;

    if (!latestInvoiceId) {
      return { success: false, error: "No invoice found" };
    }

    const invoice = await stripe.invoices.pay(latestInvoiceId);
    return { success: invoice.status === "paid", invoiceId: invoice.id };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ─── Customer Portal ──────────────────────────────────────────────────────────

export async function createStripePortalSession(
  stripeCustomerId: string,
  returnUrl: string
): Promise<string> {
  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: returnUrl,
  });
  return session.url;
}

// ─── Promo Codes ──────────────────────────────────────────────────────────────

export async function getOrCreateStripeCoupon(
  promoCode: string
): Promise<Stripe.Coupon | null> {
  // Try to find existing coupon by name
  const coupons = await stripe.coupons.list({ limit: 100 });
  const existing = coupons.data.find((c) => c.name === promoCode);
  if (existing) return existing;

  // Look up in our DB to get discount percent
  // (In production, fetch from DB; here we use a lookup table)
  const KNOWN_PROMOS: Record<string, number> = {
    AFRICA50: 50,
    WELCOME20: 20,
    ANNUAL30: 30,
  };

  const percent = KNOWN_PROMOS[promoCode.toUpperCase()];
  if (!percent) return null;

  const coupon = await stripe.coupons.create({
    name: promoCode.toUpperCase(),
    percent_off: percent,
    duration: "once",
  });
  return coupon;
}

export async function validatePromoCode(
  promoCode: string,
  planId: string
): Promise<{ valid: boolean; discountPercent?: number; error?: string }> {
  const coupon = await getOrCreateStripeCoupon(promoCode);
  if (!coupon) return { valid: false, error: "Invalid promo code" };
  if (!coupon.valid) return { valid: false, error: "Promo code has expired" };
  return { valid: true, discountPercent: coupon.percent_off ?? 0 };
}

// ─── Webhook Verification ─────────────────────────────────────────────────────

export function verifyStripeWebhook(
  payload: string | Buffer,
  signature: string
): Stripe.Event {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) throw new Error("STRIPE_WEBHOOK_SECRET not configured");
  return stripe.webhooks.constructEvent(payload, signature, secret);
}

// ─── Subscription Retrieval ───────────────────────────────────────────────────

export async function getStripeSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  return stripe.subscriptions.retrieve(subscriptionId, {
    expand: ["latest_invoice", "customer", "items.data.price"],
  });
}

export async function getStripeCustomerSubscriptions(
  customerId: string
): Promise<Stripe.Subscription[]> {
  const subs = await stripe.subscriptions.list({
    customer: customerId,
    status: "all",
    limit: 10,
  });
  return subs.data;
}
