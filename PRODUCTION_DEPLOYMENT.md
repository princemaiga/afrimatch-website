# AfriMatch Production Deployment Guide

## Complete Deployment Workflow

This guide provides step-by-step instructions for deploying AfriMatch to production with all security, performance, and reliability measures.

---

## Phase 1: Pre-Deployment (Week Before Launch)

### 1.1 Code Preparation

Ensure all code is production-ready:

```bash
# Run all tests
pnpm test

# Check TypeScript
pnpm run check

# Run linter
pnpm run lint

# Build locally to verify
pnpm run build
```

### 1.2 Environment Configuration

Prepare all environment variables for production:

```bash
# Create production environment file
cp .env.example .env.production

# Add all production values:
# - Database URL (Vercel Postgres)
# - NextAuth secret
# - Stripe keys
# - Flutterwave keys
# - SendGrid API key
# - OAuth credentials
# - Analytics endpoints
```

### 1.3 Database Preparation

Set up production database:

```bash
# Create Vercel Postgres database
# 1. Go to Vercel Dashboard → Storage
# 2. Create new Postgres database
# 3. Copy connection string

# Generate migrations
pnpm drizzle-kit generate

# Apply migrations (locally first for testing)
DATABASE_URL="local_db" pnpm drizzle-kit migrate

# Verify schema
pnpm drizzle-kit studio
```

### 1.4 Security Audit

Perform security checks:

```bash
# Check dependencies for vulnerabilities
npm audit

# Run security linter
pnpm run lint

# Check for secrets in code
git log -p | grep -i "password\|secret\|key" || echo "No secrets found"

# Verify no hardcoded credentials
grep -r "password\|secret\|api_key" src/ || echo "No hardcoded credentials"
```

### 1.5 Performance Testing

Test performance locally:

```bash
# Build for production
pnpm run build

# Start production server
pnpm start

# Test with lighthouse
# Use Chrome DevTools Lighthouse tab
# Target: Accessibility 90+, Best Practices 90+, SEO 90+
```

---

## Phase 2: Vercel Deployment Setup

### 2.1 Create Vercel Project

1. Go to https://vercel.com
2. Click "New Project"
3. Select GitHub repository
4. Configure project:
   - **Framework**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `pnpm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `pnpm install`

### 2.2 Configure Environment Variables

In Vercel Dashboard → Project Settings → Environment Variables:

```
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://afrimatch.app
NEXTAUTH_SECRET=<generate-secure-secret>
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_...
FLUTTERWAVE_SECRET_KEY=FLWSECK_...
SENDGRID_API_KEY=SG....
SENDGRID_FROM_EMAIL=noreply@afrimatch.app
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
FACEBOOK_APP_ID=...
FACEBOOK_APP_SECRET=...
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=afrimatch-uploads
AWS_REGION=us-east-1
SENTRY_DSN=...
```

### 2.3 Configure Custom Domain

1. Go to Project Settings → Domains
2. Add domain: `afrimatch.app`
3. Follow DNS configuration:
   - Option A: Update nameservers at registrar
   - Option B: Add CNAME records to Vercel

### 2.4 Configure Git Integration

1. Connect GitHub repository
2. Set production branch: `main`
3. Enable automatic deployments on push
4. Enable preview deployments for PRs

---

## Phase 3: Database Migration

### 3.1 Create Production Database

```bash
# In Vercel Dashboard:
# 1. Go to Storage tab
# 2. Create Postgres database
# 3. Copy connection string
# 4. Add to environment variables
```

### 3.2 Run Migrations

```bash
# Set production database URL
export DATABASE_URL="postgresql://..."

# Generate migration files
pnpm drizzle-kit generate

# Apply migrations
pnpm drizzle-kit migrate

# Verify schema
pnpm drizzle-kit studio
```

### 3.3 Seed Initial Data (Optional)

```bash
# Create seed script
cat > scripts/seed.ts << 'EOF'
import { db } from "@/lib/db/client";

async function seed() {
  // Add initial data (admin users, default plans, etc.)
  console.log("Database seeded successfully");
}

seed().catch(console.error);
EOF

# Run seed
pnpm tsx scripts/seed.ts
```

---

## Phase 4: Payment Gateway Setup

### 4.1 Stripe Configuration

1. Go to Stripe Dashboard
2. Create webhook endpoint:
   - URL: `https://afrimatch.app/api/webhooks/stripe`
   - Events: All subscription and payment events
3. Copy webhook signing secret
4. Add to environment variables: `STRIPE_WEBHOOK_SECRET`

### 4.2 Flutterwave Configuration

1. Go to Flutterwave Dashboard
2. Configure webhook:
   - URL: `https://afrimatch.app/api/webhooks/flutterwave`
3. Copy webhook secret
4. Add to environment variables: `FLUTTERWAVE_WEBHOOK_SECRET`

### 4.3 Test Payment Processing

1. Use test cards from Stripe
2. Use test credentials from Flutterwave
3. Verify webhooks are received
4. Verify database is updated

---

## Phase 5: Email Service Setup

### 5.1 SendGrid Configuration

1. Create SendGrid account
2. Create API key
3. Add verified sender email
4. Test email sending

### 5.2 Email Template Setup

1. Create email templates in SendGrid
2. Or use HTML templates in code
3. Test all email types:
   - Verification email
   - Password reset
   - Welcome email
   - Subscription confirmation
   - Payment failure

---

## Phase 6: Security Configuration

### 6.1 SSL/TLS Certificate

- Vercel automatically provisions SSL certificates
- Verify HTTPS is working
- Check certificate validity

### 6.2 Security Headers

- Verify all security headers are set
- Test with https://securityheaders.com
- Target: A+ rating

### 6.3 CORS Configuration

- Verify CORS is properly configured
- Test cross-origin requests
- Ensure only trusted origins allowed

---

## Phase 7: Monitoring Setup

### 7.1 Error Tracking (Sentry)

1. Create Sentry account
2. Create new project for AfriMatch
3. Add Sentry DSN to environment variables
4. Verify errors are being tracked

### 7.2 Performance Monitoring

1. Enable Vercel Analytics
2. Enable Web Vitals monitoring
3. Set up performance alerts
4. Monitor Core Web Vitals

### 7.3 Uptime Monitoring

1. Set up uptime monitoring service
2. Configure alerts for downtime
3. Set up status page

---

## Phase 8: Deployment

### 8.1 Pre-Deployment Checklist

- [ ] All tests passing
- [ ] No security vulnerabilities
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Payment gateways configured
- [ ] Email service configured
- [ ] Monitoring configured
- [ ] Backups configured

### 8.2 Deploy to Production

```bash
# Push to main branch
git push origin main

# Vercel automatically deploys
# Monitor deployment in Vercel Dashboard
```

### 8.3 Post-Deployment Verification

```bash
# Verify deployment
curl https://afrimatch.app

# Check health endpoint
curl https://afrimatch.app/api/health

# Verify database connection
# Check admin dashboard

# Verify email sending
# Check webhook delivery

# Verify payment processing
# Test with test cards
```

---

## Phase 9: Post-Launch Monitoring

### 9.1 Real-Time Monitoring (First 24 Hours)

- Monitor error rates
- Monitor API response times
- Monitor database performance
- Monitor user signups
- Monitor payment processing
- Monitor email delivery
- Monitor system resources

### 9.2 Issue Response

If issues occur:

1. Identify root cause
2. Implement quick fix or rollback
3. Deploy fix
4. Verify resolution
5. Document incident

### 9.3 Performance Optimization

After stability confirmed:

1. Analyze performance metrics
2. Optimize slow endpoints
3. Optimize database queries
4. Optimize images
5. Implement caching

---

## Phase 10: Rollback Procedure

If critical issues occur:

### 10.1 Immediate Actions

1. Alert team
2. Assess impact
3. Prepare rollback

### 10.2 Rollback Steps

```bash
# In Vercel Dashboard:
# 1. Go to Deployments
# 2. Find last stable deployment
# 3. Click "Redeploy"
# 4. Confirm rollback

# Verify rollback
curl https://afrimatch.app
```

### 10.3 Post-Rollback

1. Investigate root cause
2. Fix issue in code
3. Test thoroughly
4. Redeploy to production

---

## Maintenance Tasks

### Daily
- Monitor error logs
- Monitor performance metrics
- Check for security alerts
- Verify backups completed

### Weekly
- Review analytics
- Check user feedback
- Review security logs
- Optimize performance

### Monthly
- Security audit
- Dependency updates
- Database optimization
- Performance review

---

## Disaster Recovery

### Database Backup
- Automated daily backups
- Test restoration weekly
- Keep 30-day retention

### Code Backup
- GitHub repository as backup
- Tag releases
- Document deployments

### Incident Response
- Have incident response plan
- Train team on procedures
- Regular drills

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Uptime | 99.9% |
| Page Load Time | < 3 seconds |
| API Response Time | < 100ms |
| Error Rate | < 0.1% |
| Core Web Vitals | All Green |

---

**Last Updated**: June 2026
**Version**: 1.0.0
