/**
 * AfriMatch Unified Subscription Plans
 * Single source of truth for all plan definitions.
 * Both Stripe and Flutterwave use these same plan IDs and pricing.
 */

export type BillingCycle = "monthly" | "yearly";
export type PlanMode = "dating" | "professional";
export type PaymentProvider = "stripe" | "flutterwave";

export interface Plan {
  id: string;
  name: string;
  mode: PlanMode;
  billingCycle: BillingCycle;
  /** Price in USD */
  priceUSD: number;
  /** Price in NGN (Naira) for Flutterwave */
  priceNGN: number;
  /** Price in KES (Kenyan Shilling) for Flutterwave */
  priceKES: number;
  /** Price in GHS (Ghanaian Cedi) for Flutterwave */
  priceGHS: number;
  /** Price in ZAR (South African Rand) for Flutterwave */
  priceZAR: number;
  /** Stripe amount in cents */
  stripeAmountCents: number;
  stripeInterval: "month" | "year";
  features: string[];
  popular?: boolean;
  description: string;
}

export const PLANS: Record<string, Plan> = {
  // ─── Dating Plans ──────────────────────────────────────────────────────────
  dating_premium_monthly: {
    id: "dating_premium_monthly",
    name: "Dating Premium",
    mode: "dating",
    billingCycle: "monthly",
    priceUSD: 19.99,
    priceNGN: 29985,
    priceKES: 2599,
    priceGHS: 299,
    priceZAR: 369,
    stripeAmountCents: 1999,
    stripeInterval: "month",
    description: "Unlimited likes, see who liked you, advanced filters, boost 1×/week",
    features: [
      "Unlimited likes & matches",
      "See who liked you",
      "Advanced search filters",
      "1 weekly profile boost",
      "Read receipts",
      "Priority support",
    ],
  },
  dating_gold_monthly: {
    id: "dating_gold_monthly",
    name: "Dating Gold",
    mode: "dating",
    billingCycle: "monthly",
    priceUSD: 39.99,
    priceNGN: 59985,
    priceKES: 5199,
    priceGHS: 599,
    priceZAR: 739,
    stripeAmountCents: 3999,
    stripeInterval: "month",
    description: "Everything in Premium + unlimited boosts, incognito mode, passport",
    popular: true,
    features: [
      "Everything in Premium",
      "Unlimited profile boosts",
      "Incognito / invisible mode",
      "Passport — match globally",
      "Super likes (5/day)",
      "Dedicated account manager",
    ],
  },
  dating_premium_yearly: {
    id: "dating_premium_yearly",
    name: "Dating Premium (Annual)",
    mode: "dating",
    billingCycle: "yearly",
    priceUSD: 119.88,
    priceNGN: 179820,
    priceKES: 15588,
    priceGHS: 1794,
    priceZAR: 2214,
    stripeAmountCents: 11988,
    stripeInterval: "year",
    description: "Save 50% — $9.99/mo billed annually",
    features: [
      "Unlimited likes & matches",
      "See who liked you",
      "Advanced search filters",
      "1 weekly profile boost",
      "Read receipts",
      "Priority support",
    ],
  },
  dating_gold_yearly: {
    id: "dating_gold_yearly",
    name: "Dating Gold (Annual)",
    mode: "dating",
    billingCycle: "yearly",
    priceUSD: 239.88,
    priceNGN: 359820,
    priceKES: 31188,
    priceGHS: 3594,
    priceZAR: 4434,
    stripeAmountCents: 23988,
    stripeInterval: "year",
    description: "Save 50% — $19.99/mo billed annually",
    popular: true,
    features: [
      "Everything in Premium",
      "Unlimited profile boosts",
      "Incognito / invisible mode",
      "Passport — match globally",
      "Super likes (5/day)",
      "Dedicated account manager",
    ],
  },

  // ─── Professional Plans ────────────────────────────────────────────────────
  professional_career_monthly: {
    id: "professional_career_monthly",
    name: "Career",
    mode: "professional",
    billingCycle: "monthly",
    priceUSD: 24.99,
    priceNGN: 37485,
    priceKES: 3249,
    priceGHS: 374,
    priceZAR: 462,
    stripeAmountCents: 2499,
    stripeInterval: "month",
    description: "Unlimited applications, all courses, unlimited connections, InMail",
    features: [
      "Unlimited job applications",
      "Access to all courses",
      "Unlimited connections",
      "InMail messages (20/mo)",
      "Profile visibility boost",
      "Job match alerts",
    ],
  },
  professional_executive_monthly: {
    id: "professional_executive_monthly",
    name: "Executive",
    mode: "professional",
    billingCycle: "monthly",
    priceUSD: 59.99,
    priceNGN: 89985,
    priceKES: 7799,
    priceGHS: 899,
    priceZAR: 1109,
    stripeAmountCents: 5999,
    stripeInterval: "month",
    description: "Everything in Career + unlimited mentors, executive board, headhunter visibility",
    popular: true,
    features: [
      "Everything in Career",
      "Unlimited InMail",
      "Executive job board access",
      "Mentor matching (unlimited)",
      "Headhunter visibility",
      "Salary insights & benchmarks",
    ],
  },
  professional_career_yearly: {
    id: "professional_career_yearly",
    name: "Career (Annual)",
    mode: "professional",
    billingCycle: "yearly",
    priceUSD: 149.88,
    priceNGN: 224820,
    priceKES: 19488,
    priceGHS: 2244,
    priceZAR: 2772,
    stripeAmountCents: 14988,
    stripeInterval: "year",
    description: "Save 50% — $12.49/mo billed annually",
    features: [
      "Unlimited job applications",
      "Access to all courses",
      "Unlimited connections",
      "InMail messages (20/mo)",
      "Profile visibility boost",
      "Job match alerts",
    ],
  },
  professional_executive_yearly: {
    id: "professional_executive_yearly",
    name: "Executive (Annual)",
    mode: "professional",
    billingCycle: "yearly",
    priceUSD: 359.88,
    priceNGN: 539820,
    priceKES: 46788,
    priceGHS: 5394,
    priceZAR: 6654,
    stripeAmountCents: 35988,
    stripeInterval: "year",
    description: "Save 50% — $29.99/mo billed annually",
    popular: true,
    features: [
      "Everything in Career",
      "Unlimited InMail",
      "Executive job board access",
      "Mentor matching (unlimited)",
      "Headhunter visibility",
      "Salary insights & benchmarks",
    ],
  },
};

/** Get a plan by ID (throws if not found) */
export function getPlan(planId: string): Plan {
  const plan = PLANS[planId];
  if (!plan) throw new Error(`Unknown plan: ${planId}`);
  return plan;
}

/** Get all plans for a given mode and billing cycle */
export function getPlansForMode(mode: PlanMode, billingCycle: BillingCycle): Plan[] {
  return Object.values(PLANS).filter(
    (p) => p.mode === mode && p.billingCycle === billingCycle
  );
}

/** Determine if planB is an upgrade from planA */
export function isUpgrade(fromPlanId: string, toPlanId: string): boolean {
  const from = PLANS[fromPlanId];
  const to = PLANS[toPlanId];
  if (!from || !to) return false;
  return to.priceUSD > from.priceUSD;
}
