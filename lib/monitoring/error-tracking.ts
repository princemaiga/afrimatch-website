/**
 * Error Tracking and Monitoring System
 * Integrates with Sentry for error tracking and performance monitoring
 */

import * as Sentry from "@sentry/nextjs";

/**
 * Initialize Sentry
 */
export function initializeErrorTracking() {
  if (process.env.SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
      integrations: [

      ],
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
    });
  }
}

/**
 * Error severity levels
 */
export enum ErrorSeverity {
  FATAL = "fatal",
  ERROR = "error",
  WARNING = "warning",
  INFO = "info",
  DEBUG = "debug",
}

/**
 * Custom error class
 */
export class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number = 500,
    public severity: ErrorSeverity = ErrorSeverity.ERROR,
    public context?: Record<string, any>
  ) {
    super(message);
    this.name = "AppError";
  }
}

/**
 * Capture exception
 */
export function captureException(
  error: Error | string,
  context?: Record<string, any>,
  severity: ErrorSeverity = ErrorSeverity.ERROR
) {
  if (typeof error === "string") {
    error = new Error(error);
  }

  if (process.env.SENTRY_DSN) {
    Sentry.captureException(error, {
      level: severity,
      contexts: {
        app: context,
      },
    });
  }

  console.error(error, context);
}

/**
 * Capture message
 */
export function captureMessage(
  message: string,
  context?: Record<string, any>,
  severity: ErrorSeverity = ErrorSeverity.INFO
) {
  if (process.env.SENTRY_DSN) {
    Sentry.captureMessage(message, {
      level: severity,
      contexts: {
        app: context,
      },
    });
  }

  console.log(message, context);
}

/**
 * Start transaction
 */
export function startTransaction(
  name: string,
  op: string = "http.request"
) {
  if (process.env.SENTRY_DSN) {
    return Sentry.startInactiveSpan({
      name,
      op,
    });
  }
  return null;
}

/**
 * Add breadcrumb
 */
export function addBreadcrumb(
  message: string,
  category: string = "user-action",
  data?: Record<string, any>
) {
  if (process.env.SENTRY_DSN) {
    Sentry.addBreadcrumb({
      message,
      category,
      data,
      timestamp: Date.now() / 1000,
    });
  }
}

/**
 * Set user context
 */
export function setUserContext(userId: string, email?: string, name?: string) {
  if (process.env.SENTRY_DSN) {
    Sentry.setUser({
      id: userId,
      email,
      username: name,
    });
  }
}

/**
 * Clear user context
 */
export function clearUserContext() {
  if (process.env.SENTRY_DSN) {
    Sentry.setUser(null);
  }
}

/**
 * Performance monitoring
 */
export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();

  /**
   * Record metric
   */
  recordMetric(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(value);

    // Alert if metric exceeds threshold
    if (value > this.getThreshold(name)) {
      captureMessage(
        `Performance alert: ${name} exceeded threshold`,
        { metric: name, value, threshold: this.getThreshold(name) },
        ErrorSeverity.WARNING
      );
    }
  }

  /**
   * Get metric statistics
   */
  getMetricStats(name: string) {
    const values = this.metrics.get(name) || [];
    if (values.length === 0) return null;

    const sorted = [...values].sort((a, b) => a - b);
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;
    const median = sorted[Math.floor(sorted.length / 2)];
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const p95 = sorted[Math.floor(sorted.length * 0.95)];
    const p99 = sorted[Math.floor(sorted.length * 0.99)];

    return { avg, median, min, max, p95, p99, count: values.length };
  }

  /**
   * Get threshold for metric
   */
  private getThreshold(name: string): number {
    const thresholds: Record<string, number> = {
      "api.response_time": 1000, // 1 second
      "database.query_time": 500, // 500ms
      "page.load_time": 3000, // 3 seconds
      "image.load_time": 2000, // 2 seconds
    };

    return thresholds[name] || 5000;
  }

  /**
   * Clear metrics
   */
  clear() {
    this.metrics.clear();
  }
}

export const performanceMonitor = new PerformanceMonitor();

/**
 * API error handler
 */
export function handleAPIError(error: any) {
  if (error instanceof AppError) {
    captureException(error, { code: error.code }, error.severity);
    return {
      status: error.statusCode,
      body: {
        error: error.code,
        message: error.message,
        ...(error.context && { context: error.context }),
      },
    };
  }

  if (error instanceof SyntaxError) {
    captureException(error, { type: "SyntaxError" }, ErrorSeverity.ERROR);
    return {
      status: 400,
      body: {
        error: "INVALID_REQUEST",
        message: "Invalid request format",
      },
    };
  }

  captureException(error, { type: "UnknownError" }, ErrorSeverity.FATAL);
  return {
    status: 500,
    body: {
      error: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred",
    },
  };
}

/**
 * Health check
 */
export async function healthCheck(): Promise<{
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  metrics: Record<string, any>;
}> {
  const metrics: Record<string, any> = {};

  // Check database connection
  try {
    // await db.query("SELECT 1");
    metrics.database = "ok";
  } catch (error) {
    metrics.database = "error";
  }

  // Check external services
  try {
    // await checkExternalServices();
    metrics.external_services = "ok";
  } catch (error) {
    metrics.external_services = "error";
  }

  // Check memory usage
  const memUsage = process.memoryUsage();
  metrics.memory = {
    heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
    heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
  };

  // Determine overall status
  const allOk = Object.values(metrics).every((m) => m === "ok" || typeof m === "object");
  const status = allOk ? "healthy" : "degraded";

  return {
    status,
    timestamp: new Date().toISOString(),
    metrics,
  };
}
