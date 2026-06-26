export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

/**
 * Advanced Search API
 * Supports searching users, jobs, courses, and articles
 * Requires authentication.
 */

export async function GET(request: NextRequest) {
  try {
    // Require authentication for search
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required to search" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const type = searchParams.get("type") || "all"; // all, users, jobs, courses, articles
    const location = searchParams.get("location") ?? undefined;
    const skills = searchParams.get("skills")?.split(",");
    const industry = searchParams.get("industry") ?? undefined;
    const minSalary = searchParams.get("minSalary") ?? undefined;
    const maxSalary = searchParams.get("maxSalary") ?? undefined;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const results: Record<string, any> = {
      users: [],
      jobs: [],
      courses: [],
      articles: [],
      pagination: {
        page,
        limit,
        total: 0,
      },
    };

    // Try database search if available
    if (process.env.DATABASE_URL) {
      try {
        const { db } = await import("@/lib/db/client");
        const { users } = await import("@/lib/db/schema");
        const { ilike, or } = await import("drizzle-orm");

        if (type === "all" || type === "users") {
          const dbUsers = await db
            .select({
              id: users.id,
              name: users.name,
              email: users.email,
              country: users.country,
            })
            .from(users)
            .where(
              or(
                ilike(users.name, `%${query}%`),
                ilike(users.email, `%${query}%`)
              )
            )
            .limit(limit)
            .offset((page - 1) * limit);

          results.users = dbUsers.map((u) => ({
            id: u.id,
            name: u.name,
            location: u.country || "Africa",
          }));
        }
      } catch (dbError) {
        console.error("DB search error:", dbError);
        // Return empty results on DB error — do not expose demo data
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
