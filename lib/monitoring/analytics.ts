import { Analytics } from "@vercel/analytics/react";

/**
 * Analytics tracking for AfriMatch
 */

export interface TrackingEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp?: Date;
}

export class AnalyticsTracker {
  /**
   * Track user signup
   */
  static trackSignup(mode: "dating" | "professional" | "both") {
    this.track({
      name: "user_signup",
      properties: {
        mode,
        timestamp: new Date(),
      },
    });
  }

  /**
   * Track subscription purchase
   */
  static trackSubscription(plan: string, amount: number, currency: string) {
    this.track({
      name: "subscription_purchase",
      properties: {
        plan,
        amount,
        currency,
        timestamp: new Date(),
      },
    });
  }

  /**
   * Track profile completion
   */
  static trackProfileCompletion(mode: "dating" | "professional") {
    this.track({
      name: "profile_completed",
      properties: {
        mode,
        timestamp: new Date(),
      },
    });
  }

  /**
   * Track message sent
   */
  static trackMessageSent(mode: "dating" | "professional") {
    this.track({
      name: "message_sent",
      properties: {
        mode,
        timestamp: new Date(),
      },
    });
  }

  /**
   * Track match created
   */
  static trackMatch(mode: "dating" | "professional") {
    this.track({
      name: "match_created",
      properties: {
        mode,
        timestamp: new Date(),
      },
    });
  }

  /**
   * Track page view
   */
  static trackPageView(page: string) {
    this.track({
      name: "page_view",
      properties: {
        page,
        timestamp: new Date(),
      },
    });
  }

  /**
   * Track feature usage
   */
  static trackFeatureUsage(feature: string, metadata?: Record<string, any>) {
    this.track({
      name: "feature_used",
      properties: {
        feature,
        ...metadata,
        timestamp: new Date(),
      },
    });
  }

  /**
   * Track error
   */
  static trackError(error: Error, context?: Record<string, any>) {
    this.track({
      name: "error_occurred",
      properties: {
        message: error.message,
        stack: error.stack,
        ...context,
        timestamp: new Date(),
      },
    });
  }

  /**
   * Generic tracking method
   */
  private static track(event: TrackingEvent) {
    try {
      // Send to analytics service
      if (typeof window !== "undefined") {
        // Client-side tracking
        if ((window as any).gtag) {
          (window as any).gtag("event", event.name, event.properties);
        }

        // Send to custom analytics endpoint
        fetch("/api/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(event),
        }).catch(console.error);
      }
    } catch (error) {
      console.error("Analytics tracking error:", error);
    }
  }
}

// Export for use in components
export default AnalyticsTracker;
