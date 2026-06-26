/**
 * Rate Limiting Middleware
 * Implements token bucket algorithm for API rate limiting
 */

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
  keyGenerator?: (req: any) => string; // Function to generate rate limit key
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

class RateLimiter {
  private store: RateLimitStore = {};
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
    // Cleanup old entries every minute
    setInterval(() => this.cleanup(), 60000);
  }

  /**
   * Generate rate limit key
   */
  private generateKey(req: any): string {
    if (this.config.keyGenerator) {
      return this.config.keyGenerator(req);
    }
    // Default: use IP address
    return (
      req.headers["x-forwarded-for"] ||
      req.headers["x-real-ip"] ||
      req.socket?.remoteAddress ||
      "unknown"
    );
  }

  /**
   * Check if request is allowed
   */
  isAllowed(req: any): boolean {
    const key = this.generateKey(req);
    const now = Date.now();

    if (!this.store[key]) {
      this.store[key] = {
        count: 1,
        resetTime: now + this.config.windowMs,
      };
      return true;
    }

    const record = this.store[key];

    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + this.config.windowMs;
      return true;
    }

    record.count++;
    return record.count <= this.config.maxRequests;
  }

  /**
   * Get remaining requests
   */
  getRemaining(req: any): number {
    const key = this.generateKey(req);
    const record = this.store[key];

    if (!record) {
      return this.config.maxRequests;
    }

    return Math.max(0, this.config.maxRequests - record.count);
  }

  /**
   * Get reset time
   */
  getResetTime(req: any): number {
    const key = this.generateKey(req);
    const record = this.store[key];

    if (!record) {
      return Date.now() + this.config.windowMs;
    }

    return record.resetTime;
  }

  /**
   * Cleanup old entries
   */
  private cleanup(): void {
    const now = Date.now();
    for (const key in this.store) {
      if (this.store[key].resetTime < now) {
        delete this.store[key];
      }
    }
  }

  /**
   * Reset for specific key
   */
  reset(req: any): void {
    const key = this.generateKey(req);
    delete this.store[key];
  }
}

// Create rate limiters for different endpoints
export const apiRateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100,
});

export const authRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 attempts per 15 minutes
});

export const searchRateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 30,
});

export const uploadRateLimiter = new RateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 10,
});

/**
 * Rate limit middleware for Next.js
 */
export function createRateLimitMiddleware(limiter: RateLimiter) {
  return (req: any) => {
    if (!limiter.isAllowed(req)) {
      return {
        status: 429,
        headers: {
          "Retry-After": Math.ceil(
            (limiter.getResetTime(req) - Date.now()) / 1000
          ),
          "X-RateLimit-Limit": "100",
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": limiter.getResetTime(req),
        },
        body: {
          error: "Too many requests",
          retryAfter: Math.ceil(
            (limiter.getResetTime(req) - Date.now()) / 1000
          ),
        },
      };
    }

    return {
      status: 200,
      headers: {
        "X-RateLimit-Limit": "100",
        "X-RateLimit-Remaining": limiter.getRemaining(req),
        "X-RateLimit-Reset": limiter.getResetTime(req),
      },
    };
  };
}

/**
 * DDoS Protection
 */
export class DDoSProtection {
  private suspiciousIPs: Map<string, number> = new Map();
  private blockedIPs: Set<string> = new Set();
  private threshold = 1000; // Requests per minute threshold
  private blockDuration = 60 * 60 * 1000; // 1 hour

  /**
   * Check if IP should be blocked
   */
  isBlocked(ip: string): boolean {
    if (this.blockedIPs.has(ip)) {
      return true;
    }

    const count = this.suspiciousIPs.get(ip) || 0;
    if (count > this.threshold) {
      this.blockIP(ip);
      return true;
    }

    return false;
  }

  /**
   * Record request from IP
   */
  recordRequest(ip: string): void {
    const count = (this.suspiciousIPs.get(ip) || 0) + 1;
    this.suspiciousIPs.set(ip, count);

    if (count > this.threshold) {
      this.blockIP(ip);
    }
  }

  /**
   * Block IP address
   */
  private blockIP(ip: string): void {
    this.blockedIPs.add(ip);
    setTimeout(() => {
      this.blockedIPs.delete(ip);
      this.suspiciousIPs.delete(ip);
    }, this.blockDuration);
  }

  /**
   * Cleanup
   */
  cleanup(): void {
    this.suspiciousIPs.clear();
  }
}

export const ddosProtection = new DDoSProtection();

// Cleanup every 5 minutes
setInterval(() => {
  ddosProtection.cleanup();
}, 5 * 60 * 1000);
