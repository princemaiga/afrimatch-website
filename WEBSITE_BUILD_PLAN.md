# AfriMatch Website - Complete Build Plan

## Project Overview
Building a production-ready web version of AfriMatch with:
- ✅ Dating mode with matching algorithm
- ✅ Professional networking mode with jobs
- ✅ Integrated Stripe and Flutterwave payments
- ✅ Responsive user dashboard
- ✅ Real-time messaging
- ✅ Multi-language support (African languages)
- ✅ Mobile-responsive design

## Tech Stack
- **Frontend:** Next.js 14, React 19, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, Node.js
- **Database:** PostgreSQL (via Supabase - free tier)
- **Auth:** NextAuth.js
- **Payments:** Stripe + Flutterwave
- **Real-time:** Socket.io
- **State Management:** Zustand
- **Deployment:** Vercel (free tier)

## Project Structure

```
afrimatch-website/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   ├── auth/
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── callback/page.tsx
│   ├── dashboard/
│   │   ├── layout.tsx
│   │   ├── page.tsx            # Main dashboard
│   │   ├── profile/page.tsx
│   │   ├── matches/page.tsx
│   │   ├── messages/page.tsx
│   │   └── settings/page.tsx
│   ├── dating/
│   │   ├── page.tsx            # Dating mode
│   │   ├── browse/page.tsx
│   │   └── profile/[id]/page.tsx
│   ├── jobs/
│   │   ├── page.tsx            # Jobs mode
│   │   ├── browse/page.tsx
│   │   ├── post/page.tsx
│   │   └── recruiter/page.tsx
│   ├── pricing/page.tsx
│   ├── api/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── matches/
│   │   ├── messages/
│   │   ├── payments/
│   │   └── webhooks/
│   └── ...
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Navbar.tsx
│   ├── DatingCard.tsx
│   ├── JobCard.tsx
│   ├── PaymentForm.tsx
│   ├── Dashboard.tsx
│   └── ...
├── lib/
│   ├── db.ts                   # Database connection
│   ├── auth.ts                 # Auth configuration
│   ├── stripe.ts               # Stripe integration
│   ├── flutterwave.ts          # Flutterwave integration
│   ├── matching.ts             # Matching algorithm
│   └── utils.ts
├── public/
│   ├── images/
│   └── icons/
├── styles/
│   └── globals.css
├── .env.local                  # Environment variables
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Development Phases

### Phase 1: Project Setup ✅
- Initialize Next.js project
- Install dependencies
- Configure TypeScript and Tailwind
- Set up environment variables

### Phase 2: Authentication (2-3 hours)
- NextAuth.js setup
- Login/Signup pages
- Social login (Google, Facebook, Apple)
- Session management
- Protected routes

### Phase 3: Dating Mode (4-5 hours)
- User profile creation
- Photo upload
- Matching algorithm
- Browse profiles
- Like/Pass functionality
- Matches management

### Phase 4: Professional Networking (4-5 hours)
- Job posting
- Job browsing
- Recruiter profiles
- Application system
- Company profiles
- Skill-based matching

### Phase 5: Messaging System (3-4 hours)
- Real-time messaging
- Chat interface
- Message history
- Notifications
- Typing indicators

### Phase 6: Payment Integration (3-4 hours)
- Stripe integration
- Flutterwave integration
- Subscription management
- Premium features
- Webhook handling

### Phase 7: User Dashboard (3-4 hours)
- Profile management
- Settings
- Subscription management
- Payment history
- Preferences

### Phase 8: Responsive Design (2-3 hours)
- Mobile optimization
- Tablet optimization
- Desktop optimization
- Cross-browser testing

### Phase 9: Deployment (2-3 hours)
- Vercel deployment
- Domain configuration
- SSL/HTTPS
- Environment variables
- Database setup

### Phase 10: Testing & Launch (2-3 hours)
- End-to-end testing
- Payment testing
- Security testing
- Performance optimization
- Launch preparation

## Timeline
- **Total Development Time:** 30-40 hours
- **With Manus Automation:** 8-12 hours
- **Target Launch:** June 14-20, 2026

## Key Features

### Dating Mode
- ✅ Swipe interface (desktop version)
- ✅ Profile browsing
- ✅ Matching algorithm
- ✅ Like/Pass/Super Like
- ✅ Matches management
- ✅ Photo verification
- ✅ Profile verification

### Professional Networking
- ✅ Job posting
- ✅ Job browsing
- ✅ Recruiter dashboard
- ✅ Company profiles
- ✅ Skill-based matching
- ✅ Application tracking
- ✅ Messaging with recruiters

### Payments
- ✅ Stripe (Global)
- ✅ Flutterwave (Africa)
- ✅ Subscription management
- ✅ Premium features
- ✅ Refund handling
- ✅ Invoice generation

### User Dashboard
- ✅ Profile management
- ✅ Photo gallery
- ✅ Settings
- ✅ Subscription info
- ✅ Payment history
- ✅ Preferences
- ✅ Privacy controls

## Pricing (Synced with App)
- **Dating - Basic:** $5/month
- **Dating - Premium:** $9.99/month
- **Jobs - Recruiter Basic:** $19.99/month
- **Jobs - Recruiter Pro:** $49.99/month
- **Jobs - Company Posting:** $29.99/month
- **Professional - Headhunter:** $39.99/month

## Security Measures
- ✅ HTTPS/SSL
- ✅ Password hashing (bcrypt)
- ✅ JWT tokens
- ✅ CSRF protection
- ✅ Rate limiting
- ✅ Input validation
- ✅ SQL injection prevention
- ✅ XSS protection

## Performance Targets
- ✅ Page load time: < 2 seconds
- ✅ Time to interactive: < 3 seconds
- ✅ Lighthouse score: > 90
- ✅ Mobile performance: > 85

## Compliance
- ✅ GDPR compliant
- ✅ CCPA compliant
- ✅ African data protection laws
- ✅ Age verification (18+)
- ✅ Content moderation
- ✅ Privacy policy
- ✅ Terms of service

## Success Metrics
- ✅ 1,000+ users in first month
- ✅ 10% conversion to premium
- ✅ 99.9% uptime
- ✅ < 1% payment failure rate
- ✅ 4.5+ star rating

## Next Steps
1. Complete Phase 2: Authentication
2. Complete Phase 3: Dating Mode
3. Complete Phase 4: Professional Networking
4. Complete Phase 5: Messaging
5. Complete Phase 6: Payments
6. Complete Phase 7: Dashboard
7. Complete Phase 8: Responsive Design
8. Complete Phase 9: Deployment
9. Complete Phase 10: Testing & Launch
