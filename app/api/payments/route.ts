/**
 * AfriMatch Unified Payment API
 * Endpoint: POST /api/payments
 *
 * Handles subscription creation, upgrades, downgrades, cancellations,
 * retries, and promo code validation for both Stripe and Flutterwave.
 */

export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDefaultProvider } from "@/lib/payments/routing";
import { getPlan, type PaymentProvider } from "@/lib/payments/plans";
import {
  createStripeCheckoutSession,
  createStripePortalSession,
  cancelStripeSubscription,
  retryStripePayment,
} from "@/lib/payments/stripe-service";
import {
  createFlutterwavePayment,
  retryFlutterwavePayment,
} from "@/lib/payments/flutterwave-service";
import {
  getActiveSubscription,
  getAllSubscriptions,
  validatePromoCodeInDb,
} from "@/lib/payments/subscription-sync";

// ─── Helper: resolve DB UUID from session ─────────────────────────────────────

async function resolveUserId(sessionUserId: string | undefined, email: string): Promise<string> {
  // If session.user.id looks like a UUID, use it directly
  if (sessionUserId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sessionUserId)) {
    return sessionUserId;
  }
  // Otherwise look up by email (handles OAuth users or missing id)
  const { db } = await import("@/lib/db/client");
  const { users } = await import("@/lib/db/schema");
  const { eq } = await import("drizzle-orm");
  const [user] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  if (!user) throw new Error("User not found in database");
  return user.id;
}

// ─── POST: Create Payment / Manage Subscription ───────────────────────────────

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const {
    action = "subscribe",
    planId,
    provider: requestedProvider,
    promoCode,
    subscriptionId,
    countryCode = "US",
  } = body;

  const userEmail = session.user.email;
  const userName = session.user.name || userEmail;

  // Determine provider: use requested (manual override) or geo-default
  const provider: PaymentProvider = requestedProvider || getDefaultProvider(countryCode);

  const baseUrl = process.env.NEXTAUTH_URL || "https://afrimatch.app";

  try {
    // Resolve the real DB UUID for this user
    const userId = await resolveUserId((session.user as any).id, userEmail);

    switch (action) {
      // ─── Subscribe ──────────────────────────────────────────────────────────
      case "subscribe": {
        if (!planId) {
          return NextResponse.json({ error: "planId is required" }, { status: 400 });
        }

        const plan = getPlan(planId);
        if (!plan) {
          return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
        }

        // Validate promo code if provided
        let discountPercent = 0;
        if (promoCode) {
          const promoResult = await validatePromoCodeInDb(promoCode, planId);
          if (!promoResult.valid) {
            return NextResponse.json({ error: promoResult.error }, { status: 400 });
          }
          discountPercent = promoResult.discountPercent ?? 0;
        }

        if (provider === "stripe") {
          const result = await createStripeCheckoutSession({
            planId,
            userId,
            email: userEmail,
            successUrl: `${baseUrl}/dashboard?payment=success&plan=${planId}&provider=stripe`,
            cancelUrl: `${baseUrl}/pricing?payment=cancelled`,
            promoCode,
            discountPercent,
            countryCode,
          });
          return NextResponse.json({ url: result.url, sessionId: result.sessionId, provider: "stripe" });
        } else {
          const result = await createFlutterwavePayment({
            planId,
            userId,
            email: userEmail,
            name: userName,
            countryCode,
            successUrl: `${baseUrl}/dashboard?payment=success&plan=${planId}&provider=flutterwave`,
            cancelUrl: `${baseUrl}/pricing?payment=cancelled`,
            promoCode,
            discountPercent,
          });
          return NextResponse.json({ url: result.link, txRef: result.txRef, provider: "flutterwave" });
        }
      }

      // ─── Manage (Stripe Customer Portal) ───────────────────────────────────
      case "manage": {
        if (provider !== "stripe") {
          return NextResponse.json({
            error: "Portal management is only available for Stripe subscriptions",
          }, { status: 400 });
        }
        const portalUrl = await createStripePortalSession(
          userEmail,
          `${baseUrl}/dashboard`
        );
        return NextResponse.json({ url: portalUrl });
      }

      // ─── Cancel ─────────────────────────────────────────────────────────────
      case "cancel": {
        if (!subscriptionId) {
          return NextResponse.json({ error: "subscriptionId is required" }, { status: 400 });
        }

        if (provider === "stripe") {
          const immediately = body.immediately ?? false;
          await cancelStripeSubscription(subscriptionId, immediately);
          return NextResponse.json({ success: true, message: "Subscription canceled" });
        } else {
          const { cancelFlutterwavePlan } = await import("@/lib/payments/flutterwave-service");
          await cancelFlutterwavePlan(subscriptionId);
          return NextResponse.json({ success: true, message: "Subscription canceled" });
        }
      }

      // ─── Retry Failed Payment ────────────────────────────────────────────────
      case "retry": {
        if (!subscriptionId && !planId) {
          return NextResponse.json({ error: "subscriptionId or planId is required" }, { status: 400 });
        }

        if (provider === "stripe") {
          const result = await retryStripePayment(subscriptionId!);
          return NextResponse.json({ success: result, provider: "stripe" });
        } else {
          const result = await retryFlutterwavePayment({
            userId,
            email: userEmail,
            name: userName,
            planId: planId || "professional_career_monthly",
            countryCode,
            successUrl: `${baseUrl}/dashboard?payment=success&provider=flutterwave`,
            cancelUrl: `${baseUrl}/pricing?payment=cancelled`,
          });
          return NextResponse.json({ url: result.link, txRef: result.txRef, provider: "flutterwave" });
        }
      }

      // ─── Validate Promo Code ─────────────────────────────────────────────────
      case "validate-promo": {
        if (!promoCode || !planId) {
          return NextResponse.json({ error: "promoCode and planId are required" }, { status: 400 });
        }
        const result = await validatePromoCodeInDb(promoCode, planId);
        return NextResponse.json(result);
      }

      // ─── Get Subscription Status ─────────────────────────────────────────────
      case "status": {
        const sub = await getActiveSubscription(userId);
        return NextResponse.json({ subscription: sub });
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (err: any) {
    console.error("[Payment API] Error:", err);
    return NextResponse.json({ error: err.message || "Payment processing failed" }, { status: 500 });
  }
}

// ─── GET: Get Current Subscription Status ─────────────────────────────────────

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = await resolveUserId((session.user as any).id, session.user.email);
    const [active, all] = await Promise.all([
      getActiveSubscription(userId),
      getAllSubscriptions(userId),
    ]);

    return NextResponse.json({
      active,
      history: all,
      hasActiveSubscription: !!active,
    });
  } catch (err: any) {
    console.error("[Payment API] GET error:", err);
    return NextResponse.json({ error: "Failed to fetch subscription" }, { status: 500 });
  }
}
