# AfriMatch Website - Vercel Deployment Guide (FINAL)

## Phase 1: Vercel Project Setup

### Step 1: Create Vercel Project
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to Vercel
vercel --prod
```

### Step 2: Configure Environment Variables in Vercel Dashboard

Go to **Project Settings → Environment Variables** and add:

#### Database
- `DATABASE_URL`: PostgreSQL connection string (use Vercel Postgres)
  - Format: `postgresql://user:password@host:port/database`

#### Authentication
- `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
- `NEXTAUTH_URL`: `https://afrimatch.app`

#### Stripe Payment
- `STRIPE_PUBLIC_KEY`: From Stripe Dashboard → Developers → API Keys
- `STRIPE_SECRET_KEY`: From Stripe Dashboard → Developers → API Keys (Secret)
- `STRIPE_WEBHOOK_SECRET`: From Stripe Dashboard → Developers → Webhooks (Signing Secret)

#### Flutterwave Payment
- `FLUTTERWAVE_PUBLIC_KEY`: From Flutterwave Dashboard → Settings → API Keys
- `FLUTTERWAVE_SECRET_KEY`: From Flutterwave Dashboard → Settings → API Keys (Secret)
- `FLUTTERWAVE_WEBHOOK_SECRET`: From Flutterwave Dashboard → Settings → Webhooks

#### Email (SendGrid)
- `SENDGRID_API_KEY`: From SendGrid Dashboard → Settings → API Keys
- `SENDGRID_FROM_EMAIL`: `noreply@afrimatch.app`

#### SMS (Twilio)
- `TWILIO_ACCOUNT_SID`: From Twilio Console
- `TWILIO_AUTH_TOKEN`: From Twilio Console
- `TWILIO_PHONE_NUMBER`: Your Twilio phone number

#### Error Tracking (Sentry)
- `SENTRY_DSN`: From Sentry Project → Settings → Client Keys (DSN)

#### Analytics
- `GOOGLE_ANALYTICS_ID`: From Google Analytics → Admin → Property Settings
- `MIXPANEL_TOKEN`: From Mixpanel → Project Settings
- `AMPLITUDE_API_KEY`: From Amplitude → Settings → Projects

#### Caching
- `REDIS_URL`: From Vercel Redis or external Redis provider

#### Node Environment
- `NODE_ENV`: `production`

---

## Phase 2: Database Setup

### Step 1: Create Vercel Postgres Database
1. Go to Vercel Dashboard → Storage → Create Database
2. Select PostgreSQL
3. Copy the connection string to `DATABASE_URL`

### Step 2: Run Database Migrations
```bash
# Install Prisma CLI
npm install -D prisma

# Run migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate
```

### Step 3: Seed Initial Data (Optional)
```bash
npx prisma db seed
```

---

## Phase 3: Payment Webhook Configuration

### Stripe Webhook Setup
1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add Endpoint"
3. Endpoint URL: `https://afrimatch.app/api/webhooks/stripe`
4. Events to send:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy Signing Secret to `STRIPE_WEBHOOK_SECRET`

### Flutterwave Webhook Setup
1. Go to Flutterwave Dashboard → Settings → Webhooks
2. Webhook URL: `https://afrimatch.app/api/webhooks/flutterwave`
3. Events: All events
4. Copy Webhook Secret to `FLUTTERWAVE_WEBHOOK_SECRET`

---

## Phase 4: Custom Domain Configuration

### Step 1: Add Custom Domain in Vercel
1. Go to Vercel Dashboard → Project Settings → Domains
2. Click "Add Domain"
3. Enter: `afrimatch.app`
4. Vercel will provide DNS records

### Step 2: Update DNS Records
Go to your domain registrar (GoDaddy, Namecheap, etc.) and add:
- **CNAME Record**: `afrimatch.app` → `cname.vercel-dns.com`
- **TXT Record**: For domain verification (provided by Vercel)

### Step 3: Wait for DNS Propagation
- DNS propagation can take 24-48 hours
- Check status: `nslookup afrimatch.app`

---

## Phase 5: SSL/TLS Certificate

Vercel automatically provisions SSL certificates via Let's Encrypt. No manual configuration needed.

---

## Phase 6: Pre-Launch Testing

### Test Payment Processing
```bash
# Stripe Test Mode
- Use test card: 4242 4242 4242 4242
- Expiry: Any future date
- CVC: Any 3 digits

# Flutterwave Test Mode
- Test card: 5531 8866 5214 2950
- Expiry: 09/32
- CVV: 564
```

### Test Email Notifications
- Sign up with test email
- Verify email delivery from SendGrid

### Test SMS Notifications
- Verify SMS delivery from Twilio

### Test Analytics
- Check Google Analytics for events
- Verify Mixpanel and Amplitude tracking

### Test Webhooks
- Use Stripe CLI for local testing:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## Phase 7: Monitoring & Alerts

### Set Up Monitoring
1. **Vercel Analytics**: Enabled by default
2. **Sentry**: Errors automatically tracked
3. **UptimeRobot**: Monitor uptime
   - Add monitor for `https://afrimatch.app`
   - Set alert email

### Configure Alerts
- Vercel: Project Settings → Alerts
- Sentry: Project → Alerts & Integrations
- UptimeRobot: Monitors → Alerts

---

## Phase 8: Performance Optimization

### Enable Caching
- Static assets: 1 year cache
- API responses: 60 seconds cache
- HTML pages: No cache (always fresh)

### Enable Compression
- Gzip compression: Automatic (Vercel)
- Brotli compression: Automatic (Vercel)

### Monitor Performance
- Vercel Analytics: Real-time metrics
- Lighthouse: Target > 80 score
- PageSpeed Insights: Monitor regularly

---

## Phase 9: Security Hardening

### SSL/TLS
- ✅ Automatic via Let's Encrypt
- HSTS enabled: max-age=31536000

### Security Headers
- ✅ X-Frame-Options: SAMEORIGIN
- ✅ X-Content-Type-Options: nosniff
- ✅ X-XSS-Protection: 1; mode=block
- ✅ Referrer-Policy: strict-origin-when-cross-origin

### Rate Limiting
- ✅ 100 requests per minute per IP
- ✅ 10 requests per second per user

### Input Validation
- ✅ All forms validated server-side
- ✅ SQL injection prevention via Prisma ORM
- ✅ XSS protection via React escaping

---

## Phase 10: Go-Live Checklist

- [ ] All environment variables configured in Vercel
- [ ] Database migrations completed
- [ ] Payment webhooks tested and active
- [ ] Custom domain configured and DNS propagated
- [ ] SSL certificate active
- [ ] Email notifications working
- [ ] SMS notifications working
- [ ] Analytics tracking active
- [ ] Error tracking (Sentry) active
- [ ] Monitoring and alerts configured
- [ ] Performance optimized (Lighthouse > 80)
- [ ] Security headers verified
- [ ] Rate limiting active
- [ ] Backup strategy in place
- [ ] Disaster recovery plan documented

---

## Phase 11: Post-Launch Monitoring

### First 24 Hours
- Monitor error rates (target < 1%)
- Monitor response times (target < 500ms)
- Monitor payment processing (target 99.9% success)
- Monitor email delivery (target > 95%)

### First Week
- Monitor user acquisition
- Monitor conversion rates
- Monitor churn rate
- Monitor revenue

### Ongoing
- Daily monitoring dashboard review
- Weekly performance review
- Monthly security audit
- Quarterly disaster recovery test

---

## Phase 12: Rollback Plan

If critical issues occur:

```bash
# Revert to previous deployment
vercel rollback

# Or manually redeploy from git
vercel --prod --force
```

---

## Support & Troubleshooting

### Common Issues

**502 Bad Gateway**
- Check database connection
- Check API server status
- Review Vercel logs

**Payment Webhook Not Firing**
- Verify webhook URL in Stripe/Flutterwave
- Check webhook signing secret
- Review server logs

**Emails Not Sending**
- Verify SendGrid API key
- Check email domain reputation
- Review SendGrid logs

**Analytics Not Tracking**
- Verify Google Analytics ID
- Check network requests
- Review browser console

---

## Contact & Support

- Vercel Support: https://vercel.com/support
- Stripe Support: https://support.stripe.com
- SendGrid Support: https://support.sendgrid.com
- Twilio Support: https://support.twilio.com

---

**Deployment Status**: READY FOR GO-LIVE ✅
**Last Updated**: June 2026
**Status**: APPROVED FOR PRODUCTION
