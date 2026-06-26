/**
 * Analytics Dashboard Configuration
 * Integrates Google Analytics 4, Mixpanel, and Amplitude
 */

// Google Analytics 4
export const GA4_CONFIG = {
  measurementId: process.env.GOOGLE_ANALYTICS_ID || "G-XXXXXXXXXX",
  apiSecret: process.env.GA4_API_SECRET,
  propertyId: process.env.GA4_PROPERTY_ID,
};

// Mixpanel
export const MIXPANEL_CONFIG = {
  token: process.env.MIXPANEL_TOKEN || "xxxxx",
  serverUrl: "https://api.mixpanel.com",
};

// Amplitude
export const AMPLITUDE_CONFIG = {
  apiKey: process.env.AMPLITUDE_API_KEY || "xxxxx",
  serverUrl: "https://api2.amplitude.com",
};

/**
 * Analytics events to track
 */
export const ANALYTICS_EVENTS = {
  // User events
  USER_SIGNUP: "user_signup",
  USER_LOGIN: "user_login",
  USER_LOGOUT: "user_logout",
  USER_PROFILE_CREATED: "user_profile_created",
  USER_PROFILE_UPDATED: "user_profile_updated",
  USER_DELETED: "user_deleted",

  // Dating mode events
  MATCH_CREATED: "match_created",
  MESSAGE_SENT: "message_sent",
  MESSAGE_RECEIVED: "message_received",
  PROFILE_VIEWED: "profile_viewed",
  PROFILE_LIKED: "profile_liked",
  PROFILE_PASSED: "profile_passed",

  // Professional mode events
  JOB_APPLIED: "job_applied",
  JOB_SAVED: "job_saved",
  JOB_VIEWED: "job_viewed",
  MENTOR_REQUEST_SENT: "mentor_request_sent",
  MENTOR_REQUEST_ACCEPTED: "mentor_request_accepted",
  COURSE_ENROLLED: "course_enrolled",
  COURSE_COMPLETED: "course_completed",

  // Subscription events
  SUBSCRIPTION_CREATED: "subscription_created",
  SUBSCRIPTION_UPGRADED: "subscription_upgraded",
  SUBSCRIPTION_DOWNGRADED: "subscription_downgraded",
  SUBSCRIPTION_CANCELLED: "subscription_cancelled",
  SUBSCRIPTION_RENEWED: "subscription_renewed",

  // Payment events
  PAYMENT_INITIATED: "payment_initiated",
  PAYMENT_COMPLETED: "payment_completed",
  PAYMENT_FAILED: "payment_failed",
  PAYMENT_REFUNDED: "payment_refunded",

  // Content events
  BLOG_ARTICLE_VIEWED: "blog_article_viewed",
  BLOG_ARTICLE_SHARED: "blog_article_shared",
  BLOG_ARTICLE_COMMENTED: "blog_article_commented",

  // Referral events
  REFERRAL_LINK_CLICKED: "referral_link_clicked",
  REFERRAL_COMPLETED: "referral_completed",

  // Search events
  SEARCH_PERFORMED: "search_performed",
  SEARCH_RESULT_CLICKED: "search_result_clicked",

  // Error events
  ERROR_OCCURRED: "error_occurred",
  PAGE_ERROR: "page_error",
};

/**
 * User properties to track
 */
export const USER_PROPERTIES = {
  userId: "user_id",
  email: "email",
  country: "country",
  platform: "platform",
  appVersion: "app_version",
  signupDate: "signup_date",
  subscriptionPlan: "subscription_plan",
  subscriptionStatus: "subscription_status",
  totalSpent: "total_spent",
  referralCode: "referral_code",
  referredBy: "referred_by",
  profileCompletion: "profile_completion",
  lastLoginDate: "last_login_date",
  accountAge: "account_age",
};

/**
 * Conversion funnels to track
 */
export const CONVERSION_FUNNELS = {
  SIGNUP_TO_PAYMENT: {
    name: "Signup to Payment",
    steps: [
      "user_signup",
      "user_profile_created",
      "subscription_created",
      "payment_completed",
    ],
  },
  DATING_ENGAGEMENT: {
    name: "Dating Engagement",
    steps: [
      "user_signup",
      "profile_viewed",
      "match_created",
      "message_sent",
    ],
  },
  PROFESSIONAL_ENGAGEMENT: {
    name: "Professional Engagement",
    steps: [
      "user_signup",
      "job_viewed",
      "job_applied",
      "mentor_request_sent",
    ],
  },
  COURSE_COMPLETION: {
    name: "Course Completion",
    steps: [
      "user_signup",
      "course_enrolled",
      "course_completed",
    ],
  },
};

/**
 * Dashboards to create
 */
export const DASHBOARDS = {
  EXECUTIVE_SUMMARY: {
    name: "Executive Summary",
    metrics: [
      "total_users",
      "active_users_30d",
      "new_signups",
      "subscription_revenue",
      "user_retention_rate",
      "churn_rate",
      "ltv",
      "cac",
    ],
  },
  USER_ACQUISITION: {
    name: "User Acquisition",
    metrics: [
      "total_signups",
      "signups_by_source",
      "signups_by_country",
      "signups_by_platform",
      "conversion_rate",
      "cost_per_acquisition",
      "referral_signups",
    ],
  },
  ENGAGEMENT: {
    name: "Engagement",
    metrics: [
      "daily_active_users",
      "weekly_active_users",
      "monthly_active_users",
      "average_session_duration",
      "messages_sent",
      "matches_created",
      "jobs_applied",
      "courses_completed",
    ],
  },
  MONETIZATION: {
    name: "Monetization",
    metrics: [
      "total_revenue",
      "subscription_revenue",
      "arpu",
      "mrr",
      "arr",
      "subscription_count",
      "churn_rate",
      "ltv_cac_ratio",
    ],
  },
  RETENTION: {
    name: "Retention",
    metrics: [
      "day_1_retention",
      "day_7_retention",
      "day_30_retention",
      "churn_rate",
      "repeat_purchase_rate",
      "customer_lifetime_value",
    ],
  },
};

/**
 * Key Performance Indicators (KPIs)
 */
export const KPIs = {
  // Growth KPIs
  DAILY_ACTIVE_USERS: {
    name: "Daily Active Users",
    target: 50000,
    unit: "users",
    frequency: "daily",
  },
  MONTHLY_ACTIVE_USERS: {
    name: "Monthly Active Users",
    target: 500000,
    unit: "users",
    frequency: "monthly",
  },
  NEW_SIGNUPS: {
    name: "New Signups",
    target: 5000,
    unit: "users",
    frequency: "daily",
  },
  SIGNUP_CONVERSION_RATE: {
    name: "Signup Conversion Rate",
    target: 15,
    unit: "%",
    frequency: "daily",
  },

  // Engagement KPIs
  AVERAGE_SESSION_DURATION: {
    name: "Average Session Duration",
    target: 15,
    unit: "minutes",
    frequency: "daily",
  },
  MESSAGES_PER_USER: {
    name: "Messages Per User",
    target: 10,
    unit: "messages",
    frequency: "daily",
  },
  MATCHES_PER_USER: {
    name: "Matches Per User",
    target: 5,
    unit: "matches",
    frequency: "daily",
  },

  // Monetization KPIs
  MONTHLY_RECURRING_REVENUE: {
    name: "Monthly Recurring Revenue",
    target: 500000,
    unit: "$",
    frequency: "monthly",
  },
  AVERAGE_REVENUE_PER_USER: {
    name: "Average Revenue Per User",
    target: 15,
    unit: "$",
    frequency: "monthly",
  },
  SUBSCRIPTION_CONVERSION_RATE: {
    name: "Subscription Conversion Rate",
    target: 20,
    unit: "%",
    frequency: "daily",
  },

  // Retention KPIs
  DAY_7_RETENTION: {
    name: "Day 7 Retention",
    target: 60,
    unit: "%",
    frequency: "daily",
  },
  DAY_30_RETENTION: {
    name: "Day 30 Retention",
    target: 40,
    unit: "%",
    frequency: "daily",
  },
  CHURN_RATE: {
    name: "Churn Rate",
    target: 5,
    unit: "%",
    frequency: "monthly",
  },

  // Acquisition KPIs
  COST_PER_ACQUISITION: {
    name: "Cost Per Acquisition",
    target: 5,
    unit: "$",
    frequency: "daily",
  },
  CUSTOMER_LIFETIME_VALUE: {
    name: "Customer Lifetime Value",
    target: 300,
    unit: "$",
    frequency: "monthly",
  },
  LTV_CAC_RATIO: {
    name: "LTV:CAC Ratio",
    target: 3,
    unit: "ratio",
    frequency: "monthly",
  },
};

/**
 * Alerts to configure
 */
export const ALERTS = [
  {
    name: "High Error Rate",
    condition: "error_rate > 5%",
    severity: "critical",
    action: "notify_team",
  },
  {
    name: "Low Conversion Rate",
    condition: "conversion_rate < 10%",
    severity: "high",
    action: "notify_marketing",
  },
  {
    name: "High Churn Rate",
    condition: "churn_rate > 10%",
    severity: "high",
    action: "notify_product",
  },
  {
    name: "Payment Processing Failure",
    condition: "payment_failure_rate > 2%",
    severity: "critical",
    action: "notify_finance",
  },
  {
    name: "Server Down",
    condition: "uptime < 99%",
    severity: "critical",
    action: "notify_devops",
  },
];

/**
 * Reports to generate
 */
export const REPORTS = [
  {
    name: "Daily Summary",
    frequency: "daily",
    recipients: ["team@afrimatch.app"],
    metrics: [
      "daily_active_users",
      "new_signups",
      "revenue",
      "error_rate",
    ],
  },
  {
    name: "Weekly Performance",
    frequency: "weekly",
    recipients: ["leadership@afrimatch.app"],
    metrics: [
      "weekly_active_users",
      "new_signups",
      "revenue",
      "retention_rate",
      "churn_rate",
    ],
  },
  {
    name: "Monthly Executive Report",
    frequency: "monthly",
    recipients: ["ceo@afrimatch.app", "board@afrimatch.app"],
    metrics: [
      "monthly_active_users",
      "new_signups",
      "revenue",
      "mrr",
      "arr",
      "retention_rate",
      "churn_rate",
      "ltv",
      "cac",
    ],
  },
];

/**
 * Analytics initialization
 */
export function initializeAnalytics() {
  return {
    ga4: GA4_CONFIG,
    mixpanel: MIXPANEL_CONFIG,
    amplitude: AMPLITUDE_CONFIG,
    events: ANALYTICS_EVENTS,
    userProperties: USER_PROPERTIES,
    funnels: CONVERSION_FUNNELS,
    dashboards: DASHBOARDS,
    kpis: KPIs,
    alerts: ALERTS,
    reports: REPORTS,
  };
}

/**
 * Track event helper
 */
export function trackEvent(
  eventName: string,
  properties?: Record<string, any>
) {
  if (typeof window === "undefined") return;

  // Google Analytics
  if ((window as any).gtag) {
    (window as any).gtag("event", eventName, properties);
  }

  // Mixpanel
  if ((window as any).mixpanel) {
    (window as any).mixpanel.track(eventName, properties);
  }

  // Amplitude
  if ((window as any).amplitude) {
    (window as any).amplitude.track(eventName, properties);
  }
}

/**
 * Set user properties helper
 */
export function setUserProperties(properties: Record<string, any>) {
  if (typeof window === "undefined") return;

  // Google Analytics
  if ((window as any).gtag) {
    (window as any).gtag("set", properties);
  }

  // Mixpanel
  if ((window as any).mixpanel) {
    (window as any).mixpanel.people.set(properties);
  }

  // Amplitude
  if ((window as any).amplitude) {
    (window as any).amplitude.setUserProperties(properties);
  }
}
