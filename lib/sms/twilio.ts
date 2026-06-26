/**
 * SMS Notification System using Twilio
 * Sends critical alerts and notifications via SMS
 */

import twilio from "twilio";

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

let client: any = null;

if (accountSid && authToken && fromNumber) {
  client = twilio(accountSid, authToken);
}

export interface SMSNotification {
  to: string;
  message: string;
  priority?: "high" | "normal" | "low";
}

/**
 * Send SMS notification
 */
export async function sendSMS(notification: SMSNotification): Promise<void> {
  if (!client) {
    console.warn("Twilio not configured. SMS notification not sent.");
    return;
  }

  try {
    const message = await client.messages.create({
      body: notification.message,
      from: fromNumber,
      to: notification.to,
    });

    console.log(`SMS sent to ${notification.to}: ${message.sid}`);
  } catch (error) {
    console.error("Twilio SMS error:", error);
    throw error;
  }
}

/**
 * New message SMS notification
 */
export async function sendNewMessageSMS(
  phoneNumber: string,
  senderName: string
): Promise<void> {
  const message = `${senderName} sent you a message on AfriMatch! Open the app to reply.`;

  await sendSMS({
    to: phoneNumber,
    message,
    priority: "high",
  });
}

/**
 * New match SMS notification
 */
export async function sendNewMatchSMS(
  phoneNumber: string,
  matchName: string
): Promise<void> {
  const message = `You matched with ${matchName} on AfriMatch! 💕 Open the app to start chatting.`;

  await sendSMS({
    to: phoneNumber,
    message,
    priority: "high",
  });
}

/**
 * Job application SMS notification
 */
export async function sendJobApplicationSMS(
  phoneNumber: string,
  jobTitle: string,
  applicantName: string
): Promise<void> {
  const message = `${applicantName} applied for your ${jobTitle} position on AfriMatch. Check the app to review.`;

  await sendSMS({
    to: phoneNumber,
    message,
    priority: "normal",
  });
}

/**
 * Mentor request SMS notification
 */
export async function sendMentorRequestSMS(
  phoneNumber: string,
  menteeName: string
): Promise<void> {
  const message = `${menteeName} requested mentorship from you on AfriMatch. Open the app to respond.`;

  await sendSMS({
    to: phoneNumber,
    message,
    priority: "normal",
  });
}

/**
 * Subscription payment SMS notification
 */
export async function sendPaymentConfirmationSMS(
  phoneNumber: string,
  amount: string,
  currency: string,
  planName: string
): Promise<void> {
  const message = `Payment confirmed: ${currency} ${amount} for ${planName} subscription on AfriMatch. Thank you!`;

  await sendSMS({
    to: phoneNumber,
    message,
    priority: "high",
  });
}

/**
 * Payment failed SMS notification
 */
export async function sendPaymentFailedSMS(
  phoneNumber: string,
  amount: string,
  currency: string
): Promise<void> {
  const message = `Payment failed for ${currency} ${amount} on AfriMatch. Please update your payment method in the app.`;

  await sendSMS({
    to: phoneNumber,
    message,
    priority: "high",
  });
}

/**
 * Subscription renewal reminder SMS
 */
export async function sendSubscriptionRenewalReminderSMS(
  phoneNumber: string,
  renewalDate: string,
  planName: string
): Promise<void> {
  const message = `Your ${planName} subscription renews on ${renewalDate}. Manage your subscription in the AfriMatch app.`;

  await sendSMS({
    to: phoneNumber,
    message,
    priority: "normal",
  });
}

/**
 * Account warning SMS notification
 */
export async function sendAccountWarningSMS(
  phoneNumber: string,
  reason: string
): Promise<void> {
  const message = `Your AfriMatch account has received a warning for: ${reason}. Review our community guidelines in the app.`;

  await sendSMS({
    to: phoneNumber,
    message,
    priority: "high",
  });
}

/**
 * Account suspended SMS notification
 */
export async function sendAccountSuspendedSMS(
  phoneNumber: string,
  reason: string
): Promise<void> {
  const message = `Your AfriMatch account has been suspended for: ${reason}. Contact support@afrimatch.app to appeal.`;

  await sendSMS({
    to: phoneNumber,
    message,
    priority: "high",
  });
}

/**
 * Verification code SMS
 */
export async function sendVerificationCodeSMS(
  phoneNumber: string,
  code: string
): Promise<void> {
  const message = `Your AfriMatch verification code is: ${code}. Valid for 10 minutes.`;

  await sendSMS({
    to: phoneNumber,
    message,
    priority: "high",
  });
}

/**
 * Password reset SMS
 */
export async function sendPasswordResetSMS(
  phoneNumber: string,
  resetLink: string
): Promise<void> {
  const message = `Reset your AfriMatch password: ${resetLink} (Valid for 1 hour)`;

  await sendSMS({
    to: phoneNumber,
    message,
    priority: "high",
  });
}

/**
 * Course completion SMS
 */
export async function sendCourseCompletionSMS(
  phoneNumber: string,
  courseTitle: string
): Promise<void> {
  const message = `Congratulations! You completed "${courseTitle}" on AfriMatch. Download your certificate in the app.`;

  await sendSMS({
    to: phoneNumber,
    message,
    priority: "normal",
  });
}

/**
 * Batch send SMS notifications
 */
export async function sendBatchSMS(
  notifications: SMSNotification[]
): Promise<void> {
  if (!client) {
    console.warn("Twilio not configured. Batch SMS not sent.");
    return;
  }

  try {
    const promises = notifications.map((notification) =>
      client.messages.create({
        body: notification.message,
        from: fromNumber,
        to: notification.to,
      })
    );

    await Promise.all(promises);
    console.log(`Batch of ${notifications.length} SMS sent`);
  } catch (error) {
    console.error("Batch SMS error:", error);
    throw error;
  }
}

/**
 * Get SMS delivery status
 */
export async function getSMSStatus(messageSid: string): Promise<string> {
  if (!client) {
    throw new Error("Twilio not configured");
  }

  try {
    const message = await client.messages(messageSid).fetch();
    return message.status;
  } catch (error) {
    console.error("Error fetching SMS status:", error);
    throw error;
  }
}

/**
 * Get SMS usage statistics
 */
export async function getSMSUsage(): Promise<{
  totalSent: number;
  totalCost: number;
  averageCost: number;
}> {
  if (!client) {
    throw new Error("Twilio not configured");
  }

  try {
    const messages = await client.messages.list({ limit: 1000 });
    const totalSent = messages.length;
    const totalCost = messages.reduce(
      (sum: number, msg: any) => sum + parseFloat(msg.price || 0),
      0
    );
    const averageCost = totalSent > 0 ? totalCost / totalSent : 0;

    return {
      totalSent,
      totalCost: Math.abs(totalCost),
      averageCost: Math.abs(averageCost),
    };
  } catch (error) {
    console.error("Error fetching SMS usage:", error);
    throw error;
  }
}

/**
 * SMS opt-in/opt-out management
 */
export class SMSPreferences {
  private preferences: Map<string, boolean> = new Map();

  /**
   * Opt in to SMS notifications
   */
  optIn(phoneNumber: string): void {
    this.preferences.set(phoneNumber, true);
  }

  /**
   * Opt out of SMS notifications
   */
  optOut(phoneNumber: string): void {
    this.preferences.set(phoneNumber, false);
  }

  /**
   * Check if user opted in
   */
  isOptedIn(phoneNumber: string): boolean {
    return this.preferences.get(phoneNumber) ?? true; // Default to opted in
  }

  /**
   * Get all opted-in users
   */
  getOptedInUsers(): string[] {
    return Array.from(this.preferences.entries())
      .filter(([_, opted]) => opted)
      .map(([phone]) => phone);
  }
}

export const smsPreferences = new SMSPreferences();

/**
 * Send SMS only if user opted in
 */
export async function sendSMSIfOptedIn(
  notification: SMSNotification
): Promise<void> {
  if (smsPreferences.isOptedIn(notification.to)) {
    await sendSMS(notification);
  } else {
    console.log(`User ${notification.to} opted out of SMS notifications`);
  }
}
