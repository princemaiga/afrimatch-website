export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth/next";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { planId, mode } = await request.json();

    // Define pricing plans — amounts in cents (USD)
    const plans: Record<string, { name: string; amount: number; interval: "month" | "year"; description?: string }> = {
      // Professional plans (monthly)
      professional_career_monthly: { name: "AfriMatch Professional — Career", amount: 2499, interval: "month", description: "Unlimited applications, all courses, unlimited connections, InMail" },
      professional_executive_monthly: { name: "AfriMatch Professional — Executive", amount: 5999, interval: "month", description: "Everything in Career + unlimited mentors, executive job board, headhunter visibility" },
      // Professional plans (yearly — 50% off)
      professional_career_yearly: { name: "AfriMatch Professional — Career (Annual)", amount: 14994, interval: "year", description: "Save 50% — $12.49/mo billed annually" },
      professional_executive_yearly: { name: "AfriMatch Professional — Executive (Annual)", amount: 35994, interval: "year", description: "Save 50% — $29.99/mo billed annually" },
      // Legacy IDs mapped to professional equivalents
      basic_professional: { name: "AfriMatch Professional — Career", amount: 2499, interval: "month", description: "Unlimited applications, all courses, unlimited connections, InMail" },
      pro_professional: { name: "AfriMatch Professional — Executive", amount: 5999, interval: "month", description: "Everything in Career + unlimited mentors, executive job board, headhunter visibility" },
      professional_career: { name: "AfriMatch Professional — Career", amount: 2499, interval: "month", description: "Unlimited applications, all courses, unlimited connections, InMail" },
      professional_executive: { name: "AfriMatch Professional — Executive", amount: 5999, interval: "month", description: "Everything in Career + unlimited mentors, executive job board, headhunter visibility" },
    };

    const plan = plans[planId];
    if (!plan) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // Create or retrieve customer
    const customers = await stripe.customers.list({
      email: session.user.email,
      limit: 1,
    });

    let customerId = customers.data[0]?.id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email,
        metadata: { userId: session.user.email },
      });
      customerId = customer.id;
    }

    // Create checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: plan.name,
              description: `Subscribe to ${plan.name}`,
            },
            unit_amount: plan.amount,
            recurring: {
              interval: plan.interval,
              interval_count: 1,
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?payment=success&mode=${mode}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/dashboard?payment=cancelled&mode=${mode}`,
      metadata: {
        planId,
        mode,
        userEmail: session.user.email,
      },
    });

    return NextResponse.json({ sessionId: checkoutSession.id, url: checkoutSession.url });
  } catch (error) {
    console.error("Stripe error:", error);
    return NextResponse.json({ error: "Payment processing failed" }, { status: 500 });
  }
}

// Handle webhook events
export async function PUT(request: NextRequest) {
  const sig = request.headers.get("stripe-signature");
  const body = await request.text();

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case "customer.subscription.updated":
      case "customer.subscription.created":
        // Update user subscription in database
        const subscription = event.data.object as Stripe.Subscription;
        console.log("Subscription updated:", subscription.id);
        break;

      case "customer.subscription.deleted":
        // Handle subscription cancellation
        const deletedSubscription = event.data.object as Stripe.Subscription;
        console.log("Subscription cancelled:", deletedSubscription.id);
        break;

      case "invoice.payment_succeeded":
        // Handle successful payment
        const invoice = event.data.object as Stripe.Invoice;
        console.log("Payment succeeded:", invoice.id);
        break;

      case "invoice.payment_failed":
        // Handle failed payment
        const failedInvoice = event.data.object as Stripe.Invoice;
        console.log("Payment failed:", failedInvoice.id);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 400 });
  }
}
