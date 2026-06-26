import {
  pgTable,
  text,
  varchar,
  timestamp,
  boolean,
  integer,
  decimal,
  pgEnum,
  uuid,
  primaryKey,
  foreignKey,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const userModeEnum = pgEnum("user_mode", ["dating", "professional", "both"]);
export const currentModeEnum = pgEnum("current_mode", ["dating", "professional"]);
export const subscriptionStatusEnum = pgEnum("subscription_status", ["active", "cancelled", "expired", "pending"]);
export const messageTypeEnum = pgEnum("message_type", ["text", "image", "voice"]);
export const genderEnum = pgEnum("gender", ["male", "female", "other"]);
export const verificationStatusEnum = pgEnum("verification_status", ["pending", "verified", "rejected"]);
export const paymentProviderEnum = pgEnum("payment_provider_type", ["stripe", "flutterwave"]);

// Users table
export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    name: varchar("name", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 20 }),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    dateOfBirth: timestamp("date_of_birth").notNull(),
    country: varchar("country", { length: 2 }).notNull(),
    avatar: text("avatar"),
    bio: text("bio"),
    gender: genderEnum("gender"),
    emailVerified: boolean("email_verified").default(false),
    phoneVerified: boolean("phone_verified").default(false),
    status: varchar("status", { length: 20 }).default("active"), // active | suspended | banned
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: index("users_email_idx").on(table.email),
    phoneIdx: index("users_phone_idx").on(table.phone),
    countryIdx: index("users_country_idx").on(table.country),
  })
);

// User Modes table
export const userModes = pgTable(
  "user_modes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    mode: userModeEnum("mode").notNull(),
    currentMode: currentModeEnum("current_mode").default("dating"),
    datingProfileId: uuid("dating_profile_id"),
    professionalProfileId: uuid("professional_profile_id"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("user_modes_user_id_idx").on(table.userId),
  })
);

// Dating Profiles table
export const datingProfiles = pgTable(
  "dating_profiles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    bio: text("bio"),
    interests: text("interests"), // JSON array
    photos: text("photos"), // JSON array of photo URLs
    verificationStatus: verificationStatusEnum("verification_status").default("pending"),
    verified: boolean("verified").default(false),
    verifiedAt: timestamp("verified_at"),
    ageRange: varchar("age_range", { length: 20 }),
    lookingFor: varchar("looking_for", { length: 50 }),
    relationshipGoal: varchar("relationship_goal", { length: 50 }),
    height: varchar("height", { length: 10 }),
    bodyType: varchar("body_type", { length: 50 }),
    education: varchar("education", { length: 100 }),
    occupation: varchar("occupation", { length: 100 }),
    income: varchar("income", { length: 50 }),
    smoking: varchar("smoking", { length: 20 }),
    drinking: varchar("drinking", { length: 20 }),
    religion: varchar("religion", { length: 50 }),
    ethnicity: varchar("ethnicity", { length: 50 }),
    languages: text("languages"), // JSON array
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("dating_profiles_user_id_idx").on(table.userId),
    verificationIdx: index("dating_profiles_verification_idx").on(table.verificationStatus),
  })
);

// Professional Profiles table
export const professionalProfiles = pgTable(
  "professional_profiles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    headline: varchar("headline", { length: 255 }),
    bio: text("bio"),
    profilePhoto: text("profile_photo"),
    coverPhoto: text("cover_photo"),
    skills: text("skills"), // JSON array
    certifications: text("certifications"), // JSON array
    experience: text("experience"), // JSON array
    education: text("education"), // JSON array
    portfolio: text("portfolio"), // JSON array
    location: varchar("location", { length: 255 }),
    industry: varchar("industry", { length: 100 }),
    jobTitle: varchar("job_title", { length: 100 }),
    company: varchar("company", { length: 255 }),
    yearsOfExperience: integer("years_of_experience"),
    availability: varchar("availability", { length: 50 }),
    openToWork: boolean("open_to_work").default(true),
    openToMentoring: boolean("open_to_mentoring").default(false),
    verificationStatus: verificationStatusEnum("verification_status").default("pending"),
    verified: boolean("verified").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("professional_profiles_user_id_idx").on(table.userId),
    industryIdx: index("professional_profiles_industry_idx").on(table.industry),
    openToWorkIdx: index("professional_profiles_open_to_work_idx").on(table.openToWork),
  })
);

// ─── Promo Codes table ────────────────────────────────────────────────────────
export const promoCodes = pgTable(
  "promo_codes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    code: varchar("code", { length: 50 }).notNull().unique(),
    description: text("description"),
    discountPercent: decimal("discount_percent", { precision: 5, scale: 2 }).notNull(),
    maxUses: integer("max_uses"),
    usedCount: integer("used_count").default(0).notNull(),
    expiresAt: timestamp("expires_at"),
    active: boolean("active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    codeIdx: index("promo_codes_code_idx").on(table.code),
    activeIdx: index("promo_codes_active_idx").on(table.active),
  })
);

// Subscriptions table
export const subscriptions = pgTable(
  "subscriptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    planId: varchar("plan_id", { length: 50 }).notNull(),
    mode: userModeEnum("mode").notNull(),
    status: subscriptionStatusEnum("status").default("pending"),
    // ─── Provider identifiers ─────────────────────────────────────────────────
    paymentProvider: varchar("payment_provider", { length: 20 }).default("stripe"),
    manualProviderOverride: boolean("manual_provider_override").default(false),
    stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }),
    flutterwaveSubscriptionId: varchar("flutterwave_subscription_id", { length: 255 }),
    stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
    stripePriceId: varchar("stripe_price_id", { length: 255 }),
    flutterwaveCustomerId: varchar("flutterwave_customer_id", { length: 255 }),
    flutterwave_plan_id: varchar("flutterwave_plan_id", { length: 255 }),
    // ─── Pricing ──────────────────────────────────────────────────────────────
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).default("USD"),
    billingCycle: varchar("billing_cycle", { length: 20 }).default("monthly"),
    // ─── Period tracking ──────────────────────────────────────────────────────
    currentPeriodStart: timestamp("current_period_start"),
    currentPeriodEnd: timestamp("current_period_end"),
    cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
    startedAt: timestamp("started_at"),
    expiresAt: timestamp("expires_at"),
    renewalDate: timestamp("renewal_date"),
    cancelledAt: timestamp("cancelled_at"),
    // ─── Promo & discounts ────────────────────────────────────────────────────
    promoCodeId: uuid("promo_code_id").references(() => promoCodes.id),
    discountPercent: decimal("discount_percent", { precision: 5, scale: 2 }).default("0"),
    // ─── Failed payment recovery ──────────────────────────────────────────────
    failedPaymentCount: integer("failed_payment_count").default(0),
    lastFailedAt: timestamp("last_failed_at"),
    nextRetryAt: timestamp("next_retry_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("subscriptions_user_id_idx").on(table.userId),
    statusIdx: index("subscriptions_status_idx").on(table.status),
    expiresAtIdx: index("subscriptions_expires_at_idx").on(table.expiresAt),
    providerIdx: index("subscriptions_provider_idx").on(table.paymentProvider),
  })
);

// Messages table
export const messages = pgTable(
  "messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    senderId: uuid("sender_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    recipientId: uuid("recipient_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    type: messageTypeEnum("type").default("text"),
    read: boolean("read").default(false),
    readAt: timestamp("read_at"),
    reactions: text("reactions"), // JSON object of emoji reactions
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    senderIdIdx: index("messages_sender_id_idx").on(table.senderId),
    recipientIdIdx: index("messages_recipient_id_idx").on(table.recipientId),
    createdAtIdx: index("messages_created_at_idx").on(table.createdAt),
  })
);

// Matches table (for dating mode)
export const matches = pgTable(
  "matches",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId1: uuid("user_id_1")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    userId2: uuid("user_id_2")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    status: varchar("status", { length: 50 }).default("matched"), // matched, liked, passed
    matchedAt: timestamp("matched_at").defaultNow(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    user1Idx: index("matches_user_id_1_idx").on(table.userId1),
    user2Idx: index("matches_user_id_2_idx").on(table.userId2),
  })
);

// Connections table (for professional mode)
export const connections = pgTable(
  "connections",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId1: uuid("user_id_1")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    userId2: uuid("user_id_2")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    status: varchar("status", { length: 50 }).default("pending"), // pending, accepted, blocked
    acceptedAt: timestamp("accepted_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    user1Idx: index("connections_user_id_1_idx").on(table.userId1),
    user2Idx: index("connections_user_id_2_idx").on(table.userId2),
  })
);

// Payment Events table
export const paymentEvents = pgTable(
  "payment_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    subscriptionId: uuid("subscription_id")
      .notNull()
      .references(() => subscriptions.id, { onDelete: "cascade" }),
    eventType: varchar("event_type", { length: 50 }).notNull(), // payment_succeeded, payment_failed, subscription_updated, etc.
    provider: varchar("provider", { length: 50 }).notNull(), // stripe, flutterwave
    providerEventId: varchar("provider_event_id", { length: 255 }),
    amount: decimal("amount", { precision: 10, scale: 2 }),
    currency: varchar("currency", { length: 3 }),
    metadata: text("metadata"), // JSON
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    subscriptionIdIdx: index("payment_events_subscription_id_idx").on(table.subscriptionId),
    eventTypeIdx: index("payment_events_event_type_idx").on(table.eventType),
  })
);

// ─── Payment Retries table ────────────────────────────────────────────────────
export const paymentRetries = pgTable(
  "payment_retries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    subscriptionId: uuid("subscription_id")
      .notNull()
      .references(() => subscriptions.id, { onDelete: "cascade" }),
    provider: varchar("provider", { length: 20 }).notNull(),
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

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  userMode: one(userModes, {
    fields: [users.id],
    references: [userModes.userId],
  }),
  datingProfile: one(datingProfiles, {
    fields: [users.id],
    references: [datingProfiles.userId],
  }),
  professionalProfile: one(professionalProfiles, {
    fields: [users.id],
    references: [professionalProfiles.userId],
  }),
  subscriptions: many(subscriptions),
  sentMessages: many(messages, {
    relationName: "sentMessages",
  }),
  receivedMessages: many(messages, {
    relationName: "receivedMessages",
  }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one, many }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
  promoCode: one(promoCodes, {
    fields: [subscriptions.promoCodeId],
    references: [promoCodes.id],
  }),
  paymentEvents: many(paymentEvents),
  paymentRetries: many(paymentRetries),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: "sentMessages",
  }),
  recipient: one(users, {
    fields: [messages.recipientId],
    references: [users.id],
    relationName: "receivedMessages",
  }),
}));
