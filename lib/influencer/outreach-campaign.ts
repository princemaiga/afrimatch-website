/**
 * Influencer Outreach Campaign System
 * Manages influencer identification, outreach, and partnership tracking
 */

export interface Influencer {
  id: string;
  name: string;
  handle: string;
  platform: "twitter" | "tiktok" | "instagram" | "linkedin" | "youtube";
  followers: number;
  engagement_rate: number;
  niche: string[];
  bio: string;
  website?: string;
  email?: string;
  contact_info?: string;
  tier: "nano" | "micro" | "macro" | "mega";
  authority_score: number;
  relevance_score: number;
  contact_status: "not_contacted" | "contacted" | "interested" | "negotiating" | "partnered" | "rejected";
  last_contact_date?: string;
  response_rate?: number;
  estimated_reach: number;
  estimated_engagement: number;
}

export interface OutreachCampaign {
  id: string;
  name: string;
  objective: string;
  target_influencers: number;
  budget: number;
  currency: string;
  start_date: string;
  end_date: string;
  status: "planning" | "active" | "completed" | "paused";
  influencers: Influencer[];
  performance_metrics: {
    total_reach: number;
    total_engagement: number;
    conversion_rate: number;
    roi: number;
  };
}

export interface OutreachTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  platform: string;
  tone: "professional" | "casual" | "friendly";
}

/**
 * Influencer database for Africa
 */
export const africanInfluencers: Influencer[] = [
  // Nano Influencers (10K-50K followers)
  {
    id: "inf_001",
    name: "Amara Okonkwo",
    handle: "@amaratech",
    platform: "twitter",
    followers: 25000,
    engagement_rate: 8.5,
    niche: ["tech", "dating", "relationships"],
    bio: "Tech enthusiast and relationship coach from Lagos",
    email: "amara@example.com",
    tier: "nano",
    authority_score: 72,
    relevance_score: 85,
    contact_status: "not_contacted",
    estimated_reach: 25000,
    estimated_engagement: 2125,
  },
  {
    id: "inf_002",
    name: "Kwame Mensah",
    handle: "@kwamementor",
    platform: "instagram",
    followers: 35000,
    engagement_rate: 7.2,
    niche: ["professional development", "networking", "career"],
    bio: "Career coach helping African professionals grow",
    email: "kwame@example.com",
    tier: "nano",
    authority_score: 75,
    relevance_score: 88,
    contact_status: "not_contacted",
    estimated_reach: 35000,
    estimated_engagement: 2520,
  },
  {
    id: "inf_003",
    name: "Zainab Hassan",
    handle: "@zainabdating",
    platform: "tiktok",
    followers: 42000,
    engagement_rate: 12.3,
    niche: ["dating advice", "relationships", "lifestyle"],
    bio: "Dating coach creating viral relationship content",
    email: "zainab@example.com",
    tier: "nano",
    authority_score: 78,
    relevance_score: 92,
    contact_status: "not_contacted",
    estimated_reach: 42000,
    estimated_engagement: 5166,
  },

  // Micro Influencers (50K-500K followers)
  {
    id: "inf_004",
    name: "Chidi Nwosu",
    handle: "@chidiengineer",
    platform: "linkedin",
    followers: 125000,
    engagement_rate: 6.8,
    niche: ["tech", "entrepreneurship", "networking"],
    bio: "Software engineer and startup founder",
    email: "chidi@example.com",
    tier: "micro",
    authority_score: 82,
    relevance_score: 85,
    contact_status: "not_contacted",
    estimated_reach: 125000,
    estimated_engagement: 8500,
  },
  {
    id: "inf_005",
    name: "Fatima Abdullahi",
    handle: "@fatimalifestyle",
    platform: "instagram",
    followers: 185000,
    engagement_rate: 9.1,
    niche: ["lifestyle", "dating", "wellness"],
    bio: "Lifestyle influencer helping women find balance",
    email: "fatima@example.com",
    tier: "micro",
    authority_score: 80,
    relevance_score: 88,
    contact_status: "not_contacted",
    estimated_reach: 185000,
    estimated_engagement: 16835,
  },
  {
    id: "inf_006",
    name: "Tunde Oladele",
    handle: "@tundetalks",
    platform: "tiktok",
    followers: 275000,
    engagement_rate: 11.5,
    niche: ["comedy", "relationships", "dating"],
    bio: "Comedian making viral dating content",
    email: "tunde@example.com",
    tier: "micro",
    authority_score: 79,
    relevance_score: 90,
    contact_status: "not_contacted",
    estimated_reach: 275000,
    estimated_engagement: 31625,
  },

  // Macro Influencers (500K-2M followers)
  {
    id: "inf_007",
    name: "Ama Boateng",
    handle: "@amaboateng",
    platform: "instagram",
    followers: 850000,
    engagement_rate: 7.2,
    niche: ["lifestyle", "business", "empowerment"],
    bio: "Ghanaian entrepreneur empowering African women",
    email: "ama@example.com",
    tier: "macro",
    authority_score: 88,
    relevance_score: 82,
    contact_status: "not_contacted",
    estimated_reach: 850000,
    estimated_engagement: 61200,
  },
  {
    id: "inf_008",
    name: "Jamal Ahmed",
    handle: "@jamaltech",
    platform: "twitter",
    followers: 620000,
    engagement_rate: 5.8,
    niche: ["tech", "startups", "innovation"],
    bio: "Tech entrepreneur and investor from Kenya",
    email: "jamal@example.com",
    tier: "macro",
    authority_score: 85,
    relevance_score: 80,
    contact_status: "not_contacted",
    estimated_reach: 620000,
    estimated_engagement: 35960,
  },

  // Mega Influencers (2M+ followers)
  {
    id: "inf_009",
    name: "Bonang Matheba",
    handle: "@bonang_m",
    platform: "instagram",
    followers: 5200000,
    engagement_rate: 4.2,
    niche: ["entertainment", "lifestyle", "business"],
    bio: "South African media personality and entrepreneur",
    email: "bonang@example.com",
    tier: "mega",
    authority_score: 92,
    relevance_score: 75,
    contact_status: "not_contacted",
    estimated_reach: 5200000,
    estimated_engagement: 218400,
  },
];

/**
 * Influencer scoring system
 */
export class InfluencerScoringEngine {
  /**
   * Calculate influencer match score
   */
  calculateMatchScore(influencer: Influencer): number {
    const authorityWeight = 0.4;
    const relevanceWeight = 0.4;
    const engagementWeight = 0.2;

    const engagementScore = Math.min(
      100,
      (influencer.engagement_rate / 15) * 100
    );

    return (
      influencer.authority_score * authorityWeight +
      influencer.relevance_score * relevanceWeight +
      engagementScore * engagementWeight
    );
  }

  /**
   * Get influencer tier recommendations
   */
  getTierRecommendations(
    budget: number,
    targetReach: number
  ): {
    tier: string;
    count: number;
    costPerInfluencer: number;
    estimatedReach: number;
  }[] {
    return [
      {
        tier: "nano",
        count: Math.floor(budget / 500),
        costPerInfluencer: 500,
        estimatedReach: Math.floor(budget / 500) * 30000,
      },
      {
        tier: "micro",
        count: Math.floor(budget / 2000),
        costPerInfluencer: 2000,
        estimatedReach: Math.floor(budget / 2000) * 150000,
      },
      {
        tier: "macro",
        count: Math.floor(budget / 5000),
        costPerInfluencer: 5000,
        estimatedReach: Math.floor(budget / 5000) * 700000,
      },
      {
        tier: "mega",
        count: Math.floor(budget / 15000),
        costPerInfluencer: 15000,
        estimatedReach: Math.floor(budget / 15000) * 3000000,
      },
    ];
  }

  /**
   * Calculate ROI for influencer partnership
   */
  calculateROI(
    cost: number,
    reach: number,
    engagement: number,
    conversionRate: number,
    averageOrderValue: number
  ): {
    revenue: number;
    roi: number;
    paybackPeriod: string;
  } {
    const conversions = reach * (engagement / 100) * (conversionRate / 100);
    const revenue = conversions * averageOrderValue;
    const roi = ((revenue - cost) / cost) * 100;

    return {
      revenue,
      roi,
      paybackPeriod: roi > 0 ? "Profitable" : "Not profitable",
    };
  }
}

export const influencerScoringEngine = new InfluencerScoringEngine();

/**
 * Outreach template library
 */
export const outreachTemplates: OutreachTemplate[] = [
  {
    id: "template_1",
    name: "Initial Partnership Inquiry",
    subject: "Partnership Opportunity with AfriMatch 🌍",
    body: `Hi {{name}},

I've been following your amazing content on {{platform}} and love how you engage with your audience about {{niche}}.

AfriMatch is a rapidly growing dating and professional networking platform for Africa, and we think your audience would genuinely benefit from what we offer.

We'd love to explore a partnership with you! Here's what we're thinking:

✨ Benefits:
- Free premium subscription (worth ${"{{value}}"}/month)
- Commission on referrals ({"{{commission}}"}%)
- Featured profile on our platform
- Exclusive content opportunities

Would you be interested in a quick call to discuss this further?

Looking forward to hearing from you!

Best regards,
AfriMatch Partnership Team
partnerships@afrimatch.app`,
    platform: "email",
    tone: "professional",
  },
  {
    id: "template_2",
    name: "Casual Social Media Outreach",
    subject: "Love your content! 💕",
    body: `Hey {{name}}! 👋

Your recent post about {{topic}} was absolutely brilliant! We're building AfriMatch - a dating and networking platform for Africa - and we think you'd be perfect to help us reach more people.

No pressure, but we'd love to chat about a potential collab. Free premium + commission sounds good? 😉

DM us if you're interested!

#AfriMatch #Dating #Africa`,
    platform: "twitter",
    tone: "casual",
  },
  {
    id: "template_3",
    name: "LinkedIn Professional Outreach",
    subject: "Let's collaborate on something meaningful",
    body: `Hi {{name}},

I came across your profile and was impressed by your work in {{field}}. Your perspective on {{topic}} aligns perfectly with AfriMatch's mission to connect professionals across Africa.

We're launching a new initiative to help professionals build meaningful connections, and we'd love to have you involved.

Would you be open to a brief conversation about this?

Best regards,
AfriMatch Team`,
    platform: "linkedin",
    tone: "professional",
  },
];

/**
 * Campaign manager
 */
export class CampaignManager {
  /**
   * Create outreach campaign
   */
  createCampaign(
    name: string,
    objective: string,
    targetInfluencers: number,
    budget: number
  ): OutreachCampaign {
    return {
      id: `campaign_${Date.now()}`,
      name,
      objective,
      target_influencers: targetInfluencers,
      budget,
      currency: "USD",
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: "planning",
      influencers: [],
      performance_metrics: {
        total_reach: 0,
        total_engagement: 0,
        conversion_rate: 0,
        roi: 0,
      },
    };
  }

  /**
   * Select influencers for campaign
   */
  selectInfluencers(
    campaign: OutreachCampaign,
    availableInfluencers: Influencer[]
  ): Influencer[] {
    return availableInfluencers
      .map((inf) => ({
        ...inf,
        matchScore: influencerScoringEngine.calculateMatchScore(inf),
      }))
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, campaign.target_influencers)
      .map(({ matchScore, ...inf }) => inf);
  }

  /**
   * Calculate campaign metrics
   */
  calculateCampaignMetrics(campaign: OutreachCampaign): {
    total_reach: number;
    average_engagement: number;
    estimated_conversions: number;
    estimated_revenue: number;
  } {
    const total_reach = campaign.influencers.reduce(
      (sum, inf) => sum + inf.estimated_reach,
      0
    );
    const average_engagement =
      campaign.influencers.reduce((sum, inf) => sum + inf.engagement_rate, 0) /
      campaign.influencers.length;
    const estimated_conversions = total_reach * (average_engagement / 100) * 0.02; // 2% conversion
    const estimated_revenue = estimated_conversions * 50; // $50 average order value

    return {
      total_reach,
      average_engagement,
      estimated_conversions,
      estimated_revenue,
    };
  }

  /**
   * Generate outreach email
   */
  generateOutreachEmail(
    template: OutreachTemplate,
    influencer: Influencer,
    customData: Record<string, string>
  ): string {
    let email = template.body;

    // Replace template variables
    email = email.replace(/{{name}}/g, influencer.name);
    email = email.replace(/{{platform}}/g, influencer.platform);
    email = email.replace(/{{niche}}/g, influencer.niche.join(", "));

    // Replace custom variables
    Object.entries(customData).forEach(([key, value]) => {
      email = email.replace(new RegExp(`{{${key}}}`, "g"), value);
    });

    return email;
  }
}

export const campaignManager = new CampaignManager();

/**
 * Influencer performance tracking
 */
export class InfluencerPerformanceTracker {
  private partnerships: Map<string, any> = new Map();

  /**
   * Track partnership performance
   */
  trackPerformance(
    influencerId: string,
    metrics: {
      impressions: number;
      clicks: number;
      conversions: number;
      revenue: number;
    }
  ): void {
    const existing = this.partnerships.get(influencerId) || {
      totalImpressions: 0,
      totalClicks: 0,
      totalConversions: 0,
      totalRevenue: 0,
    };

    this.partnerships.set(influencerId, {
      totalImpressions: existing.totalImpressions + metrics.impressions,
      totalClicks: existing.totalClicks + metrics.clicks,
      totalConversions: existing.totalConversions + metrics.conversions,
      totalRevenue: existing.totalRevenue + metrics.revenue,
      lastUpdated: new Date().toISOString(),
    });
  }

  /**
   * Get influencer ROI
   */
  getInfluencerROI(influencerId: string, investmentAmount: number): number {
    const performance = this.partnerships.get(influencerId);
    if (!performance) return 0;

    return ((performance.totalRevenue - investmentAmount) / investmentAmount) * 100;
  }

  /**
   * Get top performing influencers
   */
  getTopPerformers(limit: number = 10): Array<{
    influencerId: string;
    revenue: number;
    roi: number;
  }> {
    return Array.from(this.partnerships.entries())
      .map(([id, perf]) => ({
        influencerId: id,
        revenue: perf.totalRevenue,
        roi: perf.totalRevenue > 0 ? (perf.totalRevenue / 1000) * 100 : 0,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, limit);
  }
}

export const performanceTracker = new InfluencerPerformanceTracker();
