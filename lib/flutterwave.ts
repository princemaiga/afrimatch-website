import axios from "axios";

const FLUTTERWAVE_BASE_URL = "https://api.flutterwave.com/v3";
const FLUTTERWAVE_PUBLIC_KEY = process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY;
const FLUTTERWAVE_SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY;

export const FLUTTERWAVE_PLANS = {
  dating_basic: {
    name: "Dating - Basic",
    amount: 5.0,
    currency: "USD",
    interval: "monthly",
  },
  dating_premium: {
    name: "Dating - Premium",
    amount: 9.99,
    currency: "USD",
    interval: "monthly",
  },
  jobs_recruiter_basic: {
    name: "Jobs - Recruiter Basic",
    amount: 19.99,
    currency: "USD",
    interval: "monthly",
  },
  jobs_recruiter_pro: {
    name: "Jobs - Recruiter Pro",
    amount: 49.99,
    currency: "USD",
    interval: "monthly",
  },
  jobs_company: {
    name: "Jobs - Company Posting",
    amount: 29.99,
    currency: "USD",
    interval: "monthly",
  },
  professional_headhunter: {
    name: "Professional - Headhunter",
    amount: 39.99,
    currency: "USD",
    interval: "monthly",
  },
};

const flutterwaveClient = axios.create({
  baseURL: FLUTTERWAVE_BASE_URL,
  headers: {
    Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
    "Content-Type": "application/json",
  },
});

export async function createFlutterwavePayment(
  email: string,
  amount: number,
  currency: string,
  planId: string,
  userId: string,
  redirectUrl: string
) {
  try {
    const response = await flutterwaveClient.post("/payments", {
      tx_ref: `${planId}_${userId}_${Date.now()}`,
      amount,
      currency,
      redirect_url: redirectUrl,
      customer: {
        email,
      },
      customizations: {
        title: "AfriMatch Subscription",
        description: `Subscribe to ${planId}`,
        logo: "https://afrimatch.app/logo.png",
      },
      meta: {
        userId,
        planId,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Flutterwave payment creation error:", error);
    throw error;
  }
}

export async function verifyFlutterwavePayment(transactionId: string) {
  try {
    const response = await flutterwaveClient.get(
      `/transactions/${transactionId}/verify`
    );
    return response.data;
  } catch (error) {
    console.error("Flutterwave verification error:", error);
    throw error;
  }
}

export async function createFlutterwavePlan(
  planId: keyof typeof FLUTTERWAVE_PLANS
) {
  const plan = FLUTTERWAVE_PLANS[planId];

  try {
    const response = await flutterwaveClient.post("/plans", {
      amount: plan.amount,
      name: plan.name,
      interval: plan.interval,
      duration: 0, // Infinite
      currency: plan.currency,
    });

    return response.data;
  } catch (error) {
    console.error("Flutterwave plan creation error:", error);
    throw error;
  }
}

export async function handleFlutterwaveWebhook(
  event: Record<string, any>
): Promise<{ success: boolean; message: string }> {
  try {
    const { event: eventType, data } = event;

    switch (eventType) {
      case "charge.completed":
        console.log("Payment completed:", data);
        return { success: true, message: "Payment completed successfully" };

      case "charge.failed":
        console.log("Payment failed:", data);
        return { success: false, message: "Payment failed" };

      case "subscription.created":
        console.log("Subscription created:", data);
        return { success: true, message: "Subscription created" };

      case "subscription.updated":
        console.log("Subscription updated:", data);
        return { success: true, message: "Subscription updated" };

      case "subscription.cancelled":
        console.log("Subscription cancelled:", data);
        return { success: true, message: "Subscription cancelled" };

      default:
        return { success: true, message: "Event received" };
    }
  } catch (error) {
    console.error("Flutterwave webhook error:", error);
    return { success: false, message: "Webhook processing error" };
  }
}

export function getFlutterwavePublicKey(): string {
  if (!FLUTTERWAVE_PUBLIC_KEY) {
    throw new Error("Flutterwave public key not configured");
  }
  return FLUTTERWAVE_PUBLIC_KEY;
}
