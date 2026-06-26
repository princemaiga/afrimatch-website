import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});

export const SUBSCRIPTION_PLANS = {
  dating_basic: {
    name: "Dating - Basic",
    price: 500, // $5.00 in cents
    interval: "month" as const,
    stripeId: "price_dating_basic",
  },
  dating_premium: {
    name: "Dating - Premium",
    price: 999, // $9.99 in cents
    interval: "month" as const,
    stripeId: "price_dating_premium",
  },
  jobs_recruiter_basic: {
    name: "Jobs - Recruiter Basic",
    price: 1999, // $19.99 in cents
    interval: "month" as const,
    stripeId: "price_jobs_recruiter_basic",
  },
  jobs_recruiter_pro: {
    name: "Jobs - Recruiter Pro",
    price: 4999, // $49.99 in cents
    interval: "month" as const,
    stripeId: "price_jobs_recruiter_pro",
  },
  jobs_company: {
    name: "Jobs - Company Posting",
    price: 2999, // $29.99 in cents
    interval: "month" as const,
    stripeId: "price_jobs_company",
  },
  professional_headhunter: {
    name: "Professional - Headhunter",
    price: 3999, // $39.99 in cents
    interval: "month" as const,
    stripeId: "price_professional_headhunter",
  },
};

export async function createCheckoutSession(
  userId: string,
  planId: keyof typeof SUBSCRIPTION_PLANS,
  successUrl: string,
  cancelUrl: string
) {
  const plan = SUBSCRIPTION_PLANS[planId];

  if (!plan) {
    throw new Error("Invalid plan ID");
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    customer_email: undefined, // Will be set from user email
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: plan.name,
            description: `Subscribe to ${plan.name}`,
          },
          unit_amount: plan.price,
          recurring: {
            interval: plan.interval,
            interval_count: 1,
          },
        },
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId,
      planId,
    },
  });

  return session;
}

export async function createPaymentIntent(
  amount: number,
  currency: string = "usd",
  metadata?: Record<string, string>
) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency,
    metadata,
  });

  return paymentIntent;
}

export async function handleStripeWebhook(
  event: Stripe.Event
): Promise<{ success: boolean; message: string }> {
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session;
      // Handle successful subscription
      console.log("Subscription created:", session.metadata);
      return { success: true, message: "Subscription created successfully" };

    case "customer.subscription.updated":
      const subscription = event.data.object as Stripe.Subscription;
      // Handle subscription update
      console.log("Subscription updated:", subscription.metadata);
      return { success: true, message: "Subscription updated" };

    case "customer.subscription.deleted":
      const deletedSubscription = event.data.object as Stripe.Subscription;
      // Handle subscription cancellation
      console.log("Subscription cancelled:", deletedSubscription.metadata);
      return { success: true, message: "Subscription cancelled" };

    case "payment_intent.succeeded":
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      // Handle successful payment
      console.log("Payment succeeded:", paymentIntent.metadata);
      return { success: true, message: "Payment succeeded" };

    case "payment_intent.payment_failed":
      const failedPayment = event.data.object as Stripe.PaymentIntent;
      // Handle failed payment
      console.log("Payment failed:", failedPayment.metadata);
      return { success: false, message: "Payment failed" };

    default:
      return { success: true, message: "Event received" };
  }
}
