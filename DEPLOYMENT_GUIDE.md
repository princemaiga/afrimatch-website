# AfriMatch Website - Deployment Guide

## Pre-Deployment Checklist

Before deploying to production, ensure all items are completed:

**Code Quality**
- All TypeScript errors resolved
- ESLint passing with no warnings
- All tests passing (npm run test)
- Code review completed
- Security audit passed

**Environment Configuration**
- All environment variables configured
- Database migrations tested
- Secrets securely stored in Vercel
- API keys rotated and validated
- Webhook endpoints configured

**Testing**
- End-to-end tests passing
- Payment processing tested with test cards
- Email notifications tested
- Error handling verified
- Performance benchmarks met

---

## Step 1: Prepare Vercel Project

### Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub account
3. Authorize Vercel to access your repositories

### Connect Repository

1. Click "New Project"
2. Select your GitHub repository
3. Configure project settings:
   - **Framework**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

### Configure Environment Variables

In Vercel dashboard, go to Settings → Environment Variables and add:

```
DATABASE_URL=postgresql://user:password@host:port/database
NEXTAUTH_SECRET=<generate-random-string>
NEXTAUTH_URL=https://afrimatch.app
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
FLUTTERWAVE_PUBLIC_KEY=...
FLUTTERWAVE_SECRET_KEY=...
FLUTTERWAVE_WEBHOOK_SECRET=...
SENDGRID_API_KEY=SG....
SENDGRID_FROM_EMAIL=noreply@afrimatch.app
SENTRY_DSN=https://...@sentry.io/...
REDIS_URL=redis://...
NODE_ENV=production
```

---

## Step 2: Set Up Database

### Create PostgreSQL Database

**Option A: Vercel Postgres (Recommended)**

1. In Vercel dashboard, go to Storage
2. Click "Create Database"
3. Select "Postgres"
4. Choose region (closest to your users)
5. Copy connection string to `DATABASE_URL`

**Option B: External Provider (AWS RDS, DigitalOcean, etc.)**

1. Create PostgreSQL database
2. Configure security groups/firewall
3. Set connection string in environment variables
4. Ensure SSL is enabled

### Run Database Migrations

```bash
# Connect to production database
DATABASE_URL=postgresql://... npm run db:push

# Verify migrations
npm run db:verify
```

### Seed Initial Data

```bash
# Seed sample data for courses, jobs, mentors
npm run db:seed
```

---

## Step 3: Configure Payment Gateways

### Stripe Setup

1. Log in to [Stripe Dashboard](https://dashboard.stripe.com)
2. Go to Developers → API Keys
3. Copy Live keys to environment variables
4. Configure webhook endpoints:
   - Go to Developers → Webhooks
   - Add endpoint: `https://afrimatch.app/api/webhooks/stripe`
   - Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Copy signing secret to `STRIPE_WEBHOOK_SECRET`

### Flutterwave Setup

1. Log in to [Flutterwave Dashboard](https://dashboard.flutterwave.com)
2. Go to Settings → API Keys
3. Copy Live keys to environment variables
4. Configure webhook:
   - Go to Settings → Webhooks
   - Add URL: `https://afrimatch.app/api/webhooks/flutterwave`
   - Copy webhook secret to `FLUTTERWAVE_WEBHOOK_SECRET`

---

## Step 4: Configure Email Service

### SendGrid Setup

1. Log in to [SendGrid](https://app.sendgrid.com)
2. Go to Settings → API Keys
3. Create new API key with Mail Send permission
4. Copy to `SENDGRID_API_KEY`
5. Configure sender authentication:
   - Go to Settings → Sender Authentication
   - Verify your domain (SPF/DKIM)
   - Create verified sender email

### Email Templates

Create SendGrid templates for:
- New message notification
- Job application notification
- Mentor request notification
- Match notification
- Course enrollment confirmation
- Article published notification
- Subscription renewal reminder
- Payment failed notification
- Account warning/suspension

---

## Step 5: Configure Monitoring & Error Tracking

### Sentry Setup

1. Create account at [sentry.io](https://sentry.io)
2. Create new project (Next.js)
3. Copy DSN to `SENTRY_DSN`
4. Configure error alerts:
   - Go to Alerts → Create Alert Rule
   - Set conditions for critical errors
   - Configure notification channels

### Analytics

1. Set up Google Analytics 4
2. Add tracking ID to environment
3. Configure custom events
4. Set up conversion tracking

---

## Step 6: Deploy to Vercel

### Deploy from Git

```bash
# Push code to main branch
git add .
git commit -m "Deploy to production"
git push origin main

# Vercel automatically deploys on push
```

### Monitor Deployment

1. Go to Vercel dashboard
2. Watch deployment progress
3. Check build logs for errors
4. Verify preview deployment works

### Promote to Production

1. Once preview passes tests
2. Click "Promote to Production"
3. Verify production domain works
4. Run smoke tests

---

## Step 7: Configure Custom Domain

### Add Domain to Vercel

1. Go to Project Settings → Domains
2. Add custom domain: `afrimatch.app`
3. Update DNS records:
   - Add CNAME: `cname.vercel-dns.com`
   - Or add A records provided by Vercel
4. Wait for DNS propagation (up to 48 hours)

### Enable SSL/TLS

1. Vercel automatically provisions SSL certificate
2. Verify HTTPS works: `https://afrimatch.app`
3. Enable HSTS headers in vercel.json

---

## Step 8: Set Up CDN & Caching

### Cloudflare Setup (Optional)

1. Create account at [cloudflare.com](https://cloudflare.com)
2. Add site and update nameservers
3. Configure caching rules:
   - Cache static assets (images, CSS, JS)
   - Bypass cache for API endpoints
   - Set cache TTL to 24 hours

### Configure Caching Headers

In `vercel.json`, set cache headers:

```json
{
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-cache, no-store, must-revalidate"
        }
      ]
    },
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

---

## Step 9: Run Smoke Tests

### Health Check

```bash
curl https://afrimatch.app/api/health
```

### Test Payment Flow

1. Use Stripe test card: `4242 4242 4242 4242`
2. Complete payment flow
3. Verify webhook received
4. Check database for transaction record
5. Verify confirmation email sent

### Test Email Notifications

1. Send test message between users
2. Verify email notification received
3. Check email content and formatting
4. Verify unsubscribe link works

### Test Authentication

1. Sign up new account
2. Verify email confirmation email sent
3. Complete email verification
4. Log in with credentials
5. Verify session created

---

## Step 10: Post-Deployment Monitoring

### Set Up Alerts

Configure alerts for:
- High error rate (>5% of requests)
- Slow response times (>1 second)
- Database connection failures
- Payment processing failures
- Email delivery failures

### Daily Checks

- [ ] Website loads without errors
- [ ] Login/signup working
- [ ] Payment processing working
- [ ] Email notifications sent
- [ ] Database queries performing well
- [ ] No critical errors in Sentry

### Weekly Reviews

- [ ] Review analytics dashboard
- [ ] Check user feedback
- [ ] Review security logs
- [ ] Verify backups completed
- [ ] Check performance metrics

---

## Rollback Procedure

If critical issues occur after deployment:

### Quick Rollback

```bash
# In Vercel dashboard
1. Go to Deployments
2. Find previous stable deployment
3. Click "Redeploy"
4. Verify production is restored
```

### Database Rollback

```bash
# If database migrations failed
1. Restore from backup
2. Run migrations again
3. Verify data integrity
```

---

## Troubleshooting

### Build Fails

**Check logs**: `npm run build` locally first  
**Clear cache**: Delete `.next` and `node_modules`  
**Update dependencies**: `npm update`

### Payment Webhooks Not Received

**Verify endpoint**: Check webhook URL in Stripe/Flutterwave dashboard  
**Check logs**: Review webhook delivery logs in payment dashboard  
**Verify signature**: Ensure webhook secret is correct

### Email Not Sending

**Check API key**: Verify SendGrid API key is valid  
**Check sender**: Verify sender email is verified in SendGrid  
**Check logs**: Review SendGrid activity log

### Database Connection Issues

**Verify credentials**: Check DATABASE_URL is correct  
**Check firewall**: Ensure IP is whitelisted  
**Test connection**: `psql $DATABASE_URL`

---

## Performance Optimization

### Image Optimization

```bash
# Use Next.js Image component
<Image src="/image.jpg" width={800} height={600} />
```

### Code Splitting

```bash
# Automatic with Next.js
# Verify bundle size: npm run analyze
```

### Database Optimization

```bash
# Add indexes for frequently queried columns
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_messages_user_id ON messages(user_id);
```

---

## Maintenance Schedule

**Daily**: Monitor error logs and performance  
**Weekly**: Review analytics and user feedback  
**Monthly**: Security audit and dependency updates  
**Quarterly**: Full security penetration testing  
**Annually**: Disaster recovery drill

---

**Deployment Completed**: _______________  
**Deployed By**: _______________  
**Verification Status**: ☐ Passed ☐ Failed

---

**Last Updated**: June 2026  
**Next Review**: July 2026
