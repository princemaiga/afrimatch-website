/**
 * Email Notification System
 * Handles all email communications using SendGrid
 */

import sgMail from "@sendgrid/mail";

// Initialize SendGrid
const sendgridApiKey = process.env.SENDGRID_API_KEY;
if (sendgridApiKey) {
  sgMail.setApiKey(sendgridApiKey);
}

export interface EmailNotification {
  to: string;
  subject: string;
  templateId: string;
  dynamicTemplateData: Record<string, any>;
}

/**
 * Send email notification
 */
export async function sendEmailNotification(
  notification: EmailNotification
): Promise<void> {
  try {
    const msg = {
      to: notification.to,
      from: process.env.SENDGRID_FROM_EMAIL || "noreply@afrimatch.app",
      templateId: notification.templateId,
      dynamicTemplateData: notification.dynamicTemplateData,
    };

    await sgMail.send(msg);
    console.log(`Email sent to ${notification.to}`);
  } catch (error) {
    console.error("SendGrid error:", error);
    throw error;
  }
}

/**
 * New message notification
 */
export async function sendNewMessageNotification(
  recipientEmail: string,
  senderName: string,
  messagePreview: string
): Promise<void> {
  await sendEmailNotification({
    to: recipientEmail,
    subject: `New message from ${senderName}`,
    templateId: process.env.SENDGRID_NEW_MESSAGE_TEMPLATE_ID || "d-new-message",
    dynamicTemplateData: {
      senderName,
      messagePreview,
      actionUrl: "https://afrimatch.app/messages",
    },
  });
}

/**
 * Job application notification
 */
export async function sendJobApplicationNotification(
  recipientEmail: string,
  jobTitle: string,
  applicantName: string
): Promise<void> {
  await sendEmailNotification({
    to: recipientEmail,
    subject: `New application for ${jobTitle}`,
    templateId: process.env.SENDGRID_JOB_APPLICATION_TEMPLATE_ID || "d-job-application",
    dynamicTemplateData: {
      jobTitle,
      applicantName,
      actionUrl: "https://afrimatch.app/professional/jobs/applications",
    },
  });
}

/**
 * Mentor request notification
 */
export async function sendMentorRequestNotification(
  mentorEmail: string,
  menteeeName: string,
  menteeTitle: string
): Promise<void> {
  await sendEmailNotification({
    to: mentorEmail,
    subject: `New mentorship request from ${menteeeName}`,
    templateId: process.env.SENDGRID_MENTOR_REQUEST_TEMPLATE_ID || "d-mentor-request",
    dynamicTemplateData: {
      menteeName: menteeeName,
      menteeTitle,
      actionUrl: "https://afrimatch.app/professional/mentors/requests",
    },
  });
}

/**
 * Match notification (dating)
 */
export async function sendMatchNotification(
  recipientEmail: string,
  matchName: string,
  matchImage: string
): Promise<void> {
  await sendEmailNotification({
    to: recipientEmail,
    subject: `You have a new match: ${matchName}`,
    templateId: process.env.SENDGRID_MATCH_NOTIFICATION_TEMPLATE_ID || "d-match-notification",
    dynamicTemplateData: {
      matchName,
      matchImage,
      actionUrl: "https://afrimatch.app/dating/matches",
    },
  });
}

/**
 * Course enrollment confirmation
 */
export async function sendCourseEnrollmentConfirmation(
  recipientEmail: string,
  courseTitle: string,
  instructorName: string
): Promise<void> {
  await sendEmailNotification({
    to: recipientEmail,
    subject: `Welcome to ${courseTitle}`,
    templateId: process.env.SENDGRID_COURSE_ENROLLMENT_TEMPLATE_ID || "d-course-enrollment",
    dynamicTemplateData: {
      courseTitle,
      instructorName,
      actionUrl: "https://afrimatch.app/professional/courses",
    },
  });
}

/**
 * Article published notification
 */
export async function sendArticlePublishedNotification(
  recipientEmail: string,
  articleTitle: string,
  articleSlug: string,
  category: string
): Promise<void> {
  await sendEmailNotification({
    to: recipientEmail,
    subject: `New article: ${articleTitle}`,
    templateId: process.env.SENDGRID_ARTICLE_PUBLISHED_TEMPLATE_ID || "d-article-published",
    dynamicTemplateData: {
      articleTitle,
      category,
      actionUrl: `https://afrimatch.app/blog/${articleSlug}`,
    },
  });
}

/**
 * Subscription renewal reminder
 */
export async function sendSubscriptionRenewalReminder(
  recipientEmail: string,
  planName: string,
  renewalDate: string
): Promise<void> {
  await sendEmailNotification({
    to: recipientEmail,
    subject: `Your ${planName} subscription renews on ${renewalDate}`,
    templateId: process.env.SENDGRID_SUBSCRIPTION_RENEWAL_TEMPLATE_ID || "d-subscription-renewal",
    dynamicTemplateData: {
      planName,
      renewalDate,
      actionUrl: "https://afrimatch.app/account/subscription",
    },
  });
}

/**
 * Payment failed notification
 */
export async function sendPaymentFailedNotification(
  recipientEmail: string,
  amount: string,
  currency: string
): Promise<void> {
  await sendEmailNotification({
    to: recipientEmail,
    subject: "Payment Failed - Action Required",
    templateId: process.env.SENDGRID_PAYMENT_FAILED_TEMPLATE_ID || "d-payment-failed",
    dynamicTemplateData: {
      amount,
      currency,
      actionUrl: "https://afrimatch.app/account/billing",
    },
  });
}

/**
 * Account suspended notification
 */
export async function sendAccountSuspendedNotification(
  recipientEmail: string,
  reason: string,
  appealUrl: string
): Promise<void> {
  await sendEmailNotification({
    to: recipientEmail,
    subject: "Your Account Has Been Suspended",
    templateId: process.env.SENDGRID_ACCOUNT_SUSPENDED_TEMPLATE_ID || "d-account-suspended",
    dynamicTemplateData: {
      reason,
      appealUrl,
    },
  });
}

/**
 * Account warning notification
 */
export async function sendAccountWarningNotification(
  recipientEmail: string,
  reason: string,
  guidelines: string
): Promise<void> {
  await sendEmailNotification({
    to: recipientEmail,
    subject: "Account Warning",
    templateId: process.env.SENDGRID_ACCOUNT_WARNING_TEMPLATE_ID || "d-account-warning",
    dynamicTemplateData: {
      reason,
      guidelines,
      actionUrl: "https://afrimatch.app/account/settings",
    },
  });
}

/**
 * Weekly digest notification
 */
export async function sendWeeklyDigest(
  recipientEmail: string,
  userName: string,
  newMatches: number,
  newMessages: number,
  newJobs: number,
  newArticles: number
): Promise<void> {
  await sendEmailNotification({
    to: recipientEmail,
    subject: `Your AfriMatch Weekly Digest`,
    templateId: process.env.SENDGRID_WEEKLY_DIGEST_TEMPLATE_ID || "d-weekly-digest",
    dynamicTemplateData: {
      userName,
      newMatches,
      newMessages,
      newJobs,
      newArticles,
      actionUrl: "https://afrimatch.app/dashboard",
    },
  });
}

/**
 * Batch send notifications
 */
export async function sendBatchNotifications(
  notifications: EmailNotification[]
): Promise<void> {
  try {
    const messages = notifications.map((notification) => ({
      to: notification.to,
      from: process.env.SENDGRID_FROM_EMAIL || "noreply@afrimatch.app",
      templateId: notification.templateId,
      dynamicTemplateData: notification.dynamicTemplateData,
    }));

    await sgMail.sendMultiple(messages as any);
    console.log(`Batch of ${notifications.length} emails sent`);
  } catch (error) {
    console.error("Batch send error:", error);
    throw error;
  }
}

/**
 * Send transactional email
 */
export async function sendTransactionalEmail(
  to: string,
  subject: string,
  htmlContent: string
): Promise<void> {
  try {
    const msg = {
      to,
      from: process.env.SENDGRID_FROM_EMAIL || "noreply@afrimatch.app",
      subject,
      html: htmlContent,
    };

    await sgMail.send(msg);
    console.log(`Transactional email sent to ${to}`);
  } catch (error) {
    console.error("SendGrid error:", error);
    throw error;
  }
}
