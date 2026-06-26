# AfriMatch Website - Vercel Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying the AfriMatch website to Vercel with full environment configuration, database setup, and webhook integration.

---

## Phase 1: Pre-Deployment Setup

### 1.1 Prepare Your Repository

Ensure your code is committed and pushed to GitHub:

```bash
cd /home/ubuntu/afrimatch-website
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 1.2 Create Vercel Account

1. Go to https://vercel.com
2. Sign up with GitHub
3. Authorize Vercel to access your GitHub repositories

---

## Phase 2: Database Setup

### 2.1 PostgreSQL Database

**Option A: Vercel Postgres (Recommended)**

1. In Vercel Dashboard, go to Storage
2. Click "Create Database" → Select "Postgres"
3. Name it: `afrimatch-db`
4. Copy the connection string

**Option B: External Provider (AWS RDS, Railway, Supabase)**

1. Create a PostgreSQL database
2. Note the connection string
3. Ensure database is accessible from Vercel

### 2.2 Run Database Migrations

```bash
# Generate migration files
pnpm drizzle-kit generate

# Apply migrations (locally first for testing)
pnpm drizzle-kit migrate
```

---

## Phase 3: Environment Variables

### 3.1 Create `.env.production` File

Create a new file with all production environment variables:

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/afrimatch

# NextAuth
NEXTAUTH_URL=https://afrimatch.app
NEXTAUTH_SECRET=your-secure-random-secret-here

# Stripe
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Flutterwave
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_...
FLUTTERWAVE_SECRET_KEY=FLWSECK_...

# OAuth Providers
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
FACEBOOK_APP_ID=...
FACEBOOK_APP_SECRET=...

# Twilio (Phone OTP)
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=...

# Email Service
SENDGRID_API_KEY=...
SENDGRID_FROM_EMAIL=noreply@afrimatch.app

# File Upload (S3)
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=afrimatch-uploads
AWS_REGION=us-east-1
```

### 3.2 Generate Secure Secrets

```bash
# Generate NEXTAUTH_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Phase 4: Deploy to Vercel

### 4.1 Connect GitHub Repository

1. Go to Vercel Dashboard
2. Click "New Project"
3. Select your GitHub repository
4. Configure project settings:
   - **Framework**: Next.js
   - **Root Directory**: `./` (or where package.json is)
   - **Build Command**: `pnpm run build`
   - **Output Directory**: `.next`

### 4.2 Add Environment Variables

In Vercel Dashboard:

1. Go to Project Settings → Environment Variables
2. Add all variables from `.env.production`
3. Select environments: Production, Preview, Development
4. Click "Save"

### 4.3 Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Verify deployment at `https://your-project.vercel.app`

---

## Phase 5: Domain Configuration

### 5.1 Connect Custom Domain

1. In Vercel Dashboard, go to Settings → Domains
2. Add domain: `afrimatch.app`
3. Follow DNS configuration instructions:
   - Update nameservers at your domain registrar, OR
   - Add CNAME records pointing to Vercel

### 5.2 SSL Certificate

Vercel automatically provisions SSL certificates. No additional setup needed.

---

## Phase 6: Webhook Configuration

### 6.1 Stripe Webhooks

1. Go to Stripe Dashboard → Webhooks
2. Create new endpoint:
   - URL: `https://afrimatch.app/api/webhooks/stripe`
   - Events: Select all subscription and payment events
3. Copy webhook signing secret
4. Update `STRIPE_WEBHOOK_SECRET` in Vercel

### 6.2 Flutterwave Webhooks

1. Go to Flutterwave Dashboard → Settings → Webhooks
2. Add webhook URL: `https://afrimatch.app/api/webhooks/flutterwave`
3. Copy webhook secret
4. Verify webhook is receiving events

---

## Phase 7: Database Migrations on Production

### 7.1 Run Migrations

```bash
# Set production database URL
export DATABASE_URL="your-production-db-url"

# Run migrations
pnpm drizzle-kit migrate
```

### 7.2 Verify Schema

```bash
# Check database schema
pnpm drizzle-kit studio
```

---

## Phase 8: Testing

### 8.1 Authentication Flow

1. Visit `https://afrimatch.app/auth/signup`
2. Test signup with email
3. Verify email verification email is sent
4. Test login

### 8.2 Payment Flow

1. Go to pricing page
2. Select a plan
3. Complete payment (use test cards)
4. Verify subscription is created in database

### 8.3 Messaging

1. Create two test accounts
2. Send messages between accounts
3. Verify messages appear in real-time

### 8.4 Profile Management

1. Edit dating profile
2. Upload photos
3. Edit professional profile
4. Verify data is saved to database

---

## Phase 9: Monitoring & Logging

### 9.1 Vercel Analytics

1. Enable Web Analytics in Vercel Dashboard
2. Monitor performance metrics
3. Set up alerts for errors

### 9.2 Error Tracking

1. Integrate Sentry for error tracking
2. Add Sentry DSN to environment variables
3. Monitor errors in real-time

### 9.3 Database Monitoring

1. Set up database backups
2. Monitor query performance
3. Set up alerts for slow queries

---

## Phase 10: Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] Database credentials encrypted
- [ ] API keys rotated
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Input validation implemented
- [ ] SQL injection prevention
- [ ] XSS protection enabled
- [ ] CSRF tokens implemented

---

## Phase 11: Performance Optimization

### 11.1 Image Optimization

```bash
# Use Next.js Image component
# Automatic optimization for all images
```

### 11.2 Database Optimization

```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
```

### 11.3 Caching

1. Enable Vercel Edge Caching
2. Set cache headers for static assets
3. Implement database query caching

---

## Phase 12: Backup & Recovery

### 12.1 Database Backups

1. Enable automated backups in database provider
2. Test backup restoration
3. Document recovery procedures

### 12.2 Code Backups

1. Maintain GitHub repository
2. Tag releases
3. Document deployment history

---

## Troubleshooting

### Build Fails

1. Check build logs in Vercel
2. Verify all dependencies are installed
3. Check for TypeScript errors: `pnpm run check`

### Database Connection Issues

1. Verify DATABASE_URL is correct
2. Check database is accessible from Vercel
3. Verify firewall rules allow Vercel IPs

### Webhook Not Receiving Events

1. Verify webhook URL is correct
2. Check webhook signing secret
3. Review webhook logs in payment provider dashboard

### Slow Performance

1. Check database query performance
2. Enable caching
3. Optimize images
4. Review Vercel analytics

---

## Post-Deployment Checklist

- [ ] Domain configured and SSL working
- [ ] All environment variables set
- [ ] Database migrations applied
- [ ] Webhooks configured and tested
- [ ] Authentication flow tested
- [ ] Payment flow tested
- [ ] Messaging tested
- [ ] Profile management tested
- [ ] Monitoring and logging configured
- [ ] Backups enabled
- [ ] Security checklist completed
- [ ] Performance optimized

---

## Support & Resources

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Stripe Docs: https://stripe.com/docs
- Flutterwave Docs: https://developer.flutterwave.com

---

**Last Updated**: June 2026
**Version**: 1.0.0
