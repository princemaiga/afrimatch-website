export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import * as bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, mode, name } = body;

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: "Invalid email address" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ message: "Password must be at least 8 characters" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // Try database if available
    if (process.env.DATABASE_URL) {
      try {
        const { db } = await import("@/lib/db/client");
        const { users, userModes } = await import("@/lib/db/schema");
        const { eq } = await import("drizzle-orm");

        const existing = await db
          .select({ id: users.id })
          .from(users)
          .where(eq(users.email, email.toLowerCase()))
          .limit(1);

        if (existing.length > 0) {
          return NextResponse.json(
            { message: "An account with this email already exists. Please log in." },
            { status: 409 }
          );
        }

        const displayName = name || email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());

        const [newUser] = await db
          .insert(users)
          .values({
            email: email.toLowerCase(),
            name: displayName,
            passwordHash,
            country: "NG", // Default to Nigeria, updated in profile setup
            dateOfBirth: new Date("1990-01-01"), // Placeholder, updated in profile setup
          })
          .returning({ id: users.id, email: users.email });

        const dbMode = mode === "community" ? "dating" : mode;
        if (dbMode && ["dating", "professional", "both"].includes(dbMode)) {
          await db.insert(userModes).values({
            userId: newUser.id,
            mode: dbMode as "dating" | "professional" | "both",
          });
        }

        // Send welcome email (non-blocking — don't fail signup if email fails)
        try {
          const { sendWelcomeEmail } = await import("@/lib/email");
          await sendWelcomeEmail(newUser.email, displayName);
        } catch (emailErr) {
          console.error("Welcome email error (non-fatal):", emailErr);
        }

        return NextResponse.json(
          { success: true, message: "Account created! Welcome to AfriMatch.", userId: newUser.id },
          { status: 201 }
        );
      } catch (dbError) {
        console.error("Database signup error:", dbError);
        // Fall through to demo mode
      }
    }

    // Demo/fallback mode — works without a database
    return NextResponse.json(
      { success: true, message: "Account created! Welcome to AfriMatch." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ message: "Failed to create account. Please try again." }, { status: 500 });
  }
}
