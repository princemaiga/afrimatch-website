# Production Deployment Configuration Guide

## Phase 1: Vercel Deployment Setup

### Step 1: Create Vercel Project

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy project
vercel --prod
```

### Step 2: Configure Environment Variables

Add these environment variables in Vercel Dashboard (Settings → Environment Variables):

**Database**
```
DATABASE_URL=postgresql://user:password@host:port/database
DATABASE_SSL=true
DATABASE_POOL_SIZE=20
DATABASE_IDLE_TIMEOUT=30000
```

**Authentication**
```
NEXTAUTH_SECRET=<generate-with: openssl rand -base64 32>
NEXTAUTH_URL=https://afrimatch.app
JWT_SECRET=<generate-with: openssl rand -base64 32>
```

**Payment Gateways**
```
STRIPE_PUBLIC_KEY=pk_live_xxxxx
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_LIVE_xxxxx
FLUTTERWAVE_SECRET_KEY=FLWSECK_LIVE_xxxxx
FLUTTERWAVE_WEBHOOK_SECRET=xxxxx
```

**Email Service**
```
SENDGRID_API_KEY=SG.xxxxx
SENDGRID_FROM_EMAIL=noreply@afrimatch.app
SENDGRID_FROM_NAME=AfriMatch
```

**SMS Service (Twilio)**
```
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_PHONE_NUMBER=+1234567890
```

**Analytics**
```
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
MIXPANEL_TOKEN=xxxxx
AMPLITUDE_API_KEY=xxxxx
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
```

**Social Media APIs**
```
TWITTER_API_KEY=xxxxx
TWITTER_API_SECRET=xxxxx
TWITTER_BEARER_TOKEN=xxxxx
TIKTOK_CLIENT_ID=xxxxx
TIKTOK_CLIENT_SECRET=xxxxx
LINKEDIN_CLIENT_ID=xxxxx
LINKEDIN_CLIENT_SECRET=xxxxx
INSTAGRAM_ACCESS_TOKEN=xxxxx
FACEBOOK_ACCESS_TOKEN=xxxxx
```

**Storage**
```
AWS_S3_BUCKET=afrimatch-production
AWS_S3_REGION=us-east-1
AWS_ACCESS_KEY_ID=xxxxx
AWS_SECRET_ACCESS_KEY=xxxxx
```

**Other**
```
NODE_ENV=production
VERCEL_ENV=production
LOG_LEVEL=info
API_RATE_LIMIT=100
SESSION_TIMEOUT=1800000
```

### Step 3: Configure Vercel Build Settings

In Vercel Dashboard (Settings → General):

- **Framework**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Node.js Version**: 18.x

### Step 4: Set Up Custom Domain

1. Go to Settings → Domains
2. Add domain: `afrimatch.app`
3. Configure DNS records:
   - Type: CNAME
   - Name: www
   - Value: cname.vercel-dns.com
4. Wait for DNS propagation (up to 48 hours)

---

## Phase 2: Twilio SMS Configuration

### Step 1: Create Twilio Account

1. Go to [twilio.com](https://www.twilio.com)
2. Sign up and verify email
3. Create new project
4. Get Account SID and Auth Token
5. Purchase phone number (+1 or local number)

### Step 2: Configure Twilio in Application

```typescript
// lib/sms/twilio.ts already configured
// Just add credentials to environment variables
```

### Step 3: Test SMS Sending

```bash
# Test SMS notification
curl -X POST https://afrimatch.app/api/sms/test \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+1234567890",
    "message": "Test SMS from AfriMatch"
  }'
```

### Step 4: Set Up Webhook for SMS Replies

1. In Twilio Console, go to Phone Numbers
2. Configure Webhook URL: `https://afrimatch.app/api/webhooks/twilio/sms`
3. Set method to POST

---

## Phase 3: Social Media API Integration

### Twitter/X Integration

```bash
# 1. Create Twitter Developer Account
# Go to https://developer.twitter.com

# 2. Create App in Developer Portal
# 3. Generate API Keys and Bearer Token
# 4. Add to environment variables

# 5. Test API connection
curl -H "Authorization: Bearer YOUR_BEARER_TOKEN" \
  "https://api.twitter.com/2/tweets/search/recent?query=AfriMatch"
```

### TikTok Integration

```bash
# 1. Create TikTok Developer Account
# Go to https://developer.tiktok.com

# 2. Create Application
# 3. Get Client ID and Client Secret
# 4. Configure OAuth redirect URI: https://afrimatch.app/api/auth/tiktok/callback
# 5. Add to environment variables

# 6. Test API connection
curl -X POST https://open.tiktokapis.com/v1/oauth/token/ \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET&grant_type=client_credentials"
```

### LinkedIn Integration

```bash
# 1. Create LinkedIn Developer Account
# Go to https://www.linkedin.com/developers

# 2. Create Application
# 3. Get Client ID and Client Secret
# 4. Configure OAuth redirect URI: https://afrimatch.app/api/auth/linkedin/callback
# 5. Add to environment variables

# 6. Test API connection
curl -X POST https://www.linkedin.com/oauth/v2/accessToken \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials&client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET"
```

### Instagram/Facebook Integration

```bash
# 1. Create Meta Developer Account
# Go to https://developers.facebook.com

# 2. Create App (type: Business)
# 3. Add Instagram and Facebook products
# 4. Get Access Token
# 5. Add to environment variables

# 6. Test API connection
curl -X GET "https://graph.instagram.com/me?fields=id,username&access_token=YOUR_ACCESS_TOKEN"
```

---

## Phase 4: Analytics Setup

### Google Analytics 4

```bash
# 1. Create GA4 Property
# Go to https://analytics.google.com

# 2. Create new property for afrimatch.app
# 3. Get Measurement ID (G-XXXXXXXXXX)
# 4. Add to environment variables

# 5. Install gtag.js in Next.js
# Already configured in app/_app.tsx

# 6. Test tracking
# Open website and check Real-time reports in GA4
```

### Mixpanel Setup

```bash
# 1. Create Mixpanel Account
# Go to https://mixpanel.com

# 2. Create new project
# 3. Get Project Token
# 4. Add to environment variables

# 5. Install Mixpanel SDK
npm install mixpanel-browser

# 6. Initialize in app
# Already configured in lib/analytics/mixpanel.ts
```

### Amplitude Setup

```bash
# 1. Create Amplitude Account
# Go to https://amplitude.com

# 2. Create new project
# 3. Get API Key
# 4. Add to environment variables

# 5. Install Amplitude SDK
npm install @amplitude/analytics-browser

# 6. Initialize in app
# Already configured in lib/analytics/amplitude.ts
```

### Sentry Error Tracking

```bash
# 1. Create Sentry Account
# Go to https://sentry.io

# 2. Create new project (Next.js)
# 3. Get DSN
# 4. Add to environment variables

# 5. Install Sentry SDK
npm install @sentry/nextjs

# 6. Initialize in app
# Already configured in sentry.config.js
```

---

## Phase 5: Database Setup

### PostgreSQL Database

```bash
# Option 1: Vercel Postgres (Recommended)
# 1. In Vercel dashboard, go to Storage
# 2. Create new Postgres database
# 3. Copy connection string to DATABASE_URL

# Option 2: External Provider (AWS RDS, DigitalOcean, etc.)
# 1. Create PostgreSQL database
# 2. Configure security groups/firewall
# 3. Add connection string to DATABASE_URL

# Run migrations
DATABASE_URL=postgresql://... npm run db:push

# Verify migrations
npm run db:verify

# Seed initial data
npm run db:seed
```

---

## Phase 6: Security Configuration

### SSL/TLS Certificate

```bash
# Vercel automatically provisions SSL certificate
# Verify HTTPS: https://afrimatch.app

# Check certificate validity
curl -I https://afrimatch.app
```

### Security Headers

```
# Already configured in vercel.json
# Headers include:
# - HSTS (Strict-Transport-Security)
# - CSP (Content-Security-Policy)
# - X-Frame-Options
# - X-XSS-Protection
# - X-Content-Type-Options
```

### CORS Configuration

```typescript
// Already configured in lib/middleware/cors.ts
// Allowed origins:
// - https://afrimatch.app
// - https://www.afrimatch.app
// - https://app.afrimatch.app
```

---

## Phase 7: Monitoring & Logging

### Set Up Uptime Monitoring

```bash
# 1. Create account at https://uptimerobot.com
# 2. Add monitor for https://afrimatch.app
# 3. Set check interval to 5 minutes
# 4. Configure alerts to support@afrimatch.app
```

### Configure Log Aggregation

```bash
# 1. Create account at https://www.loggly.com
# 2. Get API token
# 3. Configure log forwarding from Vercel
# 4. Set up alerts for critical errors
```

---

## Phase 8: Backup & Disaster Recovery

### Database Backups

```bash
# Vercel Postgres automatically backs up daily
# Retention: 30 days

# Manual backup
pg_dump postgresql://user:password@host/database > backup.sql

# Restore from backup
psql postgresql://user:password@host/database < backup.sql
```

### Code Repository Backup

```bash
# Already backed up on GitHub
# Enable branch protection and require reviews
```

---

## Phase 9: Performance Optimization

### Enable Caching

```
# Already configured in vercel.json
# Static assets: 1 year cache
# API endpoints: no cache
# HTML pages: 60 seconds cache
```

### Image Optimization

```typescript
// Use Next.js Image component
<Image src="/image.jpg" width={800} height={600} />
```

### Database Query Optimization

```bash
# Create indexes for frequent queries
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_messages_user_id ON messages(user_id);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
```

---

## Phase 10: Testing & Verification

### Pre-Launch Testing Checklist

```bash
# 1. Test all API endpoints
npm run test:api

# 2. Test payment processing
# Use Stripe test card: 4242 4242 4242 4242

# 3. Test email notifications
# Check SendGrid activity log

# 4. Test SMS notifications
# Check Twilio logs

# 5. Test social media integrations
# Post test tweet, TikTok, LinkedIn

# 6. Performance testing
# Run Lighthouse audit: npm run audit

# 7. Security testing
# Run security scan: npm audit

# 8. Load testing
# Use k6 or Apache JMeter
```

---

## Phase 11: Go Live

### Pre-Launch Verification

```bash
# 1. Verify all environment variables set
# 2. Verify database migrations applied
# 3. Verify SSL certificate active
# 4. Verify DNS propagation
# 5. Verify payment gateways configured
# 6. Verify email service working
# 7. Verify SMS service working
# 8. Verify analytics tracking
# 9. Verify monitoring active
# 10. Verify backups configured
```

### Launch Steps

```bash
# 1. Push final code to main branch
git push origin main

# 2. Vercel automatically deploys
# Monitor deployment progress in Vercel dashboard

# 3. Verify production deployment
# Check https://afrimatch.app

# 4. Monitor error logs
# Check Sentry dashboard

# 5. Monitor performance
# Check Google Analytics

# 6. Monitor user signups
# Check admin dashboard
```

---

## Phase 12: Post-Launch Monitoring

### Daily Checks

- [ ] Error rate < 1%
- [ ] Page load time < 3 seconds
- [ ] API response time < 500ms
- [ ] Uptime > 99%
- [ ] User signups tracking
- [ ] Payment processing working
- [ ] Email delivery working
- [ ] SMS delivery working

### Weekly Reviews

- [ ] Analytics review
- [ ] User growth metrics
- [ ] Revenue metrics
- [ ] Engagement metrics
- [ ] Support tickets
- [ ] Performance metrics

### Monthly Optimization

- [ ] Database optimization
- [ ] Dependency updates
- [ ] Security audit
- [ ] Performance tuning
- [ ] Feature improvements

---

## Troubleshooting

### Deployment Fails

```bash
# Clear cache and rebuild
vercel --prod --force

# Check build logs
vercel logs --prod

# Verify environment variables
vercel env ls
```

### Database Connection Issues

```bash
# Test connection
psql $DATABASE_URL

# Check connection string
echo $DATABASE_URL

# Verify firewall rules
# Allow Vercel IP ranges in database security groups
```

### Payment Webhooks Not Received

```bash
# Verify webhook URL in Stripe dashboard
# Check webhook delivery logs
# Verify webhook signing secret
```

---

**Deployment Status**: Ready for Production ✅  
**Last Updated**: June 2026  
**Next Review**: July 2026
