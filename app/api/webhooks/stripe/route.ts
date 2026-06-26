/**
 * Stripe Webhook Handler
 * Endpoint: POST /api/webhooks/stripe
 *
 * Handles all Stripe subscription lifecycle events and syncs to Neon DB.
 */

export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import {
  upsertSubscription,
  markSubscriptionCanceled,
  markPaymentFailed,
  markPaymentRecovered,
} from "@/lib/payments/subscription-sync";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing stripe-signature header or webhook secret" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    console.error("[Stripe Webhook] Signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  console.log(`[Stripe Webhook] Processing event: ${event.type}`);

  try {
    switch (event.type) {
      // ─── Subscription Created / Updated ──────────────────────────────────
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.userId;
        const planId = sub.metadata?.planId;

        if (!userId || !planId) {
          console.warn("[Stripe Webhook] Missing userId or planId in subscription metadata");
          break;
        }

        await upsertSubscription({
          userId,
          planId,
          provider: "stripe",
          status: mapStripeStatus(sub.status),
          providerSubscriptionId: sub.id,
          providerCustomerId: sub.customer as string,
          providerPlanId: sub.items.data[0]?.price?.id,
          currentPeriodStart: new Date((sub as any).current_period_start * 1000),
          currentPeriodEnd: new Date((sub as any).current_period_end * 1000),
          cancelAtPeriodEnd: sub.cancel_at_period_end,
        });
        break;
      }

      // ─── Subscription Deleted (canceled immediately) ──────────────────────
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await markSubscriptionCanceled(sub.id, true);
        break;
      }

      // ─── Checkout Session Completed ───────────────────────────────────────
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== "subscription") break;
        const userId = session.metadata?.userId;
        const planId = session.metadata?.planId;
        console.log(`[Stripe Webhook] Checkout completed for user ${userId}, plan ${planId}`);
        break;
      }

      // ─── Invoice Payment Succeeded ────────────────────────────────────────
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string;
        if (!subscriptionId) break;
        const periodEnd = new Date((invoice as any).period_end * 1000);
        await markPaymentRecovered(subscriptionId, periodEnd);
        break;
      }

      // ─── Invoice Payment Failed ───────────────────────────────────────────
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string;
        if (!subscriptionId) break;
        const attemptCount = (invoice as any).attempt_count ?? 1;
        await markPaymentFailed(subscriptionId, attemptCount);
        break;
      }

      // ─── Invoice Upcoming (renewal reminder) ─────────────────────────────
      case "invoice.upcoming": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`[Stripe Webhook] Upcoming invoice for customer ${invoice.customer}`);
        break;
      }

      // ─── Trial Ending ─────────────────────────────────────────────────────
      case "customer.subscription.trial_will_end": {
        const sub = event.data.object as Stripe.Subscription;
        console.log(`[Stripe Webhook] Trial ending for subscription ${sub.id}`);
        break;
      }

      // ─── Refund ───────────────────────────────────────────────────────────
      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        console.log(`[Stripe Webhook] Refund processed: ${charge.id}`);
        break;
      }

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("[Stripe Webhook] Processing error:", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}

function mapStripeStatus(
  status: Stripe.Subscription.Status
): "active" | "trialing" | "past_due" | "canceled" | "unpaid" | "incomplete" | "paused" {
  const map: Record<string, "active" | "trialing" | "past_due" | "canceled" | "unpaid" | "incomplete" | "paused"> = {
    active: "active",
    trialing: "trialing",
    past_due: "past_due",
    canceled: "canceled",
    unpaid: "unpaid",
    incomplete: "incomplete",
    incomplete_expired: "canceled",
    paused: "paused",
  };
  return map[status] ?? "incomplete";
}
