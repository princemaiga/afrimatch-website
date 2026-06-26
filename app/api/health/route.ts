export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";

export async function GET() {
  const startTime = Date.now();

  const health = {
    status: "ok",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || "1.0.0",
    environment: process.env.NODE_ENV || "production",
    uptime: process.uptime(),
    checks: {
      database: "unknown" as string,
      email: "configured",
      payments: {
        stripe: !!process.env.STRIPE_SECRET_KEY,
        flutterwave: !!process.env.FLUTTERWAVE_SECRET_KEY,
      },
    },
    responseTime: 0,
  };

  // Check database connectivity
  try {
    if (process.env.DATABASE_URL) {
      // Use postgres client directly for a lightweight ping
      const postgres = (await import("postgres")).default;
      const sql = postgres(process.env.DATABASE_URL, {
        max: 1,
        connect_timeout: 5,
        idle_timeout: 5,
        ssl: "require",
      });
      await sql`SELECT 1`;
      await sql.end();
      health.checks.database = "connected";
    } else {
      health.checks.database = "not_configured";
    }
  } catch (err) {
    console.error("Health DB check error:", err);
    health.checks.database = "error";
  }

  health.responseTime = Date.now() - startTime;

  const statusCode = health.checks.database === "error" ? 503 : 200;

  return NextResponse.json(health, { status: statusCode });
}
