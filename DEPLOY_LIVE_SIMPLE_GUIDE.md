# 🚀 How to Put AfriMatch Live on the Internet - SUPER SIMPLE GUIDE

**This guide is written like you're 9 years old. No tech words. Just simple steps!**

---

## 🎯 What We're Doing Today

We're putting AfriMatch on the internet so everyone in the world can use it. Think of it like:
- **Before**: Your app is on your computer (like a toy in your room)
- **After**: Your app is on the internet (like your toy is in a store everyone can visit)

---

## ✅ Things You Need Before Starting

Make sure you have:
1. A computer with internet
2. About 30 minutes of time
3. These 3 things ready (I'll tell you where to get them):
   - Your Vercel account (like a special website that puts your app online)
   - Your Stripe account (for payments)
   - Your Flutterwave account (for payments in Africa)

---

## 📋 STEP-BY-STEP GUIDE

### PART 1: Get Your Vercel Account Ready (5 minutes)

**Step 1: Go to Vercel Website**
1. Open your web browser (Chrome, Safari, Firefox, etc.)
2. Type this in the address bar: `https://vercel.com`
3. Press Enter
4. You should see a website that says "Vercel"

**Step 2: Sign Up or Log In**
1. Look for a button that says "Sign Up" or "Log In"
2. Click it
3. If you don't have an account, create one (use your email and a password)
4. If you already have one, just log in

**Step 3: You're In!**
- Great! Now you're inside Vercel. This is where we'll put our app online.

---

### PART 2: Import Your AfriMatch Project (10 minutes)

**Step 4: Click "Add New"**
1. Look at the top of the page
2. Find a button that says "Add New" or "New Project"
3. Click it
4. A menu will pop up - click "Project"

**Step 5: Connect Your Code**
1. You'll see options like "Import Git Repository"
2. Click on "Import Git Repository"
3. You'll see a box asking for your repository URL
4. Copy and paste this: `https://github.com/[YOUR-USERNAME]/afrimatch-website`
   - Replace `[YOUR-USERNAME]` with your actual GitHub username
5. Click "Continue"

**Step 6: Choose Your Project**
1. You'll see a list of projects
2. Find "afrimatch-website"
3. Click on it
4. Click "Import"

**Step 7: Configure Project Settings**
1. You'll see a form with settings
2. Most things are already correct - don't change them
3. Just click "Deploy" at the bottom

---

### PART 3: Add Secret Information (Environment Variables) (10 minutes)

**This is like giving Vercel the secret passwords it needs to make everything work.**

**Step 8: Go to Project Settings**
1. After deployment starts, wait for it to finish
2. Click on "Settings" at the top
3. On the left side, find "Environment Variables"
4. Click on it

**Step 9: Add Each Secret One By One**

Now you need to add these secrets. For each one:
1. Click "Add New"
2. In the "Name" box, type the name (exactly as written below)
3. In the "Value" box, paste the actual value
4. Click "Save"

**Here are all the secrets you need to add:**

#### 🔐 Database Secret
- **Name**: `DATABASE_URL`
- **Value**: Ask your database provider (like Vercel Postgres) for this. It looks like: `postgresql://user:password@host:port/database`

#### 🔐 Authentication Secrets
- **Name**: `NEXTAUTH_SECRET`
- **Value**: Go to your computer's terminal and type: `openssl rand -base64 32` - copy what it shows
- **Name**: `NEXTAUTH_URL`
- **Value**: `https://afrimatch.app`

#### 💳 Stripe Payment Secrets
- **Name**: `STRIPE_PUBLIC_KEY`
- **Value**: Go to Stripe.com → Dashboard → Developers → API Keys → Copy the "Publishable key"
- **Name**: `STRIPE_SECRET_KEY`
- **Value**: Go to Stripe.com → Dashboard → Developers → API Keys → Copy the "Secret key"
- **Name**: `STRIPE_WEBHOOK_SECRET`
- **Value**: Go to Stripe.com → Dashboard → Developers → Webhooks → Find your webhook → Copy "Signing secret"

#### 💳 Flutterwave Payment Secrets
- **Name**: `FLUTTERWAVE_PUBLIC_KEY`
- **Value**: Go to Flutterwave.com → Dashboard → Settings → API Keys → Copy "Public Key"
- **Name**: `FLUTTERWAVE_SECRET_KEY`
- **Value**: Go to Flutterwave.com → Dashboard → Settings → API Keys → Copy "Secret Key"
- **Name**: `FLUTTERWAVE_WEBHOOK_SECRET`
- **Value**: Go to Flutterwave.com → Dashboard → Settings → Webhooks → Copy "Webhook Secret"

#### 📧 Email Secrets (SendGrid)
- **Name**: `SENDGRID_API_KEY`
- **Value**: Go to SendGrid.com → Settings → API Keys → Create new key → Copy it
- **Name**: `SENDGRID_FROM_EMAIL`
- **Value**: `noreply@afrimatch.app`

#### 📱 SMS Secrets (Twilio)
- **Name**: `TWILIO_ACCOUNT_SID`
- **Value**: Go to Twilio.com → Console → Copy "Account SID"
- **Name**: `TWILIO_AUTH_TOKEN`
- **Value**: Go to Twilio.com → Console → Copy "Auth Token"
- **Name**: `TWILIO_PHONE_NUMBER`
- **Value**: Your Twilio phone number (like +1234567890)

#### 🔍 Analytics Secrets
- **Name**: `GOOGLE_ANALYTICS_ID`
- **Value**: Go to Google Analytics → Admin → Property Settings → Copy "Property ID"
- **Name**: `SENTRY_DSN`
- **Value**: Go to Sentry.io → Project Settings → Copy "DSN"

#### 🌍 Other Secrets
- **Name**: `NODE_ENV`
- **Value**: `production`
- **Name**: `REDIS_URL`
- **Value**: Ask your Redis provider for this (or use Vercel Redis)

**Step 10: Save All Secrets**
- After adding each secret, it will save automatically
- You should see a green checkmark next to each one
- If you see a red X, something is wrong - check the value again

---

### PART 4: Set Up Your Custom Domain (5 minutes)

**This makes your website show as `afrimatch.app` instead of a weird Vercel URL.**

**Step 11: Add Your Domain**
1. Go back to your project page
2. Click "Settings" at the top
3. On the left, find "Domains"
4. Click on it
5. Click "Add Domain"
6. Type: `afrimatch.app`
7. Click "Add"

**Step 12: Update Your Domain's DNS**
1. Vercel will show you some DNS records to add
2. Go to your domain registrar (like GoDaddy, Namecheap, etc.)
3. Find the DNS settings
4. Add the records that Vercel showed you
5. Wait 24-48 hours for it to work (this is normal - it's like mail taking time to arrive)

**Step 13: Check If It Works**
1. After 24-48 hours, open your browser
2. Type: `https://afrimatch.app`
3. If you see your website, it worked! 🎉

---

### PART 5: Set Up Payment Webhooks (10 minutes)

**Webhooks are like phone calls - when someone pays, Stripe/Flutterwave call your website to tell it "hey, someone paid!"**

#### For Stripe:

**Step 14: Go to Stripe Webhooks**
1. Go to Stripe.com
2. Click "Developers" at the top
3. Click "Webhooks"
4. Click "Add Endpoint"
5. In the "Endpoint URL" box, type: `https://afrimatch.app/api/webhooks/stripe`
6. Click "Select events to send"
7. Check these boxes:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
8. Click "Add Endpoint"
9. You'll see a "Signing Secret" - copy it and add it to Vercel as `STRIPE_WEBHOOK_SECRET` (you already did this in Part 3)

#### For Flutterwave:

**Step 15: Go to Flutterwave Webhooks**
1. Go to Flutterwave.com
2. Click "Settings"
3. Click "Webhooks"
4. In the "Webhook URL" box, type: `https://afrimatch.app/api/webhooks/flutterwave`
5. Click "Save"
6. You'll see a "Webhook Secret" - copy it and add it to Vercel as `FLUTTERWAVE_WEBHOOK_SECRET` (you already did this in Part 3)

---

### PART 6: Test That Everything Works (5 minutes)

**Let's make sure your website is actually working!**

**Step 16: Test Your Website**
1. Open your browser
2. Type: `https://afrimatch.app`
3. You should see your AfriMatch website
4. Try these things:
   - Click around and make sure buttons work
   - Try signing up (use a test email like test@example.com)
   - Try logging in
   - Look for any error messages

**Step 17: Test Payments (With Test Cards)**

**For Stripe:**
1. Go to your website
2. Try to buy a subscription
3. Use this test card number: `4242 4242 4242 4242`
4. For expiry date, use any future date like `12/25`
5. For CVC, use any 3 numbers like `123`
6. Click "Pay"
7. It should work and say "Payment successful"

**For Flutterwave:**
1. Go to your website
2. Try to buy a subscription
3. Use this test card number: `5531 8866 5214 2950`
4. For expiry date, use `09/32`
5. For CVV, use `564`
6. Click "Pay"
7. It should work and say "Payment successful"

**Step 18: Check Stripe Dashboard**
1. Go to Stripe.com
2. Click "Developers"
3. Click "Webhooks"
4. Find your webhook
5. Click on it
6. Scroll down to see "Recent Events"
7. You should see events like "payment_intent.succeeded"
8. If you see them, the webhook is working! ✅

**Step 19: Check Flutterwave Dashboard**
1. Go to Flutterwave.com
2. Click "Settings"
3. Click "Webhooks"
4. Look for "Recent Deliveries"
5. You should see successful webhook deliveries
6. If you see them, the webhook is working! ✅

---

### PART 7: Check Your Email System (5 minutes)

**Let's make sure emails are being sent.**

**Step 20: Test Email**
1. Go to your website
2. Try to sign up with a real email address (like your email)
3. You should get a verification email
4. Check your email inbox (and spam folder)
5. If you see the email, your email system is working! ✅

---

### PART 8: Monitor Your Website (Ongoing)

**Step 21: Check Google Analytics**
1. Go to Google Analytics
2. Click on "Real-time"
3. You should see visitors on your website
4. If you see numbers, people are visiting! 🎉

**Step 22: Check Vercel Dashboard**
1. Go to Vercel.com
2. Click on your project
3. Look at the "Deployments" tab
4. You should see your latest deployment with a green checkmark
5. If it's green, your website is live! ✅

---

## 🎉 YOU DID IT!

Your website is now LIVE on the internet! 

**What you accomplished:**
- ✅ Put your website on Vercel (the internet)
- ✅ Added all the secret passwords it needs
- ✅ Set up your custom domain (afrimatch.app)
- ✅ Connected payment systems (Stripe and Flutterwave)
- ✅ Tested everything works
- ✅ Set up email system
- ✅ Checked analytics

---

## 📞 If Something Goes Wrong

**Problem: Website shows an error**
- Solution: Go to Vercel → Deployments → Look at the error message → Fix it

**Problem: Payments not working**
- Solution: Check Stripe/Flutterwave webhooks → Make sure webhook URL is correct → Test payment again

**Problem: Emails not sending**
- Solution: Check SendGrid dashboard → Make sure API key is correct → Test email again

**Problem: Domain not working**
- Solution: Wait 24-48 hours for DNS to update → Check DNS records are correct → Try again

**Problem: Something else is broken**
- Solution: Ask for help from a tech person or contact Vercel support

---

## 🏆 Success Checklist

Before you celebrate, check all these boxes:

- [ ] Website is live at https://afrimatch.app
- [ ] Website loads without errors
- [ ] Buttons and links work
- [ ] Sign up works
- [ ] Login works
- [ ] Stripe payment test worked
- [ ] Flutterwave payment test worked
- [ ] Verification emails are being sent
- [ ] Webhook events are showing in Stripe
- [ ] Webhook events are showing in Flutterwave
- [ ] Google Analytics shows visitors
- [ ] Vercel shows green checkmark

**If all boxes are checked, you're done! 🎉**

---

## 📱 What Happens Next?

Now that your website is live:

1. **Tell people about it** - Post on social media, tell your friends
2. **Watch for problems** - Check your website daily
3. **Fix bugs** - If something breaks, fix it quickly
4. **Add new features** - Make your website better over time
5. **Grow your users** - Get more people to sign up

---

## 💡 Remember

- Your website is now on the internet 24/7
- People from all over the world can use it
- You need to take care of it (like watering a plant)
- If something breaks, fix it quickly
- Always test before putting new things live

---

**Congratulations! You're now a website owner! 🚀**

---

*If you get stuck on any step, just ask for help. It's totally okay!*
