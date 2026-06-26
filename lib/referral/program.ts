/**
 * Referral & Affiliate Program System
 * Manages user referrals and affiliate partnerships
 */

export interface ReferralProgram {
  id: string;
  referrerId: string;
  referredUserId: string;
  referralCode: string;
  status: "pending" | "completed" | "expired";
  reward: {
    type: "credit" | "discount" | "premium_days";
    amount: number;
    currency: string;
  };
  referrerReward: {
    type: "credit" | "discount" | "premium_days";
    amount: number;
    currency: string;
  };
  createdAt: string;
  completedAt?: string;
  expiresAt: string;
}

export interface AffiliatePartner {
  id: string;
  name: string;
  email: string;
  website?: string;
  affiliateCode: string;
  commissionRate: number; // percentage
  status: "active" | "inactive" | "suspended";
  totalReferrals: number;
  totalEarnings: number;
  currency: string;
  createdAt: string;
  lastPayoutDate?: string;
}

export interface ReferralStats {
  totalReferrals: number;
  completedReferrals: number;
  pendingReferrals: number;
  expiredReferrals: number;
  totalRewardsEarned: number;
  totalRewardsClaimed: number;
  conversionRate: number;
}

/**
 * Generate unique referral code
 */
export function generateReferralCode(userId: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${userId.substring(0, 3)}${timestamp}${random}`.toUpperCase();
}

/**
 * Generate affiliate code
 */
export function generateAffiliateCode(partnerName: string): string {
  const sanitized = partnerName
    .replace(/[^a-zA-Z0-9]/g, "")
    .substring(0, 10)
    .toUpperCase();
  const random = Math.random().toString(36).substring(2, 5);
  return `AFF${sanitized}${random}`;
}

/**
 * Validate referral code
 */
export function validateReferralCode(code: string): boolean {
  // Code should be 15-20 characters
  // Format: 3 chars (user ID) + 13 chars (timestamp + random)
  return /^[A-Z0-9]{15,20}$/.test(code);
}

/**
 * Calculate referral rewards
 */
export function calculateReferralRewards(
  planType: "basic" | "premium",
  billingCycle: "monthly" | "annual"
): {
  referrerReward: number;
  referredReward: number;
} {
  const rewards: Record<string, Record<string, Record<string, number>>> = {
    basic: {
      monthly: { referrer: 5, referred: 5 },
      annual: { referrer: 30, referred: 30 },
    },
    premium: {
      monthly: { referrer: 10, referred: 10 },
      annual: { referrer: 60, referred: 60 },
    },
  };

  return {
    referrerReward: rewards[planType][billingCycle].referrer,
    referredReward: rewards[planType][billingCycle].referred,
  };
}

/**
 * Create referral link
 */
export function createReferralLink(
  referralCode: string,
  baseUrl: string = "https://afrimatch.app"
): string {
  return `${baseUrl}?ref=${referralCode}`;
}

/**
 * Validate referral eligibility
 */
export function validateReferralEligibility(
  referrerId: string,
  referredUserId: string
): {
  isValid: boolean;
  reason?: string;
} {
  // Cannot refer yourself
  if (referrerId === referredUserId) {
    return { isValid: false, reason: "Cannot refer yourself" };
  }

  // Referred user must be new (not previously referred)
  // This would be checked in the database

  return { isValid: true };
}

/**
 * Referral tier system for increased rewards
 */
export class ReferralTierSystem {
  private tiers = [
    { name: "Bronze", minReferrals: 0, bonusMultiplier: 1.0 },
    { name: "Silver", minReferrals: 5, bonusMultiplier: 1.25 },
    { name: "Gold", minReferrals: 10, bonusMultiplier: 1.5 },
    { name: "Platinum", minReferrals: 25, bonusMultiplier: 2.0 },
    { name: "Diamond", minReferrals: 50, bonusMultiplier: 2.5 },
  ];

  /**
   * Get user's current tier
   */
  getUserTier(totalReferrals: number): string {
    for (let i = this.tiers.length - 1; i >= 0; i--) {
      if (totalReferrals >= this.tiers[i].minReferrals) {
        return this.tiers[i].name;
      }
    }
    return this.tiers[0].name;
  }

  /**
   * Get bonus multiplier for tier
   */
  getBonusMultiplier(totalReferrals: number): number {
    for (let i = this.tiers.length - 1; i >= 0; i--) {
      if (totalReferrals >= this.tiers[i].minReferrals) {
        return this.tiers[i].bonusMultiplier;
      }
    }
    return 1.0;
  }

  /**
   * Get next tier info
   */
  getNextTier(totalReferrals: number): {
    name: string;
    referralsNeeded: number;
    bonusMultiplier: number;
  } | null {
    for (const tier of this.tiers) {
      if (totalReferrals < tier.minReferrals) {
        return {
          name: tier.name,
          referralsNeeded: tier.minReferrals - totalReferrals,
          bonusMultiplier: tier.bonusMultiplier,
        };
      }
    }
    return null;
  }

  /**
   * Get all tiers
   */
  getAllTiers() {
    return this.tiers;
  }
}

export const referralTierSystem = new ReferralTierSystem();

/**
 * Affiliate commission calculator
 */
export class AffiliateCommissionCalculator {
  /**
   * Calculate commission for affiliate
   */
  calculateCommission(
    revenue: number,
    commissionRate: number,
    tier: string
  ): number {
    const baseCommission = (revenue * commissionRate) / 100;

    // Apply tier bonuses
    const tierBonuses: Record<string, number> = {
      bronze: 1.0,
      silver: 1.1,
      gold: 1.25,
      platinum: 1.5,
      elite: 2.0,
    };

    const bonus = tierBonuses[tier.toLowerCase()] || 1.0;
    return baseCommission * bonus;
  }

  /**
   * Calculate payout
   */
  calculatePayout(
    totalEarnings: number,
    minimumPayout: number = 50
  ): {
    payoutAmount: number;
    isEligible: boolean;
    reason?: string;
  } {
    if (totalEarnings < minimumPayout) {
      return {
        payoutAmount: 0,
        isEligible: false,
        reason: `Minimum payout is $${minimumPayout}. Current earnings: $${totalEarnings}`,
      };
    }

    return {
      payoutAmount: totalEarnings,
      isEligible: true,
    };
  }

  /**
   * Get payout schedule
   */
  getPayoutSchedule(): {
    frequency: string;
    nextPayoutDate: string;
    minimumAmount: number;
  } {
    return {
      frequency: "Monthly",
      nextPayoutDate: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
      minimumAmount: 50,
    };
  }
}

export const affiliateCommissionCalculator = new AffiliateCommissionCalculator();

/**
 * Referral tracking and analytics
 */
export class ReferralAnalytics {
  /**
   * Calculate conversion rate
   */
  calculateConversionRate(
    completedReferrals: number,
    totalReferrals: number
  ): number {
    if (totalReferrals === 0) return 0;
    return (completedReferrals / totalReferrals) * 100;
  }

  /**
   * Calculate average reward per referral
   */
  calculateAverageReward(
    totalRewards: number,
    totalReferrals: number
  ): number {
    if (totalReferrals === 0) return 0;
    return totalRewards / totalReferrals;
  }

  /**
   * Get referral performance metrics
   */
  getPerformanceMetrics(stats: ReferralStats): {
    conversionRate: number;
    averageReward: number;
    pendingValue: number;
    claimedValue: number;
  } {
    return {
      conversionRate: this.calculateConversionRate(
        stats.completedReferrals,
        stats.totalReferrals
      ),
      averageReward: this.calculateAverageReward(
        stats.totalRewardsEarned,
        stats.totalReferrals
      ),
      pendingValue: stats.totalRewardsEarned - stats.totalRewardsClaimed,
      claimedValue: stats.totalRewardsClaimed,
    };
  }

  /**
   * Get top referrers
   */
  getTopReferrers(referrals: ReferralProgram[], limit: number = 10): {
    referrerId: string;
    totalReferrals: number;
    totalRewards: number;
  }[] {
    const grouped = referrals.reduce(
      (acc, ref) => {
        if (!acc[ref.referrerId]) {
          acc[ref.referrerId] = {
            referrerId: ref.referrerId,
            totalReferrals: 0,
            totalRewards: 0,
          };
        }
        acc[ref.referrerId].totalReferrals++;
        if (ref.status === "completed") {
          acc[ref.referrerId].totalRewards += ref.referrerReward.amount;
        }
        return acc;
      },
      {} as Record<
        string,
        { referrerId: string; totalReferrals: number; totalRewards: number }
      >
    );

    return Object.values(grouped)
      .sort((a, b) => b.totalRewards - a.totalRewards)
      .slice(0, limit);
  }
}

export const referralAnalytics = new ReferralAnalytics();

/**
 * Referral program configuration
 */
export const referralProgramConfig = {
  enabled: true,
  maxReferralsPerUser: 100,
  referralExpirationDays: 30,
  minimumAffiliateEarnings: 50,
  payoutFrequency: "monthly",
  supportedCountries: [
    "NG",
    "KE",
    "GH",
    "ZA",
    "UG",
    "TZ",
    "ET",
    "RW",
    "CM",
    "SN",
  ],
  rewards: {
    dating: {
      basic: { referrer: 5, referred: 5 },
      premium: { referrer: 10, referred: 10 },
    },
    professional: {
      basic: { referrer: 10, referred: 10 },
      premium: { referrer: 20, referred: 20 },
    },
  },
  affiliateCommissionRates: {
    bronze: 10,
    silver: 12,
    gold: 15,
    platinum: 20,
    elite: 25,
  },
};
