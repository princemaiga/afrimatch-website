/**
 * Flutterwave Webhook Handler
 * Endpoint: POST /api/webhooks/flutterwave
 *
 * Handles Flutterwave payment events and syncs to Neon DB.
 */

export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { verifyFlutterwaveTransaction } from "@/lib/payments/flutterwave-service";
import {
  upsertSubscription,
  markSubscriptionCanceled,
  markPaymentFailed,
  markPaymentRecovered,
} from "@/lib/payments/subscription-sync";

const FLUTTERWAVE_SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY || "";

export async function POST(request: NextRequest) {
  const body = await request.text();

  // Verify webhook signature (Flutterwave uses verif-hash header)
  const signature = request.headers.get("verif-hash") || request.headers.get("verificationhash");
  const webhookSecret = process.env.FLUTTERWAVE_WEBHOOK_SECRET;

  if (webhookSecret) {
    // If using HMAC verification
    if (signature !== webhookSecret) {
      // Also try HMAC
      const hash = crypto
        .createHmac("sha256", FLUTTERWAVE_SECRET_KEY)
        .update(body)
        .digest("hex");
      if (hash !== signature) {
        console.error("[FLW Webhook] Invalid signature");
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    }
  }

  let payload: any;
  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventType = payload?.event;
  const data = payload?.data;

  console.log(`[FLW Webhook] Processing event: ${eventType}`);

  try {
    switch (eventType) {
      // ─── Charge Completed (one-time or first subscription payment) ────────
      case "charge.completed": {
        if (data?.status !== "successful") break;

        const txId = data?.id?.toString();
        if (!txId) break;

        // Verify with Flutterwave API
        const verified = await verifyFlutterwaveTransaction(txId);
        if (!verified.success) break;

        const userId = data?.meta?.userId || data?.customer?.email;
        const planId = data?.meta?.planId;
        if (!userId || !planId) break;

        const now = new Date();
        const periodEnd = new Date(now);
        periodEnd.setMonth(periodEnd.getMonth() + 1);

        await upsertSubscription({
          userId,
          planId,
          provider: "flutterwave",
          status: "active",
          providerSubscriptionId: data?.tx_ref || txId,
          providerCustomerId: data?.customer?.email,
          providerPlanId: data?.meta?.flwPlanId,
          currentPeriodStart: now,
          currentPeriodEnd: periodEnd,
          cancelAtPeriodEnd: false,
        });
        break;
      }

      // ─── Subscription Created ─────────────────────────────────────────────
      case "subscription.created": {
        const userId = data?.customer?.email;
        const planId = data?.plan?.name?.replace("AfriMatch-", "");
        if (!userId || !planId) break;

        const now = new Date();
        const periodEnd = new Date(now);
        periodEnd.setMonth(periodEnd.getMonth() + 1);

        await upsertSubscription({
          userId,
          planId,
          provider: "flutterwave",
          status: "active",
          providerSubscriptionId: data?.id?.toString() || data?.tx_ref,
          providerCustomerId: data?.customer?.email,
          providerPlanId: data?.plan?.id?.toString(),
          currentPeriodStart: now,
          currentPeriodEnd: periodEnd,
          cancelAtPeriodEnd: false,
        });
        break;
      }

      // ─── Subscription Updated ─────────────────────────────────────────────
      case "subscription.updated": {
        const userId = data?.customer?.email;
        const planId = data?.plan?.name?.replace("AfriMatch-", "");
        if (!userId || !planId) break;

        const now = new Date();
        const periodEnd = new Date(now);
        periodEnd.setMonth(periodEnd.getMonth() + 1);

        await upsertSubscription({
          userId,
          planId,
          provider: "flutterwave",
          status: "active",
          providerSubscriptionId: data?.id?.toString() || data?.tx_ref,
          providerCustomerId: data?.customer?.email,
          providerPlanId: data?.plan?.id?.toString(),
          currentPeriodStart: now,
          currentPeriodEnd: periodEnd,
          cancelAtPeriodEnd: false,
        });
        break;
      }

      // ─── Subscription Cancelled ───────────────────────────────────────────
      case "subscription.cancelled": {
        const subId = data?.id?.toString() || data?.tx_ref;
        if (!subId) break;
        await markSubscriptionCanceled(subId, true);
        break;
      }

      // ─── Charge Failed ────────────────────────────────────────────────────
      case "charge.failed":
      case "transfer.failed": {
        const txRef = data?.tx_ref || data?.id?.toString();
        if (!txRef) break;
        const attemptCount = data?.attempt_count ?? 1;
        await markPaymentFailed(txRef, attemptCount);
        break;
      }

      // ─── Transfer Completed (renewal) ─────────────────────────────────────
      case "transfer.completed": {
        const txRef = data?.tx_ref || data?.id?.toString();
        if (!txRef) break;
        const periodEnd = new Date();
        periodEnd.setMonth(periodEnd.getMonth() + 1);
        await markPaymentRecovered(txRef, periodEnd);
        break;
      }

      default:
        console.log(`[FLW Webhook] Unhandled event type: ${eventType}`);
    }

    return NextResponse.json({ status: "success" });
  } catch (err: any) {
    console.error("[FLW Webhook] Processing error:", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
