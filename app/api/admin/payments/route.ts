import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, subscriptions } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

const ADMIN_EMAILS = ["princemaiga09@hotmail.com", "admin@afrimatch.app"];

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get subscription/payment data with aliased fields
    const allSubs = await db
      .select({
        id: subscriptions.id,
        userId: subscriptions.userId,
        plan: subscriptions.planId,
        status: subscriptions.status,
        provider: subscriptions.paymentProvider,
        amount: subscriptions.price,
        currency: subscriptions.currency,
        createdAt: subscriptions.createdAt,
        userName: users.name,
        userEmail: users.email,
      })
      .from(subscriptions)
      .leftJoin(users, eq(subscriptions.userId, users.id))
      .orderBy(desc(subscriptions.createdAt))
      .limit(100);

    // Calculate stats — use aliased field names from select above
    const activeCount = allSubs.filter(s => s.status === "active").length;

    const totalRevenue = allSubs
      .filter(s => s.status === "active")
      .reduce((acc, s) => acc + parseFloat(s.amount || "0"), 0);

    const stripeRevenue = allSubs
      .filter(s => s.provider === "stripe" && s.status === "active")
      .reduce((acc, s) => acc + parseFloat(s.amount || "0"), 0);

    const flutterwaveRevenue = allSubs
      .filter(s => s.provider === "flutterwave" && s.status === "active")
      .reduce((acc, s) => acc + parseFloat(s.amount || "0"), 0);

    const payments = allSubs.map(s => ({
      id: s.id,
      userId: s.userId,
      userName: s.userName || "Unknown",
      userEmail: s.userEmail || "—",
      amount: parseFloat(s.amount || "0"),
      currency: s.currency || "USD",
      provider: (s.provider as "stripe" | "flutterwave") || "stripe",
      plan: s.plan || "unknown",
      status: (s.status as "active" | "cancelled" | "expired" | "pending") || "pending",
      createdAt: s.createdAt ? new Date(s.createdAt).toLocaleDateString() : "—",
    }));

    const stats = {
      totalRevenue,
      monthlyRevenue: totalRevenue,
      activeSubscriptions: activeCount,
      churnRate: 0,
      stripeRevenue,
      flutterwaveRevenue,
    };

    return NextResponse.json({ payments, stats });
  } catch (error) {
    console.error("Admin payments API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
