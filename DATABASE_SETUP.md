# AfriMatch Database Setup Guide

## Overview

This guide explains how to set up and manage the PostgreSQL database for AfriMatch using Drizzle ORM.

---

## Database Schema

The database consists of the following tables:

### Core Tables

**users** - User accounts
- id (UUID, Primary Key)
- email (VARCHAR, Unique)
- name (VARCHAR)
- phone (VARCHAR)
- passwordHash (VARCHAR)
- dateOfBirth (TIMESTAMP)
- country (VARCHAR)
- avatar (TEXT)
- bio (TEXT)
- gender (ENUM: male, female, other)
- emailVerified (BOOLEAN)
- phoneVerified (BOOLEAN)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)

**user_modes** - User mode selection
- id (UUID, Primary Key)
- userId (UUID, Foreign Key)
- mode (ENUM: dating, professional, both)
- currentMode (ENUM: dating, professional)
- datingProfileId (UUID)
- professionalProfileId (UUID)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)

### Profile Tables

**dating_profiles** - Dating mode profiles
- id (UUID, Primary Key)
- userId (UUID, Foreign Key)
- bio (TEXT)
- interests (TEXT - JSON array)
- photos (TEXT - JSON array)
- verificationStatus (ENUM: pending, verified, rejected)
- verified (BOOLEAN)
- verifiedAt (TIMESTAMP)
- ageRange (VARCHAR)
- lookingFor (VARCHAR)
- relationshipGoal (VARCHAR)
- height (VARCHAR)
- bodyType (VARCHAR)
- education (VARCHAR)
- occupation (VARCHAR)
- income (VARCHAR)
- smoking (VARCHAR)
- drinking (VARCHAR)
- religion (VARCHAR)
- ethnicity (VARCHAR)
- languages (TEXT - JSON array)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)

**professional_profiles** - Professional mode profiles
- id (UUID, Primary Key)
- userId (UUID, Foreign Key)
- headline (VARCHAR)
- bio (TEXT)
- profilePhoto (TEXT)
- coverPhoto (TEXT)
- skills (TEXT - JSON array)
- certifications (TEXT - JSON array)
- experience (TEXT - JSON array)
- education (TEXT - JSON array)
- portfolio (TEXT - JSON array)
- location (VARCHAR)
- industry (VARCHAR)
- jobTitle (VARCHAR)
- company (VARCHAR)
- yearsOfExperience (INTEGER)
- availability (VARCHAR)
- openToWork (BOOLEAN)
- openToMentoring (BOOLEAN)
- verificationStatus (ENUM: pending, verified, rejected)
- verified (BOOLEAN)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)

### Subscription & Payment Tables

**subscriptions** - User subscriptions
- id (UUID, Primary Key)
- userId (UUID, Foreign Key)
- planId (VARCHAR)
- mode (ENUM: dating, professional, both)
- status (ENUM: active, cancelled, expired, pending)
- stripeSubscriptionId (VARCHAR)
- flutterwaveSubscriptionId (VARCHAR)
- stripeCustomerId (VARCHAR)
- price (DECIMAL)
- currency (VARCHAR)
- billingCycle (VARCHAR)
- startedAt (TIMESTAMP)
- expiresAt (TIMESTAMP)
- renewalDate (TIMESTAMP)
- cancelledAt (TIMESTAMP)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)

**payment_events** - Payment transaction logs
- id (UUID, Primary Key)
- subscriptionId (UUID, Foreign Key)
- eventType (VARCHAR)
- provider (VARCHAR)
- providerEventId (VARCHAR)
- amount (DECIMAL)
- currency (VARCHAR)
- metadata (TEXT - JSON)
- createdAt (TIMESTAMP)

### Messaging Tables

**messages** - User messages
- id (UUID, Primary Key)
- senderId (UUID, Foreign Key)
- recipientId (UUID, Foreign Key)
- content (TEXT)
- type (ENUM: text, image, voice)
- read (BOOLEAN)
- readAt (TIMESTAMP)
- reactions (TEXT - JSON object)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)

### Matching Tables

**matches** - Dating mode matches
- id (UUID, Primary Key)
- userId1 (UUID, Foreign Key)
- userId2 (UUID, Foreign Key)
- status (VARCHAR)
- matchedAt (TIMESTAMP)
- createdAt (TIMESTAMP)

**connections** - Professional mode connections
- id (UUID, Primary Key)
- userId1 (UUID, Foreign Key)
- userId2 (UUID, Foreign Key)
- status (VARCHAR)
- acceptedAt (TIMESTAMP)
- createdAt (TIMESTAMP)

---

## Local Development Setup

### 1. Install PostgreSQL

**macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Ubuntu/Debian:**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
Download from https://www.postgresql.org/download/windows/

### 2. Create Database

```bash
createdb afrimatch
```

### 3. Set DATABASE_URL

```bash
export DATABASE_URL="postgresql://localhost/afrimatch"
```

### 4. Generate Migrations

```bash
pnpm drizzle-kit generate
```

This creates migration files in `drizzle/` directory.

### 5. Apply Migrations

```bash
pnpm drizzle-kit migrate
```

### 6. Verify Schema

```bash
pnpm drizzle-kit studio
```

This opens a visual database explorer at http://localhost:5555

---

## Production Database Setup

### Option 1: Vercel Postgres (Recommended)

1. Go to Vercel Dashboard → Storage
2. Create new Postgres database
3. Copy connection string
4. Add to environment variables

### Option 2: AWS RDS

1. Create RDS PostgreSQL instance
2. Configure security groups
3. Copy endpoint
4. Create connection string: `postgresql://user:password@endpoint:5432/afrimatch`

### Option 3: Supabase

1. Create new project
2. Copy PostgreSQL connection string
3. Add to environment variables

### Option 4: Railway

1. Create new project
2. Add PostgreSQL plugin
3. Copy connection string

---

## Database Queries

### User Queries

```typescript
import { createUser, getUserByEmail, updateUser } from "@/lib/db/queries";

// Create user
const user = await createUser({
  email: "user@example.com",
  name: "John Doe",
  password: "secure_password",
  dateOfBirth: new Date("1990-01-01"),
  country: "NG",
});

// Get user by email
const user = await getUserByEmail("user@example.com");

// Update user
await updateUser(userId, {
  bio: "Updated bio",
  avatar: "https://...",
});
```

### Profile Queries

```typescript
import {
  createDatingProfile,
  getDatingProfile,
  updateDatingProfile,
} from "@/lib/db/queries";

// Create dating profile
const profile = await createDatingProfile({
  userId,
  bio: "I love travel and music",
  interests: JSON.stringify(["travel", "music", "sports"]),
});

// Get dating profile
const profile = await getDatingProfile(userId);

// Update dating profile
await updateDatingProfile(userId, {
  bio: "Updated bio",
  photos: JSON.stringify([...photos]),
});
```

### Subscription Queries

```typescript
import {
  createSubscription,
  getActiveSubscription,
  updateSubscription,
} from "@/lib/db/queries";

// Create subscription
const subscription = await createSubscription({
  userId,
  planId: "premium_dating",
  mode: "dating",
  price: "9.99",
  stripeSubscriptionId: "sub_123456",
});

// Get active subscription
const subscription = await getActiveSubscription(userId, "dating");

// Update subscription
await updateSubscription(subscriptionId, {
  status: "active",
  stripeSubscriptionId: "sub_new",
});
```

### Message Queries

```typescript
import {
  createMessage,
  getMessages,
  getConversations,
} from "@/lib/db/queries";

// Create message
const message = await createMessage({
  senderId: userId1,
  recipientId: userId2,
  content: "Hello!",
  type: "text",
});

// Get messages between two users
const messages = await getMessages(userId1, userId2);

// Get all conversations for user
const conversations = await getConversations(userId);
```

---

## Indexing Strategy

Key indexes for performance:

```sql
-- User indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_country ON users(country);

-- Profile indexes
CREATE INDEX idx_dating_profiles_user_id ON dating_profiles(user_id);
CREATE INDEX idx_dating_profiles_verification ON dating_profiles(verification_status);
CREATE INDEX idx_professional_profiles_user_id ON professional_profiles(user_id);
CREATE INDEX idx_professional_profiles_industry ON professional_profiles(industry);

-- Subscription indexes
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_expires_at ON subscriptions(expires_at);

-- Message indexes
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
```

---

## Backup & Recovery

### Backup Database

```bash
pg_dump afrimatch > backup.sql
```

### Restore Database

```bash
psql afrimatch < backup.sql
```

### Automated Backups

Most cloud providers offer automated backups:
- Vercel: Automatic daily backups
- AWS RDS: Configure backup retention
- Supabase: Daily backups included
- Railway: Configurable backup schedule

---

## Monitoring

### Query Performance

```sql
-- Find slow queries
SELECT query, calls, mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

### Database Size

```sql
-- Check database size
SELECT pg_size_pretty(pg_database_size('afrimatch'));

-- Check table sizes
SELECT tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename))
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Connection Monitoring

```sql
-- Check active connections
SELECT datname, count(*) FROM pg_stat_activity GROUP BY datname;
```

---

## Maintenance

### Vacuum & Analyze

```sql
-- Optimize database
VACUUM ANALYZE;
```

### Reindex

```sql
-- Rebuild indexes
REINDEX DATABASE afrimatch;
```

---

## Troubleshooting

### Connection Issues

```bash
# Test connection
psql postgresql://user:password@host:5432/afrimatch
```

### Slow Queries

1. Check indexes
2. Analyze query plan: `EXPLAIN ANALYZE SELECT ...`
3. Add missing indexes

### Disk Space

1. Check table sizes
2. Archive old data
3. Increase storage

---

## Migration Strategy

### Creating New Migrations

```bash
# Generate migration
pnpm drizzle-kit generate

# Review generated SQL in drizzle/ directory
# Apply migration
pnpm drizzle-kit migrate
```

### Zero-Downtime Migrations

1. Add new column with default value
2. Deploy code to handle both old and new columns
3. Migrate data
4. Remove old column in next deployment

---

**Last Updated**: June 2026
**Version**: 1.0.0
