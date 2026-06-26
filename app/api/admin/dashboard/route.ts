export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();

    // Check if user is admin
    if (!session?.user?.email || !session.user.email.includes("admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Mock dashboard data (in production, fetch from database)
    const stats = {
      totalUsers: 15420,
      activeUsers: 3240,
      totalSubscriptions: 4820,
      activeSubscriptions: 4200,
      monthlyRevenue: 52400,
      totalRevenue: 287600,
      churnRate: 4.2,
      ltv: 285,
      pendingVerifications: 42,
      reportedProfiles: 8,
    };

    const recentActivity = [
      {
        id: "1",
        type: "signup" as const,
        user: "John Doe",
        description: "Signed up for Community mode",
        timestamp: new Date(Date.now() - 5 * 60000),
      },
      {
        id: "2",
        type: "subscription" as const,
        user: "Jane Smith",
        description: "Upgraded to Premium plan",
        timestamp: new Date(Date.now() - 15 * 60000),
      },
      {
        id: "3",
        type: "payment" as const,
        user: "Mike Johnson",
        description: "Payment processed successfully",
        timestamp: new Date(Date.now() - 30 * 60000),
      },
      {
        id: "4",
        type: "report" as const,
        user: "Sarah Williams",
        description: "Profile reported for inappropriate content",
        timestamp: new Date(Date.now() - 45 * 60000),
      },
      {
        id: "5",
        type: "signup" as const,
        user: "Alex Brown",
        description: "Signed up for Professional mode",
        timestamp: new Date(Date.now() - 60 * 60000),
      },
    ];

    return NextResponse.json({
      stats,
      recentActivity,
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
