# AfriMatch Implementation Guide

## Overview

This guide covers the complete implementation of AfriMatch's dual-mode system, payment integration, and real-time messaging features.

---

## 1. Dual-Mode Signup Flow

### File: `app/auth/signup/page.tsx`

The signup flow now includes three distinct steps:

**Step 1: Mode Selection**
Users choose between Dating, Professional, or Dual Mode. Each mode has different pricing and features.

**Step 2: Authentication**
Users authenticate via email, phone (OTP), Google, or Facebook. The selected mode is passed to the backend.

**Step 3: Email Verification**
Users verify their email address before accessing the platform.

### Implementation Details

```typescript
// Mode selection state
const [step, setStep] = useState<"mode" | "auth" | "verification">("mode");
const [selectedMode, setSelectedMode] = useState<"dating" | "professional" | "both" | null>(null);

// When user selects a mode
const handleModeSelect = (mode: "dating" | "professional" | "both") => {
  setSelectedMode(mode);
  setStep("auth");
};

// Mode is passed to signup API
const response = await fetch("/api/auth/signup", {
  method: "POST",
  body: JSON.stringify({ email, password, mode: selectedMode }),
});
```

---

## 2. Payment Integration

### Stripe Integration

**File**: `app/api/payments/stripe/route.ts`

Handles subscription creation and webhook verification.

**Key Features**:
- Creates Stripe checkout sessions
- Supports multiple pricing plans
- Handles subscription updates and cancellations
- Webhook verification for payment events

**Usage**:
```typescript
const response = await fetch("/api/payments/stripe", {
  method: "POST",
  body: JSON.stringify({
    planId: "premium_dating",
    mode: "dating",
  }),
});

// Redirect to Stripe checkout
window.location.href = response.data.url;
```

### Flutterwave Integration

**File**: `app/api/payments/flutterwave/route.ts`

Handles payments for African users with local payment methods.

**Key Features**:
- Multi-currency support (NGN, ZAR, KES, GHS, USD)
- Mobile money integration
- Bank transfer support
- USSD payments

**Usage**:
```typescript
const response = await fetch("/api/payments/flutterwave", {
  method: "POST",
  body: JSON.stringify({
    planId: "premium_dating",
    mode: "dating",
    currency: "NGN",
    phoneNumber: "+234...",
  }),
});

// Redirect to Flutterwave payment link
window.location.href = response.data.link;
```

---

## 3. Real-Time Messaging

### WebSocket Setup

**File**: `lib/messaging.ts`

Implements real-time messaging with WebSocket support.

**Key Features**:
- WebSocket connection management
- Automatic reconnection with exponential backoff
- Message encryption (basic)
- Typing indicators
- Message reactions
- Read receipts

**Usage**:
```typescript
// Initialize messaging service
const messagingService = new MessagingService(userId);

// Connect to WebSocket
messagingService.connect(
  (data) => {
    // Handle incoming messages
    if (data.type === "message") {
      addMessage(data);
    }
  },
  (error) => {
    console.error("Connection error:", error);
  }
);

// Send a message
messagingService.sendMessage(recipientId, "Hello!", "text");

// Send typing indicator
messagingService.sendTypingIndicator(recipientId, true);

// Add reaction
messagingService.addReaction(messageId, "❤️");
```

### Chat Interface Component

**File**: `app/dashboard/chat-interface.tsx`

Provides a complete chat UI with:
- Message display with timestamps
- Typing indicators
- Emoji reactions
- Read receipts
- Emoji picker
- File attachment support (coming soon)

---

## 4. Mode Switching

### Mode Switcher Component

**File**: `app/dashboard/mode-switcher.tsx`

Allows users to switch between Dating and Professional modes.

**Features**:
- Visual mode indicators
- Mode-specific information cards
- Smooth transitions
- API integration for mode persistence

**Usage**:
```typescript
<ModeSwitcher
  currentMode="dating"
  onModeChange={(mode) => {
    // Handle mode change
    console.log(`Switched to ${mode} mode`);
  }}
/>
```

### API Endpoint

**File**: `app/api/user/mode/route.ts`

**GET**: Retrieve user's current mode and available modes
**PUT**: Switch user to a different mode

---

## 5. Subscription Plans

### Pricing Page

**File**: `app/pricing/page.tsx`

Displays all subscription plans with:
- Mode selector (Dating, Professional, Dual)
- Billing cycle toggle (Monthly/Yearly)
- Plan comparison cards
- FAQ section
- CTA buttons

**Plan Structure**:
```typescript
const plans = {
  dating: [
    { name: "Basic", price: 5, planId: "basic_dating" },
    { name: "Premium", price: 9.99, planId: "premium_dating" },
    { name: "VIP", price: 19.99, planId: "vip_dating" },
  ],
  professional: [
    { name: "Basic", price: 19.99, planId: "basic_professional" },
    { name: "Pro", price: 49.99, planId: "pro_professional" },
    { name: "Enterprise", price: 99.99, planId: "enterprise_professional" },
  ],
  both: [
    { name: "Basic", price: 12.99, planId: "dual_basic" },
    { name: "Premium", price: 24.99, planId: "dual_premium" },
  ],
};
```

---

## 6. Database Schema (Recommended)

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  phone VARCHAR(20),
  password_hash VARCHAR(255),
  date_of_birth DATE,
  country VARCHAR(2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### User Modes Table
```sql
CREATE TABLE user_modes (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  mode ENUM('dating', 'professional', 'both'),
  current_mode ENUM('dating', 'professional'),
  dating_profile_id UUID,
  professional_profile_id UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Subscriptions Table
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  plan_id VARCHAR(50),
  mode ENUM('dating', 'professional', 'both'),
  status ENUM('active', 'cancelled', 'expired'),
  stripe_subscription_id VARCHAR(255),
  flutterwave_subscription_id VARCHAR(255),
  started_at TIMESTAMP,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Messages Table
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY,
  sender_id UUID REFERENCES users(id),
  recipient_id UUID REFERENCES users(id),
  content TEXT,
  type ENUM('text', 'image', 'voice'),
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 7. Environment Variables

Create a `.env.local` file with:

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Stripe
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Flutterwave
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST_...
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST_...

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/afrimatch

# OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
FACEBOOK_APP_ID=...
FACEBOOK_APP_SECRET=...

# Twilio (for phone OTP)
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=...
```

---

## 8. Deployment Checklist

- [ ] Set up PostgreSQL database
- [ ] Configure all environment variables
- [ ] Set up Stripe webhooks
- [ ] Set up Flutterwave webhooks
- [ ] Configure OAuth providers
- [ ] Set up email service (SendGrid/Mailgun)
- [ ] Configure Twilio for phone OTP
- [ ] Set up WebSocket server
- [ ] Configure CORS for WebSocket
- [ ] Set up SSL/TLS certificates
- [ ] Configure CDN for images
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Set up CI/CD pipeline

---

## 9. Testing

### Unit Tests
```bash
npm run test
```

### Integration Tests
```bash
npm run test:integration
```

### E2E Tests
```bash
npm run test:e2e
```

---

## 10. Performance Optimization

### Image Optimization
- Use Next.js Image component
- Implement lazy loading
- Use WebP format with fallbacks

### Database Optimization
- Add indexes on frequently queried columns
- Implement connection pooling
- Use query caching

### Frontend Optimization
- Code splitting with dynamic imports
- Implement service workers for offline support
- Use React.memo for expensive components

---

## 11. Security Best Practices

- Validate all user inputs
- Use HTTPS everywhere
- Implement rate limiting
- Use CSRF tokens
- Sanitize HTML content
- Implement proper authentication
- Use secure password hashing
- Implement account lockout after failed attempts
- Use environment variables for secrets
- Implement audit logging

---

## 12. Monitoring & Analytics

### Key Metrics to Track
- User signup and retention
- Subscription conversion rate
- Payment success rate
- Message delivery rate
- WebSocket connection stability
- API response times
- Error rates

### Tools
- Google Analytics for web traffic
- Sentry for error tracking
- DataDog for performance monitoring
- Stripe Dashboard for payment analytics

---

## 13. Support & Troubleshooting

### Common Issues

**WebSocket Connection Fails**
- Check CORS configuration
- Verify WebSocket server is running
- Check firewall rules

**Payment Integration Issues**
- Verify API keys are correct
- Check webhook endpoints are accessible
- Review payment provider logs

**Mode Switching Not Working**
- Check user authentication
- Verify database connection
- Review API logs

---

## 14. Future Enhancements

- AI-powered match recommendations
- Video verification for enhanced safety
- Group video calls
- Skill-based job matching
- Mentorship program
- Community forums
- Mobile app native features

---

**Last Updated**: June 2026
**Version**: 1.0.0
