/**
 * User Safety & Moderation System
 */

export interface UserReport {
  id: string;
  reporterId: string;
  reportedUserId: string;
  category: ReportCategory;
  description: string;
  evidence: string[]; // URLs to screenshots/evidence
  status: "pending" | "reviewing" | "resolved" | "dismissed";
  resolution?: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

export interface UserBlock {
  id: string;
  blockerId: string;
  blockedUserId: string;
  reason?: string;
  createdAt: Date;
}

export interface UserWarning {
  id: string;
  userId: string;
  reason: string;
  severity: "low" | "medium" | "high";
  createdAt: Date;
  expiresAt: Date;
}

export interface UserSuspension {
  id: string;
  userId: string;
  reason: string;
  duration: number; // in days
  createdAt: Date;
  expiresAt: Date;
}

export type ReportCategory =
  | "inappropriate-content"
  | "fake-profile"
  | "harassment"
  | "scam"
  | "sexual-content"
  | "violence"
  | "hate-speech"
  | "spam"
  | "other";

export const REPORT_CATEGORIES: Record<ReportCategory, string> = {
  "inappropriate-content": "Inappropriate Content",
  "fake-profile": "Fake Profile",
  harassment: "Harassment",
  scam: "Scam/Fraud",
  "sexual-content": "Sexual Content",
  violence: "Violence",
  "hate-speech": "Hate Speech",
  spam: "Spam",
  other: "Other",
};

/**
 * Report a user
 */
export async function reportUser(
  reporterId: string,
  reportedUserId: string,
  category: ReportCategory,
  description: string,
  evidence: string[] = []
): Promise<UserReport> {
  const report: UserReport = {
    id: `report-${Date.now()}`,
    reporterId,
    reportedUserId,
    category,
    description,
    evidence,
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // In production, save to database
  console.log("Report created:", report);

  return report;
}

/**
 * Get user reports
 */
export async function getUserReports(userId: string): Promise<UserReport[]> {
  // In production, fetch from database
  return [];
}

/**
 * Get pending reports (for admin)
 */
export async function getPendingReports(): Promise<UserReport[]> {
  // In production, fetch from database
  return [];
}

/**
 * Resolve report
 */
export async function resolveReport(
  reportId: string,
  resolution: string,
  action?: "warn" | "suspend" | "ban"
): Promise<UserReport> {
  // In production, update database
  return {
    id: reportId,
    reporterId: "",
    reportedUserId: "",
    category: "other",
    description: "",
    evidence: [],
    status: "resolved",
    resolution,
    createdAt: new Date(),
    updatedAt: new Date(),
    resolvedAt: new Date(),
  };
}

/**
 * Block a user
 */
export async function blockUser(
  blockerId: string,
  blockedUserId: string,
  reason?: string
): Promise<UserBlock> {
  const block: UserBlock = {
    id: `block-${Date.now()}`,
    blockerId,
    blockedUserId,
    reason,
    createdAt: new Date(),
  };

  // In production, save to database
  console.log("User blocked:", block);

  return block;
}

/**
 * Unblock a user
 */
export async function unblockUser(blockerId: string, blockedUserId: string): Promise<void> {
  // In production, delete from database
  console.log(`User ${blockedUserId} unblocked by ${blockerId}`);
}

/**
 * Get blocked users
 */
export async function getBlockedUsers(userId: string): Promise<string[]> {
  // In production, fetch from database
  return [];
}

/**
 * Check if user is blocked
 */
export async function isUserBlocked(
  userId: string,
  potentialBlockerId: string
): Promise<boolean> {
  const blockedUsers = await getBlockedUsers(potentialBlockerId);
  return blockedUsers.includes(userId);
}

/**
 * Issue warning to user
 */
export async function warnUser(
  userId: string,
  reason: string,
  severity: "low" | "medium" | "high" = "medium"
): Promise<UserWarning> {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + (severity === "high" ? 30 : severity === "medium" ? 14 : 7));

  const warning: UserWarning = {
    id: `warning-${Date.now()}`,
    userId,
    reason,
    severity,
    createdAt: new Date(),
    expiresAt,
  };

  // In production, save to database
  console.log("Warning issued:", warning);

  return warning;
}

/**
 * Get user warnings
 */
export async function getUserWarnings(userId: string): Promise<UserWarning[]> {
  // In production, fetch from database
  return [];
}

/**
 * Suspend user account
 */
export async function suspendUser(
  userId: string,
  reason: string,
  durationDays: number = 7
): Promise<UserSuspension> {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + durationDays);

  const suspension: UserSuspension = {
    id: `suspension-${Date.now()}`,
    userId,
    reason,
    duration: durationDays,
    createdAt: new Date(),
    expiresAt,
  };

  // In production, save to database and disable account
  console.log("User suspended:", suspension);

  return suspension;
}

/**
 * Lift suspension
 */
export async function liftSuspension(userId: string): Promise<void> {
  // In production, update database and enable account
  console.log(`Suspension lifted for user ${userId}`);
}

/**
 * Ban user permanently
 */
export async function banUser(userId: string, reason: string): Promise<void> {
  // In production, update database and disable account permanently
  console.log(`User ${userId} banned. Reason: ${reason}`);
}

/**
 * Get user safety status
 */
export async function getUserSafetyStatus(userId: string): Promise<{
  warnings: number;
  reports: number;
  isSuspended: boolean;
  isBanned: boolean;
  lastWarning?: Date;
}> {
  const warnings = await getUserWarnings(userId);
  const reports = await getUserReports(userId);

  return {
    warnings: warnings.length,
    reports: reports.length,
    isSuspended: warnings.some((w) => w.severity === "high"),
    isBanned: false,
    lastWarning: warnings.length > 0 ? warnings[0].createdAt : undefined,
  };
}

/**
 * Verify profile authenticity
 */
export async function verifyProfile(userId: string): Promise<boolean> {
  // In production, implement verification logic
  // - Check photo authenticity
  // - Verify identity documents
  // - Check for suspicious patterns
  return true;
}

/**
 * Flag suspicious activity
 */
export async function flagSuspiciousActivity(
  userId: string,
  activityType: string,
  details: string
): Promise<void> {
  // In production, log and alert
  console.log(`Suspicious activity flagged for user ${userId}: ${activityType}`);
}

/**
 * Get moderation queue
 */
export async function getModerationQueue(): Promise<{
  pendingReports: number;
  pendingVerifications: number;
  suspiciousAccounts: number;
}> {
  return {
    pendingReports: 12,
    pendingVerifications: 8,
    suspiciousAccounts: 5,
  };
}
