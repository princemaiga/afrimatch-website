import { db } from "./client";
import {
  users,
  userModes,
  datingProfiles,
  professionalProfiles,
  subscriptions,
  messages,
} from "./schema";
import { eq, and, or } from "drizzle-orm";
import * as bcrypt from "bcryptjs";

// User queries
export async function createUser(data: {
  email: string;
  name: string;
  password: string;
  dateOfBirth: Date;
  country: string;
  phone?: string;
  gender?: string;
}) {
  const passwordHash = await bcrypt.hash(data.password, 10);

  const [user] = await db
    .insert(users)
    .values({
      email: data.email,
      name: data.name,
      passwordHash,
      dateOfBirth: data.dateOfBirth,
      country: data.country,
      phone: data.phone,
      gender: data.gender as any,
    })
    .returning();

  return user;
}

export async function getUserByEmail(email: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  return user;
}

export async function getUserById(id: string) {
  const [user] = await db.select().from(users).where(eq(users.id, id));
  return user;
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function updateUser(id: string, data: Partial<typeof users.$inferInsert>) {
  const [user] = await db
    .update(users)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning();

  return user;
}

// User Mode queries
export async function createUserMode(data: {
  userId: string;
  mode: "dating" | "professional" | "both";
}) {
  const [userMode] = await db
    .insert(userModes)
    .values(data)
    .returning();

  return userMode;
}

export async function getUserMode(userId: string) {
  const [userMode] = await db
    .select()
    .from(userModes)
    .where(eq(userModes.userId, userId));

  return userMode;
}

export async function updateUserMode(
  userId: string,
  data: Partial<typeof userModes.$inferInsert>
) {
  const [userMode] = await db
    .update(userModes)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(userModes.userId, userId))
    .returning();

  return userMode;
}

// Dating Profile queries
export async function createDatingProfile(data: {
  userId: string;
  bio?: string;
  interests?: string;
  photos?: string;
}) {
  const [profile] = await db
    .insert(datingProfiles)
    .values(data)
    .returning();

  return profile;
}

export async function getDatingProfile(userId: string) {
  const [profile] = await db
    .select()
    .from(datingProfiles)
    .where(eq(datingProfiles.userId, userId));

  return profile;
}

export async function updateDatingProfile(
  userId: string,
  data: Partial<typeof datingProfiles.$inferInsert>
) {
  const [profile] = await db
    .update(datingProfiles)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(datingProfiles.userId, userId))
    .returning();

  return profile;
}

// Professional Profile queries
export async function createProfessionalProfile(data: {
  userId: string;
  headline?: string;
  bio?: string;
  profilePhoto?: string;
}) {
  const [profile] = await db
    .insert(professionalProfiles)
    .values(data)
    .returning();

  return profile;
}

export async function getProfessionalProfile(userId: string) {
  const [profile] = await db
    .select()
    .from(professionalProfiles)
    .where(eq(professionalProfiles.userId, userId));

  return profile;
}

export async function updateProfessionalProfile(
  userId: string,
  data: Partial<typeof professionalProfiles.$inferInsert>
) {
  const [profile] = await db
    .update(professionalProfiles)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(professionalProfiles.userId, userId))
    .returning();

  return profile;
}

// Subscription queries
export async function createSubscription(data: {
  userId: string;
  planId: string;
  mode: "dating" | "professional" | "both";
  price: string;
  currency?: string;
  billingCycle?: string;
  stripeSubscriptionId?: string;
  flutterwaveSubscriptionId?: string;
  stripeCustomerId?: string;
}) {
  const [subscription] = await db
    .insert(subscriptions)
    .values({
      ...data,
      status: "pending",
      startedAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    })
    .returning();

  return subscription;
}

export async function getSubscription(id: string) {
  const [subscription] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.id, id));

  return subscription;
}

export async function getUserSubscriptions(userId: string) {
  return db.select().from(subscriptions).where(eq(subscriptions.userId, userId));
}

export async function getActiveSubscription(userId: string, mode: string) {
  const [subscription] = await db
    .select()
    .from(subscriptions)
    .where(
      and(
        eq(subscriptions.userId, userId),
        eq(subscriptions.mode, mode as any),
        eq(subscriptions.status, "active")
      )
    );

  return subscription;
}

export async function updateSubscription(
  id: string,
  data: Partial<typeof subscriptions.$inferInsert>
) {
  const [subscription] = await db
    .update(subscriptions)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(subscriptions.id, id))
    .returning();

  return subscription;
}

// Message queries
export async function createMessage(data: {
  senderId: string;
  recipientId: string;
  content: string;
  type?: "text" | "image" | "voice";
}) {
  const [message] = await db
    .insert(messages)
    .values(data)
    .returning();

  return message;
}

export async function getMessages(userId1: string, userId2: string, limit = 50) {
  return db
    .select()
    .from(messages)
    .where(
      or(
        and(eq(messages.senderId, userId1), eq(messages.recipientId, userId2)),
        and(eq(messages.senderId, userId2), eq(messages.recipientId, userId1))
      )
    )
    .orderBy((t) => t.createdAt)
    .limit(limit);
}

export async function markMessageAsRead(messageId: string) {
  const [message] = await db
    .update(messages)
    .set({ read: true, readAt: new Date() })
    .where(eq(messages.id, messageId))
    .returning();

  return message;
}

export async function getUnreadMessageCount(userId: string) {
  const result = await db
    .select()
    .from(messages)
    .where(and(eq(messages.recipientId, userId), eq(messages.read, false)));

  return result.length;
}

// Conversation queries
export async function getConversations(userId: string) {
  // Get all unique users this user has messaged
  const sentTo = await db
    .select({ recipientId: messages.recipientId })
    .from(messages)
    .where(eq(messages.senderId, userId));

  const receivedFrom = await db
    .select({ senderId: messages.senderId })
    .from(messages)
    .where(eq(messages.recipientId, userId));

  const uniqueUserIds = new Set<string>();
  sentTo.forEach((m) => uniqueUserIds.add(m.recipientId));
  receivedFrom.forEach((m) => uniqueUserIds.add(m.senderId));

  // Get user details for each conversation
  const conversations = [];
  for (const otherUserId of uniqueUserIds) {
    const [otherUser] = await db.select().from(users).where(eq(users.id, otherUserId));

    const [lastMessage] = await db
      .select()
      .from(messages)
      .where(
        or(
          and(eq(messages.senderId, userId), eq(messages.recipientId, otherUserId)),
          and(eq(messages.senderId, otherUserId), eq(messages.recipientId, userId))
        )
      )
      .orderBy((t) => t.createdAt)
      .limit(1);

    const unreadCount = await db
      .select()
      .from(messages)
      .where(
        and(
          eq(messages.senderId, otherUserId),
          eq(messages.recipientId, userId),
          eq(messages.read, false)
        )
      );

    conversations.push({
      participantId: otherUserId,
      participantName: otherUser?.name,
      participantImage: otherUser?.avatar,
      lastMessage,
      unreadCount: unreadCount.length,
    });
  }

  return conversations;
}
