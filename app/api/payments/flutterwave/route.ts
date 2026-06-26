export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

const FLUTTERWAVE_BASE_URL = "https://api.flutterwave.com/v3";
const FLUTTERWAVE_SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY;

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { planId, mode, currency = "USD", phoneNumber } = await request.json();

    // Define pricing plans with multi-currency support (Professional only — Community is free)
    const plans: Record<
      string,
      { name: string; amount: number; currencies: Record<string, number> }
    > = {
      professional_career_monthly: {
        name: "Professional — Career",
        amount: 24.99,
        currencies: { USD: 24.99, NGN: 12495, ZAR: 450, KES: 3250, GHS: 175 },
      },
      professional_executive_monthly: {
        name: "Professional — Executive",
        amount: 59.99,
        currencies: { USD: 59.99, NGN: 29995, ZAR: 1080, KES: 7800, GHS: 420 },
      },
      professional_career_yearly: {
        name: "Professional — Career (Annual)",
        amount: 149.88,
        currencies: { USD: 149.88, NGN: 74940, ZAR: 2700, KES: 19500, GHS: 1050 },
      },
      professional_executive_yearly: {
        name: "Professional — Executive (Annual)",
        amount: 359.88,
        currencies: { USD: 359.88, NGN: 179940, ZAR: 6480, KES: 46800, GHS: 2520 },
      },
      // Legacy IDs mapped to professional equivalents
      basic_professional: {
        name: "Professional — Career",
        amount: 24.99,
        currencies: { USD: 24.99, NGN: 12495, ZAR: 450, KES: 3250, GHS: 175 },
      },
      pro_professional: {
        name: "Professional — Executive",
        amount: 59.99,
        currencies: { USD: 59.99, NGN: 29995, ZAR: 1080, KES: 7800, GHS: 420 },
      },
      enterprise_professional: {
        name: "Professional — Enterprise",
        amount: 99.99,
        currencies: { USD: 99.99, NGN: 49995, ZAR: 1800, KES: 13000, GHS: 700 },
      },
    };

    const plan = plans[planId];
    if (!plan) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const amount = plan.currencies[currency] || plan.amount;

    // Create Flutterwave payment link
    const payload = {
      tx_ref: `${planId}_${Date.now()}`,
      amount: Math.round(amount * 100) / 100,
      currency,
      payment_options: "card,account,ussd,banktransfer,mpesa",
      redirect_url: `${process.env.NEXTAUTH_URL}/dashboard?payment=success&mode=${mode}`,
      customer: {
        email: session.user.email,
        phonenumber: phoneNumber || "",
        name: session.user.name || "User",
      },
      customizations: {
        title: "AfriMatch Subscription",
        description: plan.name,
        logo: `${process.env.NEXTAUTH_URL}/logo.png`,
      },
      meta: {
        planId,
        mode,
        userEmail: session.user.email,
      },
    };

    const response = await fetch(`${FLUTTERWAVE_BASE_URL}/payments`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Flutterwave error:", data);
      return NextResponse.json({ error: "Payment processing failed" }, { status: 400 });
    }

    return NextResponse.json({
      link: data.data.link,
      reference: data.data.link_id,
    });
  } catch (error) {
    console.error("Flutterwave error:", error);
    return NextResponse.json({ error: "Payment processing failed" }, { status: 500 });
  }
}

// Handle webhook verification
export async function PUT(request: NextRequest) {
  try {
    const { transactionId } = await request.json();

    if (!transactionId) {
      return NextResponse.json({ error: "Missing transaction ID" }, { status: 400 });
    }

    // Verify transaction with Flutterwave
    const response = await fetch(
      `${FLUTTERWAVE_BASE_URL}/transactions/${transactionId}/verify`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
        },
      }
    );

    const data = await response.json();

    if (data.status === "success" && data.data.status === "successful") {
      // Update user subscription in database
      console.log("Payment verified:", transactionId);
      return NextResponse.json({ verified: true, data: data.data });
    }

    return NextResponse.json({ verified: false }, { status: 400 });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
