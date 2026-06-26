import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, subscriptions } from "@/lib/db/schema";
import { desc, like, or, eq, count } from "drizzle-orm";

const ADMIN_EMAILS = ["princemaiga09@hotmail.com", "admin@afrimatch.app"];

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const offset = (page - 1) * limit;

    // Build query conditions
    const conditions = [];
    if (search) {
      conditions.push(
        or(
          like(users.name, `%${search}%`),
          like(users.email, `%${search}%`)
        )
      );
    }

    const allUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        country: users.country,
        createdAt: users.createdAt,
        status: users.status,
      })
      .from(users)
      .orderBy(desc(users.createdAt))
      .limit(limit)
      .offset(offset);

    const totalResult = await db.select({ count: count() }).from(users);
    const total = totalResult[0]?.count || 0;

    // Format response
    const formattedUsers = allUsers.map((u) => ({
      id: u.id,
      name: u.name || "Unknown",
      email: u.email,
      country: u.country || "—",
      mode: "community",
      createdAt: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—",
      subscription: null,
      verified: false,
      status: (u.status as "active" | "suspended" | "banned") || "active",
    }));

    return NextResponse.json({ users: formattedUsers, total });
  } catch (error) {
    console.error("Admin users API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
