# AfriMatch Production Audit — Fix List

## CRITICAL (P0 — Blocks real users)

- [ ] P0-1: Dashboard has NO session protection — unauthenticated users can access it
- [ ] P0-2: Dashboard Sign Out is a Link to /auth/login — must call signOut()
- [ ] P0-3: Payment userId uses email string but subscriptions.userId is UUID — DB insert will fail
- [ ] P0-4: No payment success page — Stripe/FLW redirect to /dashboard?payment=success with no feedback
- [ ] P0-5: No payment cancel/failure page — /pricing?payment=cancelled shows nothing
- [ ] P0-6: Signup flow redirects to /auth/profile-setup without auto-login — user arrives unauthenticated
- [ ] P0-7: Profile setup page shows "Redirecting to login..." if no session but doesn't actually redirect
- [ ] P0-8: Dashboard uses hardcoded DEMO_MATCHES/DEMO_JOBS/DEMO_CONNECTIONS — not real data

## HIGH (P1 — Broken UX)

- [ ] P1-1: Homepage shows "2M+ Africans" — fake user count, must be removed
- [ ] P1-2: App Store / Google Play buttons are dead (no href) — must link to real stores or remove
- [ ] P1-3: Dating page profiles are hardcoded fake data — must show real or empty state
- [ ] P1-4: About page uses /afrimatch-logo.png (wrong path) — should be /images/afrimatch-logo.png
- [ ] P1-5: Pricing page plan prices don't match plans.ts (e.g. Premium shows $9.99 but plans.ts has $19.99)
- [ ] P1-6: Dashboard nav has no mobile hamburger menu
- [ ] P1-7: Mode switcher in dashboard doesn't persist to DB
- [ ] P1-8: Professional page jobs/mentors/courses are all hardcoded demo data

## MEDIUM (P2 — Polish / Trust)

- [ ] P2-1: Language switcher works but doesn't actually translate content (only UI labels)
- [ ] P2-2: Footer links include /about, /careers, /press — check they exist
- [ ] P2-3: Contact form — check it actually sends
- [ ] P2-4: Blog page — check it works without content
- [ ] P2-5: Report/block user modal — check it's wired up

## ALREADY WORKING ✅

- Auth (email/password) — login flow works
- Signup API — creates user in DB
- Payment API — Stripe + Flutterwave routing works
- Promo code validation — DB-backed
- Stripe webhook — handles subscription events
- Flutterwave webhook — handles charge events
- Language switcher — UI works
- Pricing page — geo-detection + provider switch works
- TypeScript — zero errors
