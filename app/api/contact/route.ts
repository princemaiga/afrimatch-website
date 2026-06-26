export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    // Log the contact form submission
    console.log("[Contact Form]", { name, email, subject, message: message.slice(0, 100) });

    // Send via Resend if configured
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        const FROM = process.env.RESEND_FROM_EMAIL || "AfriMatch <onboarding@resend.dev>";

        // 1. Forward the message to the support inbox
        await resend.emails.send({
          from: FROM,
          to: "princemaiga09@hotmail.com", // Support inbox
          replyTo: email,
          subject: `[Contact] ${subject} — from ${name}`,
          html: `
            <h2 style="font-family:sans-serif;">New Contact Form Submission</h2>
            <p style="font-family:sans-serif;"><strong>Name:</strong> ${name}</p>
            <p style="font-family:sans-serif;"><strong>Email:</strong> ${email}</p>
            <p style="font-family:sans-serif;"><strong>Subject:</strong> ${subject}</p>
            <hr/>
            <p style="font-family:sans-serif;">${message.replace(/\n/g, "<br/>")}</p>
          `,
        });

        // 2. Send confirmation to the user
        const { sendContactConfirmationEmail } = await import("@/lib/email");
        await sendContactConfirmationEmail(email, name, subject);
      } catch (emailError) {
        console.error("Resend contact email error:", emailError);
        // Non-fatal — still return success
      }
    }

    return NextResponse.json({ success: true, message: "Message sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ message: "Failed to send message" }, { status: 500 });
  }
}
