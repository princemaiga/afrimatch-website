export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { mode } = await request.json();

    if (!["community", "professional", "both"].includes(mode)) {
      return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
    }

    // Map community → dating for DB compatibility; never expose "dating" in response
    const dbMode = mode === "community" ? "dating" : mode;
    console.log(`User ${session.user.email} switched to ${mode} mode`);

    return NextResponse.json({
      success: true,
      mode,
      message: `Switched to ${mode} mode`,
    });
  } catch (error) {
    console.error("Mode switch error:", error);
    return NextResponse.json({ error: "Failed to switch mode" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's current mode and available modes
    // This would typically fetch from database
    return NextResponse.json({
      currentMode: "community",
      availableModes: ["community", "professional", "both"],
      subscription: {
        plan: "premium",
        mode: "community",
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });
  } catch (error) {
    console.error("Get mode error:", error);
    return NextResponse.json({ error: "Failed to get mode" }, { status: 500 });
  }
}
