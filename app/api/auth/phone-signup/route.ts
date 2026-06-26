export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// In-memory OTP store (in production use Redis or database)
const otpStore = new Map<string, { phone: string; otp: string; expiresAt: Date; mode: string }>();

/**
 * Phone Signup API Route
 * Sends OTP to phone number for verification.
 * Signup is always free.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, mode } = body;

    if (!phone) {
      return NextResponse.json(
        { message: "Phone number is required" },
        { status: 400 }
      );
    }

    // Validate phone format (basic check for international format)
    const phoneRegex = /^\+?[1-9]\d{7,14}$/;
    const cleanPhone = phone.replace(/\s/g, "");
    if (!phoneRegex.test(cleanPhone)) {
      return NextResponse.json(
        { message: "Invalid phone number. Please include country code (e.g., +234...)" },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const sessionId = crypto.randomBytes(16).toString("hex");
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP
    otpStore.set(sessionId, {
      phone: cleanPhone,
      otp,
      expiresAt,
      mode: mode || "dating",
    });

    // In production, send SMS via Twilio/Africa's Talking
    // For now, log the OTP (remove in production)
    console.log(`[OTP] Phone: ${cleanPhone}, OTP: ${otp}`);

    // Try to send via SMS provider if configured
    if (process.env.AFRICAS_TALKING_API_KEY) {
      try {
        const response = await fetch("https://api.africastalking.com/version1/messaging", {
          method: "POST",
          headers: {
            Accept: "application/json",
            apiKey: process.env.AFRICAS_TALKING_API_KEY,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            username: process.env.AFRICAS_TALKING_USERNAME || "sandbox",
            to: cleanPhone,
            message: `Your AfriMatch verification code is: ${otp}. Valid for 10 minutes.`,
          }),
        });
        if (!response.ok) {
          console.error("SMS send failed:", await response.text());
        }
      } catch (smsError) {
        console.error("SMS error:", smsError);
      }
    }

    return NextResponse.json(
      {
        success: true,
        sessionId,
        message: "OTP sent to your phone number",
        // In development, include OTP for testing
        ...(process.env.NODE_ENV !== "production" && { otp }),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Phone signup error:", error);
    return NextResponse.json(
      { message: "Failed to send OTP. Please try again." },
      { status: 500 }
    );
  }
}

/**
 * Verify OTP
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, otp } = body;

    if (!sessionId || !otp) {
      return NextResponse.json(
        { message: "Session ID and OTP are required" },
        { status: 400 }
      );
    }

    const stored = otpStore.get(sessionId);
    if (!stored) {
      return NextResponse.json(
        { message: "Invalid or expired session" },
        { status: 400 }
      );
    }

    if (new Date() > stored.expiresAt) {
      otpStore.delete(sessionId);
      return NextResponse.json(
        { message: "OTP has expired. Please request a new one." },
        { status: 400 }
      );
    }

    if (stored.otp !== otp) {
      return NextResponse.json(
        { message: "Invalid OTP. Please try again." },
        { status: 400 }
      );
    }

    // OTP verified - clean up
    otpStore.delete(sessionId);

    return NextResponse.json(
      {
        success: true,
        phone: stored.phone,
        mode: stored.mode,
        message: "Phone verified successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("OTP verification error:", error);
    return NextResponse.json(
      { message: "Verification failed. Please try again." },
      { status: 500 }
    );
  }
}
