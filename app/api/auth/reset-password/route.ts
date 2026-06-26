export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken, consumeToken, generatePasswordResetToken } from "@/lib/email/tokens";
import { getUserByEmail, updateUser } from "@/lib/db/queries";
import { sendPasswordResetEmail } from "@/lib/email/sendgrid";
import * as bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await getUserByEmail(email);

    if (!user) {
      // Don't reveal if user exists for security
      return NextResponse.json({ message: "If email exists, reset link has been sent" });
    }

    // Generate reset token
    const token = generatePasswordResetToken(email);

    // Send reset email
    await sendPasswordResetEmail(email, token);

    return NextResponse.json({ message: "Password reset link sent to email" });
  } catch (error) {
    console.error("Password reset request error:", error);
    return NextResponse.json({ error: "Failed to process reset request" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: "Token and new password are required" },
        { status: 400 }
      );
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Verify token
    const email = verifyToken(token, "password_reset");

    if (!email) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    // Get user
    const user = await getUserByEmail(email);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Update user
    await updateUser(user.id, { passwordHash });

    // Consume token
    consumeToken(token);

    return NextResponse.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 });
  }
}
