/**
 * Payment Schema Additions
 *
 * These additions extend the existing schema.ts with payment-specific tables.
 * Import and re-export from schema.ts after adding the new tables.
 *
 * New tables:
 *   - promoCodes
 *   - paymentRetries
 *
 * New columns added to subscriptions (via migration):
 *   - paymentProvider (stripe | flutterwave)
 *   - manualProviderOverride (boolean)
 *   - promoCodeId (uuid FK -> promoCodes)
 *   - discountPercent (decimal)
 *   - failedPaymentCount (integer)
 *   - lastFailedAt (timestamp)
 *   - nextRetryAt (timestamp)
 *   - flutterwaveCustomerId (varchar)
 *   - flutterwavePlanId (varchar)
 *   - stripePriceId (varchar)
 */

import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
  integer,
  decimal,
  text,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { subscriptions } from "../db/schema";

// ─── Promo Codes ──────────────────────────────────────────────────────────────
export const promoCodes = pgTable(
  "promo_codes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    code: varchar("code", { length: 50 }).notNull().unique(),
    description: text("description"),
    discountPercent: decimal("discount_percent", { precision: 5, scale: 2 }).notNull(),
    /** null = works for all plans */
    applicablePlanIds: text("applicable_plan_ids"), // JSON array of plan IDs
    /** null = unlimited uses */
    maxUses: integer("max_uses"),
    usedCount: integer("used_count").default(0).notNull(),
    /** null = never expires */
    expiresAt: timestamp("expires_at"),
    active: boolean("active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    codeIdx: index("promo_codes_code_idx").on(table.code),
    activeIdx: index("promo_codes_active_idx").on(table.active),
  })
);

// ─── Payment Retries ──────────────────────────────────────────────────────────
export const paymentRetries = pgTable(
  "payment_retries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    subscriptionId: uuid("subscription_id")
      .notNull()
      .references(() => subscriptions.id, { onDelete: "cascade" }),
    provider: varchar("provider", { length: 20 }).notNull(), // stripe | flutterwave
    attemptNumber: integer("attempt_number").notNull(),
    status: varchar("status", { length: 20 }).notNull(), // pending | succeeded | failed
    errorMessage: text("error_message"),
    providerErrorCode: varchar("provider_error_code", { length: 100 }),
    scheduledAt: timestamp("scheduled_at").notNull(),
    executedAt: timestamp("executed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    subscriptionIdIdx: index("payment_retries_subscription_id_idx").on(table.subscriptionId),
    statusIdx: index("payment_retries_status_idx").on(table.status),
    scheduledAtIdx: index("payment_retries_scheduled_at_idx").on(table.scheduledAt),
  })
);

// ─── Relations ────────────────────────────────────────────────────────────────
export const paymentRetriesRelations = relations(paymentRetries, ({ one }) => ({
  subscription: one(subscriptions, {
    fields: [paymentRetries.subscriptionId],
    references: [subscriptions.id],
  }),
}));

export type PromoCode = typeof promoCodes.$inferSelect;
export type NewPromoCode = typeof promoCodes.$inferInsert;
export type PaymentRetry = typeof paymentRetries.$inferSelect;
export type NewPaymentRetry = typeof paymentRetries.$inferInsert;
