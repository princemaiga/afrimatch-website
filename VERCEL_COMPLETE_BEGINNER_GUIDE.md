# 🚀 VERCEL DEPLOYMENT - COMPLETE BEGINNER GUIDE
## Every Single Click Explained (No Tech Knowledge Needed)

---

## 📚 WHAT IS VERCEL? (Simple Explanation)

Think of it like this:
- **Your computer** = Your toy in your room
- **Vercel** = A toy store that keeps your toy on display 24/7
- **Your website** = The toy that people can see and play with anytime

Vercel puts your website on the internet so people can visit it anytime, anywhere.

---

## 📚 WHAT ARE WEBHOOKS? (Simple Explanation)

Think of it like this:
- **Webhook** = A phone call from Stripe/Flutterwave to your website
- **When someone pays** = Stripe calls your website and says "Hey! Someone paid $10!"
- **Your website receives the call** = Your website records the payment and sends a confirmation email
- **Without webhooks** = Your website wouldn't know when payments happened

**In simple terms**: Webhooks are like text message notifications. When someone pays, Stripe sends a text to your website saying "Payment received!"

---

## ⏱️ TIME REQUIRED
- **Part 1 (Vercel Setup)**: 5 minutes
- **Part 2 (Import Project)**: 10 minutes
- **Part 3 (Add Secrets)**: 15 minutes
- **Part 4 (Connect Domain)**: 10 minutes
- **Part 5 (Setup Webhooks)**: 20 minutes
- **Part 6 (Testing)**: 20 minutes

**TOTAL**: About 80 minutes

---

# 🎯 STEP-BY-STEP GUIDE

## PART 1: CREATE VERCEL ACCOUNT (5 minutes)

### Step 1: Open Your Browser
1. Click on your web browser (Chrome, Safari, Firefox, Edge, etc.)
2. You should see a blank page or your home page

### Step 2: Go to Vercel Website
1. Click on the address bar at the top (where it shows the website name)
2. Delete anything that's there
3. Type exactly: `https://vercel.com`
4. Press Enter on your keyboard
5. Wait 3-5 seconds for the page to load
6. You should see a website that says "Vercel" at the top

### Step 3: Sign Up
1. Look at the top right of the page
2. You should see a button that says "Sign Up" or "Get Started"
3. Click on it
4. You'll see a page asking how you want to sign up
5. Look for options like:
   - "Continue with GitHub"
   - "Continue with GitLab"
   - "Continue with Bitbucket"
   - Or "Email"

**IMPORTANT**: If you have a GitHub account, click "Continue with GitHub" (easiest option)

### Step 4: Sign In With GitHub
1. If you clicked "Continue with GitHub":
   - You'll see a GitHub login page
   - Enter your GitHub username and password
   - Click "Sign in"
   - You might see a page asking "Authorize Vercel"
   - Click "Authorize"

2. If you don't have GitHub:
   - Click "Email"
   - Enter your email address
   - Create a password
   - Click "Sign Up"

### Step 5: Complete Setup
1. You might see some questions about your project
2. Just click "Skip" or "Continue" through them
3. You should now see your Vercel Dashboard
4. It should say "Welcome to Vercel" or show a blank project list

**✅ You're now on Vercel!**

---

## PART 2: IMPORT YOUR AFRIMATCH PROJECT (10 minutes)

### Step 6: Click "Add New"
1. Look at the top of the Vercel Dashboard
2. You should see a button that says "Add New" or "+ New Project"
3. Click on it
4. A menu will pop up with options like:
   - "Project"
   - "Organization"
   - "Team"
5. Click "Project"

### Step 7: Import Git Repository
1. You'll see a page that says "Import Git Repository"
2. You should see a text box with placeholder text
3. Click in the text box
4. You need to paste your GitHub repository URL
5. The URL should look like: `https://github.com/YOUR-USERNAME/afrimatch-website`
   - Replace `YOUR-USERNAME` with your actual GitHub username
   - For example: `https://github.com/john123/afrimatch-website`
6. Paste it in the box
7. Click "Continue" button

### Step 8: Select Your Repository
1. You'll see a list of repositories
2. Find "afrimatch-website" in the list
3. Click on it
4. You should see it highlighted/selected
5. Click "Import" button

### Step 9: Configure Project
1. You'll see a page with project settings
2. Most things are already correct - DON'T CHANGE THEM
3. Just scroll down to the bottom
4. Click "Deploy" button
5. Wait 2-5 minutes while it deploys

### Step 10: Deployment Complete
1. You'll see a page that says "Deployment in progress" or shows a checkmark
2. Wait for it to finish
3. You should see "Deployment successful" or a green checkmark
4. Your website is now on Vercel! 🎉

**✅ Your website is deployed to Vercel!**

---

## PART 3: ADD SECRET PASSWORDS (ENVIRONMENT VARIABLES) (15 minutes)

**What are these?** These are secret passwords and keys that make your website work. Like passwords for your email, payment systems, etc.

### Step 11: Go to Project Settings
1. You should still be on the Vercel page from Step 10
2. Look at the top of the page - you should see tabs like:
   - "Overview"
   - "Deployments"
   - "Settings"
3. Click "Settings"

### Step 12: Find Environment Variables
1. You're now in Settings
2. On the left side, you should see a menu with options like:
   - "General"
   - "Environment Variables"
   - "Domains"
   - "Git"
3. Click "Environment Variables"

### Step 13: Add First Secret (DATABASE_URL)
1. You should see a button that says "Add New" or "+ Add"
2. Click it
3. You'll see two boxes:
   - **Name** box (on the left)
   - **Value** box (on the right)

**For DATABASE_URL:**
1. In the **Name** box, type exactly: `DATABASE_URL`
2. In the **Value** box, you need to paste your database connection string
   - This comes from your database provider (like Vercel Postgres, AWS RDS, etc.)
   - It looks like: `postgresql://user:password@host:port/database`
   - **If you don't have this yet, skip it for now and come back**
3. Click the checkmark or "Save" button

### Step 14: Add Second Secret (NEXTAUTH_SECRET)
1. Click "Add New" again
2. In the **Name** box, type exactly: `NEXTAUTH_SECRET`
3. In the **Value** box, you need to generate a random secret:
   - **On Mac/Linux**: Open Terminal and type: `openssl rand -base64 32`
   - **On Windows**: Open PowerShell and type: `[Convert]::ToBase64String((1..32 | ForEach-Object {Get-Random -Maximum 256}))`
   - Copy the result
   - Paste it in the **Value** box
4. Click Save

### Step 15: Add Third Secret (NEXTAUTH_URL)
1. Click "Add New" again
2. In the **Name** box, type exactly: `NEXTAUTH_URL`
3. In the **Value** box, type exactly: `https://afrimatch.app`
4. Click Save

### Step 16: Add Stripe Secrets (3 secrets)

**Secret 1 - STRIPE_PUBLIC_KEY:**
1. Click "Add New"
2. In **Name** box: `STRIPE_PUBLIC_KEY`
3. In **Value** box:
   - Go to https://stripe.com in a new tab
   - Log in to your Stripe account
   - Click "Developers" at the top
   - Click "API Keys" on the left
   - You should see "Publishable key" - copy it
   - Come back to Vercel and paste it
4. Click Save

**Secret 2 - STRIPE_SECRET_KEY:**
1. Click "Add New"
2. In **Name** box: `STRIPE_SECRET_KEY`
3. In **Value** box:
   - Go back to Stripe → Developers → API Keys
   - You should see "Secret key" - copy it
   - Come back to Vercel and paste it
4. Click Save

**Secret 3 - STRIPE_WEBHOOK_SECRET:**
1. Click "Add New"
2. In **Name** box: `STRIPE_WEBHOOK_SECRET`
3. In **Value** box:
   - Go back to Stripe → Developers → Webhooks
   - You should see your webhook (we'll create it later)
   - For now, type: `whsec_test_secret` (temporary)
   - We'll update this in Part 5
4. Click Save

### Step 17: Add Flutterwave Secrets (3 secrets)

**Secret 1 - FLUTTERWAVE_PUBLIC_KEY:**
1. Click "Add New"
2. In **Name** box: `FLUTTERWAVE_PUBLIC_KEY`
3. In **Value** box:
   - Go to https://flutterwave.com in a new tab
   - Log in to your Flutterwave account
   - Click "Settings" at the top
   - Click "API Keys"
   - Copy "Public Key"
   - Come back to Vercel and paste it
4. Click Save

**Secret 2 - FLUTTERWAVE_SECRET_KEY:**
1. Click "Add New"
2. In **Name** box: `FLUTTERWAVE_SECRET_KEY`
3. In **Value** box:
   - Go back to Flutterwave → Settings → API Keys
   - Copy "Secret Key"
   - Come back to Vercel and paste it
4. Click Save

**Secret 3 - FLUTTERWAVE_WEBHOOK_SECRET:**
1. Click "Add New"
2. In **Name** box: `FLUTTERWAVE_WEBHOOK_SECRET`
3. In **Value** box:
   - Go back to Flutterwave → Settings → Webhooks
   - Copy "Webhook Secret"
   - Come back to Vercel and paste it
4. Click Save

### Step 18: Add SendGrid Secret (Email)
1. Click "Add New"
2. In **Name** box: `SENDGRID_API_KEY`
3. In **Value** box:
   - Go to https://sendgrid.com in a new tab
   - Log in to your SendGrid account
   - Click "Settings" at the left
   - Click "API Keys"
   - Click "Create API Key"
   - Copy the key
   - Come back to Vercel and paste it
4. Click Save

### Step 19: Add SendGrid Email Address
1. Click "Add New"
2. In **Name** box: `SENDGRID_FROM_EMAIL`
3. In **Value** box, type exactly: `noreply@afrimatch.app`
4. Click Save

### Step 20: Add Twilio Secrets (3 secrets)

**Secret 1 - TWILIO_ACCOUNT_SID:**
1. Click "Add New"
2. In **Name** box: `TWILIO_ACCOUNT_SID`
3. In **Value** box:
   - Go to https://twilio.com in a new tab
   - Log in to your Twilio account
   - You should see "Account SID" on the dashboard
   - Copy it
   - Come back to Vercel and paste it
4. Click Save

**Secret 2 - TWILIO_AUTH_TOKEN:**
1. Click "Add New"
2. In **Name** box: `TWILIO_AUTH_TOKEN`
3. In **Value** box:
   - Go back to Twilio dashboard
   - You should see "Auth Token" below Account SID
   - Copy it
   - Come back to Vercel and paste it
4. Click Save

**Secret 3 - TWILIO_PHONE_NUMBER:**
1. Click "Add New"
2. In **Name** box: `TWILIO_PHONE_NUMBER`
3. In **Value** box:
   - Go back to Twilio
   - Find your Twilio phone number (looks like +1234567890)
   - Copy it
   - Come back to Vercel and paste it
4. Click Save

### Step 21: Add Google Analytics Secret
1. Click "Add New"
2. In **Name** box: `GOOGLE_ANALYTICS_ID`
3. In **Value** box:
   - Go to https://analytics.google.com in a new tab
   - Log in
   - Click "Admin" at the bottom left
   - Click "Property Settings"
   - You should see "Property ID"
   - Copy it
   - Come back to Vercel and paste it
4. Click Save

### Step 22: Add Sentry Secret (Error Tracking)
1. Click "Add New"
2. In **Name** box: `SENTRY_DSN`
3. In **Value** box:
   - Go to https://sentry.io in a new tab
   - Log in
   - Click on your project
   - Click "Settings"
   - Copy "DSN"
   - Come back to Vercel and paste it
4. Click Save

### Step 23: Add Other Secrets (2 more)
1. Click "Add New"
2. In **Name** box: `NODE_ENV`
3. In **Value** box: `production`
4. Click Save

5. Click "Add New"
6. In **Name** box: `REDIS_URL`
7. In **Value** box:
   - Ask your Redis provider for this
   - Or use Vercel Redis
   - For now, type: `redis://localhost:6379` (temporary)
8. Click Save

**✅ All secrets added!**

---

## PART 4: CONNECT YOUR NAMECHEAP DOMAIN (10 minutes)

### Step 24: Go to Domains Settings
1. You should still be in Settings
2. On the left menu, click "Domains"
3. You should see a page that says "Domains"

### Step 25: Add Your Domain
1. Click "Add Domain" button
2. You'll see a text box
3. Type exactly: `afrimatch.app`
4. Click "Add" button

### Step 26: Vercel Shows DNS Records
1. Vercel will show you DNS records to add
2. You'll see something like:
   - **Type**: A | **Name**: @ | **Value**: 76.76.19.165
   - **Type**: CNAME | **Name**: www | **Value**: cname.vercel-dns.com
3. **COPY THESE RECORDS - YOU'LL NEED THEM IN NAMECHEAP**

### Step 27: Go to Namecheap
1. Open a new browser tab
2. Go to https://namecheap.com
3. Log in to your account
4. Click "Dashboard" or "My Domains"
5. You should see a list of your domains
6. Find "afrimatch.app"
7. Click "Manage" button next to it

### Step 28: Find DNS Settings
1. You're now in the domain settings
2. Look for tabs at the top or left side
3. Find "DNS" or "Advanced DNS"
4. Click on it
5. You should see a list of DNS records

### Step 29: Add DNS Records from Vercel
1. Look for a button that says "Add Record" or "+ Add"
2. For each record that Vercel showed you:

**First Record (usually A record):**
1. Click "Add Record"
2. In "Type" dropdown, select "A"
3. In "Host" box, type: `@`
4. In "Value" box, paste the value from Vercel (like 76.76.19.165)
5. Click the checkmark to save

**Second Record (usually CNAME):**
1. Click "Add Record"
2. In "Type" dropdown, select "CNAME"
3. In "Host" box, type: `www`
4. In "Value" box, paste the value from Vercel (like cname.vercel-dns.com)
5. Click the checkmark to save

3. Repeat for any other records Vercel showed you

### Step 30: Wait for DNS Update
1. Go back to Vercel
2. Go to Settings → Domains
3. You should see "afrimatch.app" with a status
4. It might say "Pending" or "Invalid"
5. **WAIT 24-48 HOURS** - this is normal
6. After 24-48 hours, refresh the page
7. It should say "Valid" with a green checkmark

**✅ Your domain is connected!**

---

## PART 5: SET UP PAYMENT WEBHOOKS (20 minutes)

**Remember: Webhooks are like phone calls from payment companies to your website**

### STRIPE WEBHOOKS

### Step 31: Go to Stripe Webhooks
1. Go to https://stripe.com in your browser
2. Log in to your Stripe account
3. Click "Developers" at the top
4. On the left side, click "Webhooks"
5. You should see a page that says "Webhooks"

### Step 32: Create Stripe Webhook
1. Click "Add Endpoint" button
2. You'll see a box asking for "Endpoint URL"
3. In the box, type exactly: `https://afrimatch.app/api/webhooks/stripe`
4. Click "Select events to send"
5. You'll see a list of events
6. Check these boxes:
   - ✓ `payment_intent.succeeded`
   - ✓ `payment_intent.payment_failed`
   - ✓ `customer.subscription.created`
   - ✓ `customer.subscription.updated`
   - ✓ `customer.subscription.deleted`
7. Click "Add Endpoint"

### Step 33: Get Stripe Webhook Secret
1. You'll see your webhook in the list
2. Click on it
3. You should see "Signing secret"
4. Click "Reveal" to show it
5. Copy the secret
6. Go back to Vercel
7. Go to Settings → Environment Variables
8. Find `STRIPE_WEBHOOK_SECRET`
9. Click the edit button (pencil icon)
10. Delete the old value
11. Paste the new secret
12. Click Save

**✅ Stripe webhook is set up!**

### FLUTTERWAVE WEBHOOKS

### Step 34: Go to Flutterwave Webhooks
1. Go to https://flutterwave.com in your browser
2. Log in to your Flutterwave account
3. Click "Settings" at the top
4. Click "Webhooks"
5. You should see a page that says "Webhooks"

### Step 35: Create Flutterwave Webhook
1. You should see a "Webhook URL" box
2. Click in the box
3. Type exactly: `https://afrimatch.app/api/webhooks/flutterwave`
4. Click "Save"
5. You should see a success message

### Step 36: Get Flutterwave Webhook Secret
1. You should see "Webhook Secret" on the page
2. Click "Reveal" or "Show" to display it
3. Copy the secret
4. Go back to Vercel
5. Go to Settings → Environment Variables
6. Find `FLUTTERWAVE_WEBHOOK_SECRET`
7. Click the edit button (pencil icon)
8. Delete the old value
9. Paste the new secret
10. Click Save

**✅ Flutterwave webhook is set up!**

---

## PART 6: TEST EVERYTHING (20 minutes)

### Step 37: Visit Your Website
1. Open a new browser tab
2. Type: `https://afrimatch.app`
3. Press Enter
4. **If you see an error**: Wait 24-48 hours for DNS to update, then try again
5. **If you see your website**: Great! 🎉

### Step 38: Test Basic Functions
1. Click around your website
2. Try clicking buttons
3. Try signing up (use a test email like test@example.com)
4. Try logging in
5. Look for any error messages
6. If everything works, continue to next step

### Step 39: Test Stripe Payment
1. Go to your website
2. Find where you can buy a subscription
3. Click "Buy" or "Subscribe"
4. You'll see a payment form
5. Use this test card:
   - **Card Number**: `4242 4242 4242 4242`
   - **Expiry Date**: `12/25` (any future date)
   - **CVC**: `123` (any 3 numbers)
6. Click "Pay" or "Complete Payment"
7. You should see "Payment successful" ✅

### Step 40: Test Flutterwave Payment
1. Go back to your website
2. Try buying a subscription again
3. Look for "Flutterwave" option
4. Use this test card:
   - **Card Number**: `5531 8866 5214 2950`
   - **Expiry Date**: `09/32`
   - **CVV**: `564`
5. Click "Pay"
6. You should see "Payment successful" ✅

### Step 41: Verify Stripe Webhook
1. Go to Stripe.com
2. Click "Developers"
3. Click "Webhooks"
4. Click on your webhook
5. Scroll down to "Recent Events"
6. You should see events like:
   - `payment_intent.succeeded`
   - `customer.subscription.created`
7. If you see them, the webhook is working! ✅

### Step 42: Verify Flutterwave Webhook
1. Go to Flutterwave.com
2. Click "Settings"
3. Click "Webhooks"
4. Look for "Recent Deliveries"
5. You should see successful deliveries
6. If you see them, the webhook is working! ✅

### Step 43: Test Email System
1. Go to your website
2. Sign up with a REAL email address (not test@example.com)
3. Check your email inbox
4. You should receive a verification email
5. If you don't see it, check spam folder
6. If you see it, your email system works! ✅

### Step 44: Check Google Analytics
1. Go to Google Analytics
2. Click "Real-time"
3. You should see visitors on your website
4. If you see numbers, people are visiting! 🎉

### Step 45: Check Vercel Dashboard
1. Go to Vercel.com
2. Click on your project
3. Click "Deployments"
4. You should see your latest deployment
5. It should have a green checkmark
6. If it's green, your website is live! ✅

---

## ✅ SUCCESS CHECKLIST

Before you celebrate, check all these boxes:

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

## 🎉 YOU DID IT!

Your website is now LIVE at `https://afrimatch.app`!

People from all over the world can now:
- Visit your website
- Sign up for accounts
- Buy subscriptions with Stripe or Flutterwave
- Send messages
- Find matches
- Take courses
- And much more!

---

## 📱 What Happens Next?

1. **Tell people about it** - Post on Instagram, Facebook, Twitter, TikTok, LinkedIn
2. **Watch for problems** - Check your website daily
3. **Fix bugs** - If something breaks, fix it quickly
4. **Add new features** - Make your website better over time
5. **Grow your users** - Get more people to sign up

---

## 🆘 TROUBLESHOOTING

### Problem: Website shows "Domain not found"
**Solution:**
1. Wait 24-48 hours for DNS to update
2. Go to Namecheap → Your domain → Advanced DNS
3. Check that all DNS records are there
4. Go to Vercel → Domains
5. Check that status shows "Valid" (green checkmark)

### Problem: Website shows error after 48 hours
**Solution:**
1. Go to Vercel → Your project → Deployments
2. Look for error messages
3. Check that all environment variables are correct
4. Check that database is connected

### Problem: Payments not working
**Solution:**
1. Check Stripe/Flutterwave webhooks are configured
2. Verify webhook URLs are exactly correct
3. Check that webhook secrets are in Vercel
4. Test payment again

### Problem: Emails not sending
**Solution:**
1. Check SendGrid API key is correct
2. Check `SENDGRID_FROM_EMAIL` is set to `noreply@afrimatch.app`
3. Check spam folder
4. Test email again

### Problem: Can't log in to Stripe/Flutterwave/SendGrid
**Solution:**
1. Click "Forgot Password"
2. Check your email for password reset link
3. Create new password
4. Log in again

---

## 💡 REMEMBER

- Your website is now on the internet 24/7
- People from all over the world can use it
- You need to take care of it (like watering a plant)
- If something breaks, fix it quickly
- Always test new features before putting them live
- Monitor your website daily for the first month

---

## 📞 NEED HELP?

If you get stuck:
1. Read the troubleshooting section above
2. Check Vercel documentation: https://vercel.com/docs
3. Check Stripe documentation: https://stripe.com/docs
4. Check Flutterwave documentation: https://developer.flutterwave.com
5. Ask in online communities like Stack Overflow or Reddit

---

**Congratulations! You're now a website owner! 🚀**

**Your website is live at: https://afrimatch.app**

---

*You did an amazing job! Seriously, this is not easy, and you did it! 🎉*
