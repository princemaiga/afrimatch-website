# AfriMatch Webhook Configuration Guide

## Stripe Webhook Setup

### Step 1: Access Stripe Dashboard
1. Go to https://dashboard.stripe.com
2. Navigate to **Developers → Webhooks**
3. Click **Add Endpoint**

### Step 2: Configure Endpoint
- **Endpoint URL**: `https://afrimatch.app/api/webhooks/stripe`
- **API Version**: Latest (Stripe will suggest)

### Step 3: Select Events
Enable the following events:
- `payment_intent.succeeded` - Payment successful
- `payment_intent.payment_failed` - Payment failed
- `payment_intent.canceled` - Payment canceled
- `customer.subscription.created` - Subscription created
- `customer.subscription.updated` - Subscription updated
- `customer.subscription.deleted` - Subscription canceled
- `invoice.payment_succeeded` - Invoice paid
- `invoice.payment_failed` - Invoice payment failed
- `charge.refunded` - Refund processed

### Step 4: Get Signing Secret
- After creating endpoint, copy the **Signing Secret**
- Add to Vercel environment: `STRIPE_WEBHOOK_SECRET`

### Step 5: Test Webhook
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Listen for events
stripe listen --forward-to https://afrimatch.app/api/webhooks/stripe

# Trigger test event
stripe trigger payment_intent.succeeded
```

---

## Flutterwave Webhook Setup

### Step 1: Access Flutterwave Dashboard
1. Go to https://dashboard.flutterwave.com
2. Navigate to **Settings → Webhooks**

### Step 2: Configure Webhook
- **Webhook URL**: `https://afrimatch.app/api/webhooks/flutterwave`
- **Webhook Secret**: Generate a strong secret (or use provided)

### Step 3: Select Events
Enable all events:
- `charge.completed` - Payment successful
- `charge.failed` - Payment failed
- `charge.reversed` - Payment reversed
- `subscription.created` - Subscription created
- `subscription.updated` - Subscription updated
- `subscription.cancelled` - Subscription canceled

### Step 4: Save Configuration
- Copy the Webhook Secret
- Add to Vercel environment: `FLUTTERWAVE_WEBHOOK_SECRET`

### Step 5: Test Webhook
Use Flutterwave test credentials:
- Test Public Key: Available in Flutterwave dashboard
- Test Secret Key: Available in Flutterwave dashboard

---

## Webhook Verification

### Stripe Verification
The webhook handler verifies Stripe signatures using:
```typescript
const sig = req.headers['stripe-signature'];
const event = stripe.webhooks.constructEvent(
  body,
  sig,
  process.env.STRIPE_WEBHOOK_SECRET
);
```

### Flutterwave Verification
The webhook handler verifies Flutterwave signatures using:
```typescript
const signature = req.headers['verif-hash'];
const hash = crypto
  .createHmac('sha256', process.env.FLUTTERWAVE_WEBHOOK_SECRET)
  .update(body)
  .digest('hex');
```

---

## Webhook Event Handlers

### Stripe Events

**payment_intent.succeeded**
- Update subscription status to active
- Send confirmation email
- Log transaction

**payment_intent.payment_failed**
- Update subscription status to failed
- Send failure notification
- Retry payment

**customer.subscription.deleted**
- Update subscription status to canceled
- Revoke premium features
- Send cancellation email

### Flutterwave Events

**charge.completed**
- Update subscription status to active
- Send confirmation email
- Log transaction

**charge.failed**
- Update subscription status to failed
- Send failure notification
- Retry payment

**subscription.cancelled**
- Update subscription status to canceled
- Revoke premium features
- Send cancellation email

---

## Monitoring Webhooks

### Stripe Webhook Monitoring
1. Go to Stripe Dashboard → Developers → Webhooks
2. Click on endpoint
3. View recent events and responses
4. Check for any failed attempts

### Flutterwave Webhook Monitoring
1. Go to Flutterwave Dashboard → Settings → Webhooks
2. View webhook logs
3. Check delivery status and responses

---

## Troubleshooting

### Webhook Not Firing
- Verify endpoint URL is correct
- Check firewall/security rules
- Verify signing secret is correct
- Check server logs for errors

### Webhook Signature Verification Failed
- Verify signing secret matches
- Check request body encoding
- Ensure raw body is used (not parsed)

### Webhook Timeout
- Verify server is responding within 30 seconds
- Check database connection
- Optimize webhook handler performance

---

## Testing Checklist

- [ ] Stripe webhook endpoint created
- [ ] Flutterwave webhook endpoint created
- [ ] Signing secrets configured in Vercel
- [ ] Test payment successful
- [ ] Test payment failed
- [ ] Test subscription created
- [ ] Test subscription updated
- [ ] Test subscription canceled
- [ ] Email notifications sent
- [ ] Database records updated
- [ ] Webhook logs reviewed
- [ ] Error handling tested

---

**Status**: READY FOR PRODUCTION ✅
