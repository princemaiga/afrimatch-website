# 🚀 Deploy AfriMatch Live Using Your Namecheap Domain - SUPER SIMPLE GUIDE

**Your domain `AfriMatch.app` is already on Namecheap - we just need to connect it to Vercel!**

---

## ✅ What You Already Have

- ✅ Domain: `AfriMatch.app` (on Namecheap)
- ✅ Website code: Ready on GitHub
- ✅ Payment systems: Stripe & Flutterwave accounts
- ✅ Email system: SendGrid account

**All we need to do now is:**
1. Put the website on Vercel
2. Connect your Namecheap domain to Vercel
3. Add secret passwords
4. Test everything

---

## 📋 STEP-BY-STEP GUIDE (UPDATED FOR NAMECHEAP)

### PART 1: Get Your Vercel Account Ready (5 minutes)

**Step 1: Go to Vercel Website**
1. Open your web browser
2. Type: `https://vercel.com`
3. Press Enter

**Step 2: Sign Up or Log In**
1. Click "Sign Up" or "Log In"
2. Use your email and password
3. You're in!

---

### PART 2: Import Your AfriMatch Project (10 minutes)

**Step 3: Click "Add New"**
1. Look at the top of the page
2. Find "Add New" button
3. Click it
4. Click "Project"

**Step 4: Import Your Code**
1. Click "Import Git Repository"
2. In the box, paste: `https://github.com/[YOUR-USERNAME]/afrimatch-website`
   - Replace `[YOUR-USERNAME]` with your actual GitHub username
3. Click "Continue"
4. Find "afrimatch-website" in the list
5. Click on it
6. Click "Import"

**Step 5: Deploy**
1. You'll see a form with settings
2. Most things are already correct
3. Just click "Deploy" at the bottom
4. Wait for it to finish (about 2-5 minutes)

---

### PART 3: Add Secret Information (Environment Variables) (10 minutes)

**Step 6: Go to Settings**
1. After deployment finishes, click "Settings" at the top
2. On the left side, click "Environment Variables"

**Step 7: Add All Secrets**

For each secret below:
1. Click "Add New"
2. Type the name in the "Name" box
3. Paste the value in the "Value" box
4. Click "Save"

**Here are ALL the secrets to add:**

#### 🔐 Database
- **Name**: `DATABASE_URL`
- **Value**: `postgresql://user:password@host:port/database` (ask your database provider)

#### 🔐 Authentication
- **Name**: `NEXTAUTH_SECRET`
- **Value**: Open terminal and type: `openssl rand -base64 32` - copy the result
- **Name**: `NEXTAUTH_URL`
- **Value**: `https://afrimatch.app`

#### 💳 Stripe Payments
- **Name**: `STRIPE_PUBLIC_KEY`
- **Value**: Go to Stripe.com → Developers → API Keys → Copy "Publishable key"
- **Name**: `STRIPE_SECRET_KEY`
- **Value**: Go to Stripe.com → Developers → API Keys → Copy "Secret key"
- **Name**: `STRIPE_WEBHOOK_SECRET`
- **Value**: Go to Stripe.com → Developers → Webhooks → Copy "Signing secret"

#### 💳 Flutterwave Payments
- **Name**: `FLUTTERWAVE_PUBLIC_KEY`
- **Value**: Go to Flutterwave.com → Settings → API Keys → Copy "Public Key"
- **Name**: `FLUTTERWAVE_SECRET_KEY`
- **Value**: Go to Flutterwave.com → Settings → API Keys → Copy "Secret Key"
- **Name**: `FLUTTERWAVE_WEBHOOK_SECRET`
- **Value**: Go to Flutterwave.com → Settings → Webhooks → Copy "Webhook Secret"

#### 📧 SendGrid Email
- **Name**: `SENDGRID_API_KEY`
- **Value**: Go to SendGrid.com → Settings → API Keys → Create new key → Copy it
- **Name**: `SENDGRID_FROM_EMAIL`
- **Value**: `noreply@afrimatch.app`

#### 📱 Twilio SMS
- **Name**: `TWILIO_ACCOUNT_SID`
- **Value**: Go to Twilio.com → Console → Copy "Account SID"
- **Name**: `TWILIO_AUTH_TOKEN`
- **Value**: Go to Twilio.com → Console → Copy "Auth Token"
- **Name**: `TWILIO_PHONE_NUMBER`
- **Value**: Your Twilio phone number (like +1234567890)

#### 🔍 Analytics
- **Name**: `GOOGLE_ANALYTICS_ID`
- **Value**: Go to Google Analytics → Admin → Property ID
- **Name**: `SENTRY_DSN`
- **Value**: Go to Sentry.io → Project Settings → Copy "DSN"

#### 🌍 Other
- **Name**: `NODE_ENV`
- **Value**: `production`
- **Name**: `REDIS_URL`
- **Value**: Ask your Redis provider

---

### PART 4: Connect Your Namecheap Domain to Vercel (10 minutes)

**⚠️ IMPORTANT: This is the key step to make AfriMatch.app work!**

**Step 8: Add Domain in Vercel**
1. Go back to your Vercel project
2. Click "Settings" at the top
3. On the left, find "Domains"
4. Click on it
5. Click "Add Domain"
6. Type: `afrimatch.app` (exactly like this)
7. Click "Add"

**Step 9: Vercel Will Show You DNS Records**
1. Vercel will show you 2-4 DNS records
2. **Copy these records - you'll need them in the next step**
3. The records will look like:
   - Type: `A` | Value: `76.76.19.165`
   - Type: `CNAME` | Value: `cname.vercel-dns.com`
   - Or similar

**Step 10: Go to Namecheap and Add DNS Records**
1. Open a new tab
2. Go to Namecheap.com
3. Log in to your account
4. Click "Domain List" (or find your domains)
5. Find `afrimatch.app`
6. Click the "Manage" button next to it

**Step 11: Find DNS Settings in Namecheap**
1. Look for a tab that says "DNS" or "Advanced DNS"
2. Click on it
3. You should see a list of DNS records

**Step 12: Add Vercel's DNS Records**
1. Look for a button that says "Add New Record" or "Add Record"
2. For each record that Vercel showed you:
   - Click "Add New Record"
   - In "Type" dropdown, select the type (A, CNAME, etc.)
   - In "Host" box, type `@` (or `www` if it says so)
   - In "Value" box, paste the value from Vercel
   - Click the checkmark to save
3. Repeat for all records Vercel gave you

**Step 13: Wait for DNS to Update**
1. This usually takes 24-48 hours
2. Don't worry - this is normal
3. You can check if it's working by:
   - Opening your browser
   - Typing: `https://afrimatch.app`
   - If you see your website, it worked! 🎉

**Step 14: Verify in Vercel**
1. Go back to Vercel
2. Go to Settings → Domains
3. You should see `afrimatch.app` with a status
4. Wait for it to show "Valid" (green checkmark)
5. This means it's connected!

---

### PART 5: Set Up Payment Webhooks (10 minutes)

**Webhooks tell Stripe/Flutterwave to send payment info to your website.**

#### For Stripe:

**Step 15: Go to Stripe Webhooks**
1. Go to Stripe.com
2. Click "Developers" at the top
3. Click "Webhooks"
4. Click "Add Endpoint"
5. In "Endpoint URL" box, type: `https://afrimatch.app/api/webhooks/stripe`
6. Click "Select events to send"
7. Check these boxes:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
8. Click "Add Endpoint"
9. You'll see "Signing Secret" - copy it
10. Go back to Vercel and add it as `STRIPE_WEBHOOK_SECRET` (you already did this in Part 3)

#### For Flutterwave:

**Step 16: Go to Flutterwave Webhooks**
1. Go to Flutterwave.com
2. Click "Settings"
3. Click "Webhooks"
4. In "Webhook URL" box, type: `https://afrimatch.app/api/webhooks/flutterwave`
5. Click "Save"
6. You'll see "Webhook Secret" - copy it
7. Go back to Vercel and add it as `FLUTTERWAVE_WEBHOOK_SECRET` (you already did this in Part 3)

---

### PART 6: Test That Everything Works (5 minutes)

**Step 17: Visit Your Website**
1. Open your browser
2. Type: `https://afrimatch.app`
3. You should see your AfriMatch website!
4. If you see an error, wait a bit longer (DNS can take 24-48 hours)

**Step 18: Test Basic Functions**
1. Click around the website
2. Try signing up
3. Try logging in
4. Look for any error messages
5. If everything works, great! ✅

---

### PART 7: Test Payments (5 minutes)

**Step 19: Test Stripe Payment**
1. Go to your website
2. Try to buy a subscription
3. Use this test card: `4242 4242 4242 4242`
4. Expiry: `12/25`
5. CVC: `123`
6. Click "Pay"
7. It should say "Payment successful" ✅

**Step 20: Test Flutterwave Payment**
1. Go to your website
2. Try to buy a subscription
3. Use this test card: `5531 8866 5214 2950`
4. Expiry: `09/32`
5. CVV: `564`
6. Click "Pay"
7. It should say "Payment successful" ✅

**Step 21: Check Stripe Dashboard**
1. Go to Stripe.com
2. Click "Developers"
3. Click "Webhooks"
4. Find your webhook
5. Click on it
6. Scroll down to "Recent Events"
7. You should see `payment_intent.succeeded` ✅

**Step 22: Check Flutterwave Dashboard**
1. Go to Flutterwave.com
2. Click "Settings"
3. Click "Webhooks"
4. Look for "Recent Deliveries"
5. You should see successful deliveries ✅

---

### PART 8: Test Email System (5 minutes)

**Step 23: Test Email**
1. Go to your website
2. Sign up with a real email address
3. Check your email inbox
4. You should see a verification email
5. If you don't see it, check spam folder
6. If you see it, your email system works! ✅

---

### PART 9: Monitor Your Website (Ongoing)

**Step 24: Check Google Analytics**
1. Go to Google Analytics
2. Click "Real-time"
3. You should see visitors
4. If you see numbers, people are visiting! 🎉

**Step 25: Check Vercel Dashboard**
1. Go to Vercel.com
2. Click on your project
3. Look at "Deployments"
4. You should see your latest deployment with a green checkmark
5. If it's green, your website is live! ✅

---

## 🎉 YOU DID IT!

Your website is now LIVE at `https://afrimatch.app`!

---

## ✅ Success Checklist

Before celebrating, check all these:

- [ ] Website is live at https://afrimatch.app
- [ ] Website loads without errors
- [ ] Buttons and links work
- [ ] Sign up works
- [ ] Login works
- [ ] Stripe payment test worked
- [ ] Flutterwave payment test worked
- [ ] Verification emails are being sent
- [ ] Webhook events showing in Stripe
- [ ] Webhook events showing in Flutterwave
- [ ] Google Analytics shows visitors
- [ ] Vercel shows green checkmark

**If all boxes are checked, you're done! 🎉**

---

## 📱 What Happens Next?

1. **Tell people** - Post on social media
2. **Watch for problems** - Check daily
3. **Fix bugs** - Fix quickly if something breaks
4. **Add features** - Make it better
5. **Grow users** - Get more people to sign up

---

## 💡 Key Differences from Generic Guide

**You already have:**
- ✅ Domain on Namecheap (don't need to buy)
- ✅ Just need to connect DNS records
- ✅ Everything else is the same

**What to do:**
1. Deploy to Vercel (Steps 1-3)
2. Add environment variables (Step 3)
3. **Connect Namecheap domain to Vercel (Steps 8-14)** ← This is the new part
4. Set up webhooks (Steps 15-16)
5. Test everything (Steps 17-25)

---

## 🆘 Troubleshooting

**Problem: Website shows "Domain not found"**
- Solution: Wait 24-48 hours for DNS to update
- Check that you added all DNS records correctly in Namecheap
- Verify records in Vercel show "Valid"

**Problem: DNS records not working**
- Solution: Go back to Namecheap and double-check the values
- Make sure you copied them exactly from Vercel
- Wait another 24 hours and try again

**Problem: Website shows error after 48 hours**
- Solution: Go to Vercel → Deployments → Check for errors
- Go to Namecheap → DNS → Verify all records are there
- Contact Vercel support if still broken

**Problem: Payments not working**
- Solution: Check Stripe/Flutterwave webhooks are configured
- Verify webhook URLs are exactly: `https://afrimatch.app/api/webhooks/stripe` and `/flutterwave`
- Test payment again

**Problem: Emails not sending**
- Solution: Check SendGrid API key is correct
- Verify `SENDGRID_FROM_EMAIL` is set to `noreply@afrimatch.app`
- Check spam folder

---

## 📞 Remember

- Your domain `AfriMatch.app` is already yours on Namecheap
- You just need to point it to Vercel using DNS records
- This is like telling the internet "when someone types AfriMatch.app, show them my Vercel website"
- It takes 24-48 hours for the internet to know about the change (this is normal)
- After that, your website is live forever!

---

**Congratulations! You're about to launch AfriMatch! 🚀**

---

*If you get stuck, just follow the steps one by one. You've got this!*
