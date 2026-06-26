/**
 * A/B Testing Framework
 * Implements comprehensive A/B testing for landing pages, CTAs, and features
 */

export interface Experiment {
  id: string;
  name: string;
  description: string;
  objective: string;
  hypothesis: string;
  startDate: string;
  endDate?: string;
  status: "planning" | "running" | "completed" | "paused";
  variants: Variant[];
  trafficAllocation: Record<string, number>; // variant_id: percentage
  minimumSampleSize: number;
  confidenceLevel: number; // 0.90, 0.95, 0.99
  statisticalSignificance?: number;
  results?: ExperimentResults;
}

export interface Variant {
  id: string;
  name: string;
  description: string;
  type: "control" | "treatment";
  changes: Record<string, any>; // CSS, copy, layout changes
  conversionRate?: number;
  sampleSize?: number;
  conversions?: number;
}

export interface ExperimentResults {
  winner?: string;
  winnerConfidence?: number;
  controlConversionRate: number;
  treatmentConversionRate: number;
  lifts: Record<string, number>; // variant_id: lift percentage
  statisticalSignificance: number;
  pValue: number;
  duration: number; // days
  totalParticipants: number;
  totalConversions: number;
}

/**
 * A/B test experiments
 */
export const experiments: Experiment[] = [
  {
    id: "exp_001",
    name: "Landing Page CTA Button Color",
    description: "Test different CTA button colors for signup conversion",
    objective: "Increase signup conversion rate by 10%",
    hypothesis: "Green CTA button will have higher conversion than blue",
    startDate: new Date().toISOString(),
    status: "planning",
    variants: [
      {
        id: "var_001_control",
        name: "Control - Blue Button",
        description: "Original blue CTA button",
        type: "control",
        changes: {
          buttonColor: "#0066cc",
          buttonText: "Sign Up Free",
        },
      },
      {
        id: "var_001_green",
        name: "Treatment - Green Button",
        description: "Green CTA button",
        type: "treatment",
        changes: {
          buttonColor: "#22c55e",
          buttonText: "Sign Up Free",
        },
      },
      {
        id: "var_001_orange",
        name: "Treatment - Orange Button",
        description: "Orange CTA button",
        type: "treatment",
        changes: {
          buttonColor: "#f97316",
          buttonText: "Get Started",
        },
      },
    ],
    trafficAllocation: {
      var_001_control: 0.33,
      var_001_green: 0.33,
      var_001_orange: 0.34,
    },
    minimumSampleSize: 1000,
    confidenceLevel: 0.95,
  },
  {
    id: "exp_002",
    name: "Signup Form Length",
    description: "Test 2-step vs 3-step signup form",
    objective: "Reduce signup abandonment rate",
    hypothesis: "2-step form will have higher completion rate than 3-step",
    startDate: new Date().toISOString(),
    status: "planning",
    variants: [
      {
        id: "var_002_control",
        name: "Control - 3-Step Form",
        description: "Original 3-step signup form",
        type: "control",
        changes: {
          formSteps: 3,
          fieldsPerStep: [3, 3, 2],
        },
      },
      {
        id: "var_002_2step",
        name: "Treatment - 2-Step Form",
        description: "Simplified 2-step signup form",
        type: "treatment",
        changes: {
          formSteps: 2,
          fieldsPerStep: [4, 4],
        },
      },
    ],
    trafficAllocation: {
      var_002_control: 0.5,
      var_002_2step: 0.5,
    },
    minimumSampleSize: 500,
    confidenceLevel: 0.95,
  },
  {
    id: "exp_003",
    name: "Pricing Page Copy",
    description: "Test different pricing page headlines",
    objective: "Increase subscription conversion rate",
    hypothesis: "Value-focused headline will outperform feature-focused",
    startDate: new Date().toISOString(),
    status: "planning",
    variants: [
      {
        id: "var_003_control",
        name: "Control - Feature-Focused",
        description: "Original feature-focused headline",
        type: "control",
        changes: {
          headline: "Unlock Premium Features",
          subheadline: "Access all features and connect with more people",
        },
      },
      {
        id: "var_003_value",
        name: "Treatment - Value-Focused",
        description: "Value-focused headline",
        type: "treatment",
        changes: {
          headline: "Find Your Perfect Match Faster",
          subheadline: "Premium members get 3x more matches and messages",
        },
      },
      {
        id: "var_003_urgency",
        name: "Treatment - Urgency-Focused",
        description: "Urgency-focused headline",
        type: "treatment",
        changes: {
          headline: "Limited Time: 50% Off Premium",
          subheadline: "Join 100K+ premium members finding love today",
        },
      },
    ],
    trafficAllocation: {
      var_003_control: 0.33,
      var_003_value: 0.33,
      var_003_urgency: 0.34,
    },
    minimumSampleSize: 1000,
    confidenceLevel: 0.95,
  },
];

/**
 * A/B testing calculator
 */
export class ABTestingCalculator {
  /**
   * Calculate required sample size
   */
  calculateSampleSize(
    baselineConversionRate: number,
    minDetectableEffect: number,
    confidenceLevel: number = 0.95,
    statisticalPower: number = 0.8
  ): number {
    // Using simplified formula
    const zAlpha = this.getZScore(confidenceLevel);
    const zBeta = this.getZScore(statisticalPower);

    const p1 = baselineConversionRate;
    const p2 = baselineConversionRate + minDetectableEffect;

    const pooledP = (p1 + p2) / 2;
    const variance = pooledP * (1 - pooledP) * 2;

    const sampleSize = Math.pow(zAlpha + zBeta, 2) * variance / Math.pow(p2 - p1, 2);

    return Math.ceil(sampleSize);
  }

  /**
   * Get Z-score for confidence level
   */
  private getZScore(confidenceLevel: number): number {
    const scores: Record<number, number> = {
      0.9: 1.645,
      0.95: 1.96,
      0.99: 2.576,
    };
    return scores[confidenceLevel] || 1.96;
  }

  /**
   * Calculate conversion rate
   */
  calculateConversionRate(conversions: number, visitors: number): number {
    return (conversions / visitors) * 100;
  }

  /**
   * Calculate lift
   */
  calculateLift(controlRate: number, treatmentRate: number): number {
    return ((treatmentRate - controlRate) / controlRate) * 100;
  }

  /**
   * Calculate statistical significance (Chi-square test)
   */
  calculateStatisticalSignificance(
    controlConversions: number,
    controlVisitors: number,
    treatmentConversions: number,
    treatmentVisitors: number
  ): {
    pValue: number;
    isSignificant: boolean;
    confidence: number;
  } {
    const controlRate = controlConversions / controlVisitors;
    const treatmentRate = treatmentConversions / treatmentVisitors;

    const pooledRate =
      (controlConversions + treatmentConversions) /
      (controlVisitors + treatmentVisitors);

    const standardError = Math.sqrt(
      pooledRate * (1 - pooledRate) * (1 / controlVisitors + 1 / treatmentVisitors)
    );

    const zScore = (treatmentRate - controlRate) / standardError;
    const pValue = this.normalCDF(-Math.abs(zScore)) * 2;

    return {
      pValue,
      isSignificant: pValue < 0.05,
      confidence: (1 - pValue) * 100,
    };
  }

  /**
   * Normal CDF approximation
   */
  private normalCDF(z: number): number {
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const sign = z < 0 ? -1 : 1;
    z = Math.abs(z) / Math.sqrt(2);

    const t = 1.0 / (1.0 + p * z);
    const t2 = t * t;
    const t3 = t2 * t;
    const t4 = t3 * t;
    const t5 = t4 * t;

    const y =
      1.0 -
      (a5 * t5 + a4 * t4 + a3 * t3 + a2 * t2 + a1 * t) *
        Math.exp(-z * z);

    return 0.5 * (1.0 + sign * y);
  }

  /**
   * Determine winner
   */
  determineWinner(
    variants: Variant[],
    confidenceThreshold: number = 0.95
  ): {
    winner?: Variant;
    confidence?: number;
    recommendation: string;
  } {
    if (variants.length < 2) {
      return { recommendation: "Need at least 2 variants" };
    }

    const control = variants.find((v) => v.type === "control");
    if (!control) {
      return { recommendation: "No control variant found" };
    }

    let bestTreatment: Variant | null = null;
    let bestConfidence = 0;

    for (const variant of variants) {
      if (variant.type === "treatment" && variant.conversionRate && control.conversionRate) {
        const result = this.calculateStatisticalSignificance(
          control.conversions || 0,
          control.sampleSize || 0,
          variant.conversions || 0,
          variant.sampleSize || 0
        );

        if (result.confidence > confidenceThreshold && result.confidence > bestConfidence) {
          bestTreatment = variant;
          bestConfidence = result.confidence;
        }
      }
    }

    if (bestTreatment) {
      return {
        winner: bestTreatment,
        confidence: bestConfidence,
        recommendation: `${bestTreatment.name} is the winner with ${bestConfidence.toFixed(2)}% confidence`,
      };
    }

    return {
      recommendation: "No statistically significant winner yet. Continue testing.",
    };
  }
}

export const abTestingCalculator = new ABTestingCalculator();

/**
 * Experiment manager
 */
export class ExperimentManager {
  /**
   * Create new experiment
   */
  createExperiment(
    name: string,
    objective: string,
    hypothesis: string,
    variants: Variant[]
  ): Experiment {
    const trafficAllocation: Record<string, number> = {};
    const allocation = 1 / variants.length;

    variants.forEach((variant) => {
      trafficAllocation[variant.id] = allocation;
    });

    return {
      id: `exp_${Date.now()}`,
      name,
      description: "",
      objective,
      hypothesis,
      startDate: new Date().toISOString(),
      status: "planning",
      variants,
      trafficAllocation,
      minimumSampleSize: 1000,
      confidenceLevel: 0.95,
    };
  }

  /**
   * Start experiment
   */
  startExperiment(experiment: Experiment): void {
    experiment.status = "running";
    experiment.startDate = new Date().toISOString();
  }

  /**
   * Stop experiment
   */
  stopExperiment(experiment: Experiment): void {
    experiment.status = "completed";
    experiment.endDate = new Date().toISOString();
  }

  /**
   * Get variant for user
   */
  getVariantForUser(experiment: Experiment, userId: string): Variant {
    // Consistent hashing to ensure same user gets same variant
    const hash = this.hashCode(userId + experiment.id);
    const random = Math.abs(hash) % 100;

    let cumulative = 0;
    for (const variant of experiment.variants) {
      const allocation = (experiment.trafficAllocation[variant.id] || 0) * 100;
      cumulative += allocation;

      if (random < cumulative) {
        return variant;
      }
    }

    return experiment.variants[0];
  }

  /**
   * Simple hash function
   */
  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
  }

  /**
   * Get experiment results
   */
  getExperimentResults(experiment: Experiment): ExperimentResults | undefined {
    if (!experiment.results) return undefined;

    return experiment.results;
  }
}

export const experimentManager = new ExperimentManager();

/**
 * Landing page variants
 */
export const landingPageVariants = {
  HEADLINE_VARIANTS: [
    "Find Your Perfect Match on AfriMatch",
    "Connect with African Singles & Professionals",
    "Your Next Love Story Starts Here",
    "Join 100K+ Africans Finding Love & Success",
  ],
  CTA_TEXT_VARIANTS: [
    "Sign Up Free",
    "Get Started",
    "Join Now",
    "Find Your Match",
  ],
  SUBHEADLINE_VARIANTS: [
    "Dating and professional networking for Africa",
    "The #1 dating app for African singles",
    "Connect, match, and grow together",
    "Find love and opportunity in one app",
  ],
};
