export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

/**
 * Payment Webhook Handler
 * Verifies and processes payment events from Stripe and Flutterwave
 */

interface PaymentEvent {
  id: string;
  type: string;
  data: {
    object: {
      id: string;
      status: string;
      amount: number;
      currency: string;
      customer_id: string;
      metadata: Record<string, any>;
    };
  };
}

/**
 * Verify Stripe webhook signature
 */
function verifyStripeSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  try {
    const hash = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(hash),
      Buffer.from(signature.split(",")[1].split("=")[1])
    );
  } catch (error) {
    console.error("Stripe signature verification failed:", error);
    return false;
  }
}

/**
 * Verify Flutterwave signature
 */
function verifyFlutterwaveSignature(
  payload: any,
  signature: string,
  secret: string
): boolean {
  try {
    const hash = crypto
      .createHmac("sha256", secret)
      .update(JSON.stringify(payload))
      .digest("hex");

    return hash === signature;
  } catch (error) {
    console.error("Flutterwave signature verification failed:", error);
    return false;
  }
}

/**
 * Handle payment.intent.succeeded
 */
async function handlePaymentSucceeded(event: PaymentEvent): Promise<void> {
  const { id, amount, currency, customer_id, metadata } = event.data.object;

  console.log(`Payment succeeded: ${id} - ${amount} ${currency}`);

  // Update user subscription status
  // await updateUserSubscription(customer_id, metadata.plan, "active");

  // Send confirmation email
  // await sendPaymentConfirmationEmail(customer_id, amount, currency);

  // Log transaction
  // await logTransaction(id, customer_id, amount, currency, "completed");
}

/**
 * Handle payment.intent.payment_failed
 */
async function handlePaymentFailed(event: PaymentEvent): Promise<void> {
  const { id, amount, currency, customer_id } = event.data.object;

  console.log(`Payment failed: ${id} - ${amount} ${currency}`);

  // Send failure notification email
  // await sendPaymentFailedEmail(customer_id, amount, currency);

  // Log transaction
  // await logTransaction(id, customer_id, amount, currency, "failed");
}

/**
 * Handle charge.refunded
 */
async function handleChargeRefunded(event: PaymentEvent): Promise<void> {
  const { id, amount, currency, customer_id } = event.data.object;

  console.log(`Charge refunded: ${id} - ${amount} ${currency}`);

  // Update transaction status
  // await updateTransactionStatus(id, "refunded");

  // Send refund confirmation email
  // await sendRefundConfirmationEmail(customer_id, amount, currency);
}

/**
 * Handle customer.subscription.updated
 */
async function handleSubscriptionUpdated(event: PaymentEvent): Promise<void> {
  const { id, status, customer_id, metadata } = event.data.object;

  console.log(`Subscription updated: ${id} - ${status}`);

  // Update subscription status
  // await updateSubscription(id, status, metadata);

  // Send confirmation email
  // await sendSubscriptionUpdateEmail(customer_id, status);
}

/**
 * Handle customer.subscription.deleted
 */
async function handleSubscriptionDeleted(event: PaymentEvent): Promise<void> {
  const { id, customer_id } = event.data.object;

  console.log(`Subscription deleted: ${id}`);

  // Update subscription status to cancelled
  // await updateSubscription(id, "cancelled");

  // Send cancellation email
  // await sendSubscriptionCancellationEmail(customer_id);
}

/**
 * POST /api/webhooks/payment
 * Handle payment webhooks from Stripe and Flutterwave
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const contentType = request.headers.get("content-type");
    const signature = request.headers.get("stripe-signature") ||
      request.headers.get("x-flutterwave-signature") || "";

    // Determine webhook source
    const isStripe = request.headers.get("stripe-signature") !== null;
    const isFlutterwave = request.headers.get("x-flutterwave-signature") !== null;

    if (isStripe) {
      // Verify Stripe signature
      const stripeSecret = process.env.STRIPE_WEBHOOK_SECRET;
      if (!stripeSecret) {
        console.error("Stripe webhook secret not configured");
        return NextResponse.json(
          { error: "Webhook secret not configured" },
          { status: 500 }
        );
      }

      if (!verifyStripeSignature(body, signature, stripeSecret)) {
        console.error("Invalid Stripe signature");
        return NextResponse.json(
          { error: "Invalid signature" },
          { status: 401 }
        );
      }

      const event = JSON.parse(body);

      // Handle Stripe events
      switch (event.type) {
        case "payment_intent.succeeded":
          await handlePaymentSucceeded(event);
          break;
        case "payment_intent.payment_failed":
          await handlePaymentFailed(event);
          break;
        case "charge.refunded":
          await handleChargeRefunded(event);
          break;
        case "customer.subscription.updated":
          await handleSubscriptionUpdated(event);
          break;
        case "customer.subscription.deleted":
          await handleSubscriptionDeleted(event);
          break;
        default:
          console.log(`Unhandled Stripe event type: ${event.type}`);
      }
    } else if (isFlutterwave) {
      // Verify Flutterwave signature
      const flutterwaveSecret = process.env.FLUTTERWAVE_WEBHOOK_SECRET;
      if (!flutterwaveSecret) {
        console.error("Flutterwave webhook secret not configured");
        return NextResponse.json(
          { error: "Webhook secret not configured" },
          { status: 500 }
        );
      }

      const payload = JSON.parse(body);

      if (!verifyFlutterwaveSignature(payload, signature, flutterwaveSecret)) {
        console.error("Invalid Flutterwave signature");
        return NextResponse.json(
          { error: "Invalid signature" },
          { status: 401 }
        );
      }

      // Handle Flutterwave events
      if (payload.event === "charge.completed") {
        console.log(`Flutterwave payment completed: ${payload.data.id}`);
        // await handleFlutterwavePaymentCompleted(payload.data);
      } else if (payload.event === "charge.failed") {
        console.log(`Flutterwave payment failed: ${payload.data.id}`);
        // await handleFlutterwavePaymentFailed(payload.data);
      }
    } else {
      return NextResponse.json(
        { error: "Unknown webhook source" },
        { status: 400 }
      );
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/webhooks/payment
 * Health check endpoint
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: "ok",
    message: "Payment webhook endpoint is active",
  });
}
