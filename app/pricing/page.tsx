"use client";
import { Navbar } from "@/components/navbar";
import { useTranslation } from "@/lib/i18n/use-translation";
export const dynamic = "force-dynamic";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// ─── Country → Provider mapping ─────────────────────────────────────────────
const FLUTTERWAVE_COUNTRIES = new Set([
  "NG","GH","KE","UG","ZA","CI","SN","CM","TZ","RW","ZM",
  "ML","BF","NE","TD","MG","BJ","TG","GN","GA","CG","CD",
  "CF","DJ","KM","MR","SC","MU","ET","EG","MA","DZ","TN",
  "LY","SD","AO","MZ","ZW","BW","NA","MW","LS","SZ","SO",
  "ER","SS","GM","GW","SL","LR","CV","ST","GQ","BI",
]);

function getDefaultProvider(cc: string): "stripe" | "flutterwave" {
  return FLUTTERWAVE_COUNTRIES.has(cc.toUpperCase()) ? "flutterwave" : "stripe";
}

const COMMUNITY_PLANS = [
  {
    id: "community_free",
    name: "Community Free",
    price: { monthly: 0, yearly: 0 },
    description: "Join Africa's community platform — completely free, forever",
    features: ["Unlimited profile browsing", "Send & receive messages", "Cultural & language filters", "Verified profiles", "Safety Centre access", "Community events"],
    cta: "Join Free",
    href: "/auth/signup",
    popular: true,
    color: "border-amber-500/50",
    gradient: "from-amber-500 to-orange-500",
  },
];

const PROFESSIONAL_PLANS = [
  {
    id: "professional_free",
    name: "Free",
    price: { monthly: 0, yearly: 0 },
    description: "Build your professional presence",
    features: ["Basic profile", "5 job applications/month", "3 course enrollments", "Limited connections", "Basic job search"],
    cta: "Get Started Free",
    href: "/auth/signup?mode=professional",
    popular: false,
    color: "border-white/10",
    gradient: "",
  },
  {
    id: "professional_career_monthly",
    yearlyId: "professional_career_yearly",
    name: "Career",
    price: { monthly: 24.99, yearly: 12.49 },
    description: "Accelerate your career growth",
    features: ["Unlimited applications", "All courses access", "Unlimited connections", "InMail messages", "Profile analytics", "Featured in searches", "1 mentor session/month"],
    cta: "Start Career",
    href: "/auth/signup?mode=professional&plan=career",
    popular: true,
    color: "border-blue-500/50",
    gradient: "from-blue-500 to-indigo-500",
  },
  {
    id: "professional_executive_monthly",
    yearlyId: "professional_executive_yearly",
    name: "Executive",
    price: { monthly: 59.99, yearly: 29.99 },
    description: "For leaders and top professionals",
    features: ["Everything in Career", "Unlimited mentor sessions", "Executive job board", "Headhunter visibility", "Company insights", "Salary benchmarks", "Priority support"],
    cta: "Start Executive",
    href: "/auth/signup?mode=professional&plan=executive",
    popular: false,
    color: "border-purple-500/50",
    gradient: "from-purple-500 to-violet-500",
  },
];

const PAYMENT_METHODS = [
  { name: "Visa / Mastercard", icon: "💳" },
  { name: "Flutterwave", icon: "🌍" },
  { name: "M-Pesa", icon: "📱" },
  { name: "MTN Mobile Money", icon: "📲" },
  { name: "Airtel Money", icon: "💰" },
  { name: "PayPal", icon: "🅿️" },
  { name: "Apple Pay", icon: "🍎" },
  { name: "Google Pay", icon: "🤖" },
];

export default function PricingPage() {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const router = useRouter();
  const [activeMode, setActiveMode] = useState<"community" | "professional">("professional");
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [countryCode, setCountryCode] = useState("US");
  const [provider, setProvider] = useState<"stripe" | "flutterwave">("stripe");
  const [manualOverride, setManualOverride] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoStatus, setPromoStatus] = useState<{ valid?: boolean; message?: string; discount?: number } | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const plans = activeMode === "community" ? COMMUNITY_PLANS : PROFESSIONAL_PLANS;

  // Detect user country via IP
  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((r) => r.json())
      .then((data) => {
        const code = data.country_code || "US";
        setCountryCode(code);
        if (!manualOverride) setProvider(getDefaultProvider(code));
      })
      .catch(() => {});
  }, [manualOverride]);

  const handleProviderSwitch = (p: "stripe" | "flutterwave") => {
    setProvider(p);
    setManualOverride(true);
  };

  const validatePromo = useCallback(async () => {
    if (!promoCode.trim()) return;
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "validate-promo", promoCode: promoCode.trim(), planId: activeMode === "professional" ? "professional_career_monthly" : "community_free" }),
      });
      const data = await res.json();
      if (data.valid) {
        setPromoStatus({ valid: true, message: `${data.discountPercent}% discount applied!`, discount: data.discountPercent });
      } else {
        setPromoStatus({ valid: false, message: data.error || "Invalid promo code" });
      }
    } catch {
      setPromoStatus({ valid: false, message: "Could not validate code" });
    }
  }, [promoCode]);

  const handleSelectPlan = async (plan: typeof PROFESSIONAL_PLANS[0]) => {
    setError(null);
    if (plan.price.monthly === 0 && plan.price.yearly === 0) {
      router.push(`/auth/signup?mode=${activeMode}`);
      return;
    }
    if (!session) {
      const planId = billing === "yearly" ? ((plan as any).yearlyId || plan.id) : (plan as any).id;
      router.push(`/auth/signup?plan=${planId}&mode=${activeMode}`);
      return;
    }
    const planId = billing === "yearly" ? ((plan as any).yearlyId || (plan as any).id) : (plan as any).id;
    setLoadingPlan(planId);
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "subscribe",
          planId,
          provider,
          countryCode,
          promoCode: promoStatus?.valid ? promoCode.trim() : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Payment failed. Please try again."); return; }
      if (data.url) window.location.href = data.url;
    } catch (err: any) {
      setError(err.message || "Network error. Please try again.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white">
      <Navbar />

      <div className="pt-20 max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-white mb-4">
            {t("pricing.title")}{" "}
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">{t("pricing.subtitle")}</span>
          </h1>
          <p className="text-slate-400 text-lg mb-8">{t("pricing.desc")}</p>

          {/* Mode switcher */}
          <div className="flex justify-center mb-6">
            <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1 gap-1">
              <button onClick={() => setActiveMode("community")} className={`px-6 py-2.5 rounded-xl font-semibold transition text-sm ${activeMode === "community" ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white" : "text-slate-400 hover:text-white"}`}>
                🌍 {t("pricing.community")}
              </button>
              <button onClick={() => setActiveMode("professional")} className={`px-6 py-2.5 rounded-xl font-semibold transition text-sm ${activeMode === "professional" ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white" : "text-slate-400 hover:text-white"}`}>
                💼 {t("pricing.professional")}
              </button>
            </div>
          </div>

          {/* Community free banner */}
          {activeMode === "community" && (
            <div className="max-w-xl mx-auto mt-4 p-5 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-center">
              <span className="text-3xl">🌍</span>
              <p className="text-amber-300 font-bold text-lg mt-2">Community Mode is free during beta.</p>
              <p className="text-slate-400 text-sm mt-1">No payment required. No credit card. Completely free.</p>
            </div>
          )}
          {/* Billing toggle — only for Professional */}
          {activeMode === "professional" && (
          <div className="flex items-center justify-center gap-4">
            <button onClick={() => setBilling("monthly")} className={`text-sm font-medium transition ${billing === "monthly" ? "text-white" : "text-slate-500"}`}>{t("pricing.monthly")}</button>
            <div onClick={() => setBilling(billing === "monthly" ? "yearly" : "monthly")} className="w-12 h-6 bg-amber-500/30 border border-amber-500/50 rounded-full cursor-pointer relative">
              <div className={`absolute top-0.5 w-5 h-5 bg-amber-400 rounded-full transition-all ${billing === "yearly" ? "left-6" : "left-0.5"}`} />
            </div>
            <button onClick={() => setBilling("yearly")} className={`text-sm font-medium transition ${billing === "yearly" ? "text-white" : "text-slate-500"}`}>
              {t("pricing.yearly")} <span className="text-amber-400 text-xs ml-1">{t("pricing.save50")}</span>
            </button>
          </div>
          )}
        </div>

        {/* Payment Provider Selector — only shown for Professional plans */}
        {activeMode === "professional" && <div className="max-w-xl mx-auto mb-8 bg-white/5 border border-white/10 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-slate-300">Payment Provider</span>
            {!manualOverride && (
              <span className="text-xs text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">Auto-selected for your region</span>
            )}
            {manualOverride && (
              <button onClick={() => { setManualOverride(false); setProvider(getDefaultProvider(countryCode)); }} className="text-xs text-slate-500 hover:text-slate-300 transition">Reset to auto</button>
            )}
          </div>
          <div className="flex gap-3">
            <button onClick={() => handleProviderSwitch("stripe")} className={`flex-1 flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition ${provider === "stripe" ? "border-blue-500 bg-blue-500/10 text-white" : "border-white/10 text-slate-400 hover:border-white/20 hover:text-white"}`}>
              <span className="text-lg">💳</span>
              <div className="text-left">
                <div className="font-semibold">Stripe</div>
                <div className="text-xs text-slate-500">Card · Apple Pay · Google Pay</div>
              </div>
            </button>
            <button onClick={() => handleProviderSwitch("flutterwave")} className={`flex-1 flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition ${provider === "flutterwave" ? "border-amber-500 bg-amber-500/10 text-white" : "border-white/10 text-slate-400 hover:border-white/20 hover:text-white"}`}>
              <span className="text-lg">🌍</span>
              <div className="text-left">
                <div className="font-semibold">Flutterwave</div>
                <div className="text-xs text-slate-500">M-Pesa · Mobile Money · Cards</div>
              </div>
            </button>
                    </div>
        </div>}
        {/* Promo Code — only shown for Professional plans */}
        {activeMode === "professional" && <div className="max-w-xl mx-auto mb-8">
          <div className="flex gap-2">
            <input type="text" value={promoCode} onChange={(e) => { setPromoCode(e.target.value.toUpperCase()); setPromoStatus(null); }} placeholder="Promo code (e.g. AFRICA50)" className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50" />
            <button onClick={validatePromo} disabled={!promoCode.trim()} className="px-4 py-2.5 bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded-xl text-sm font-medium hover:bg-amber-500/30 transition disabled:opacity-40 disabled:cursor-not-allowed">Apply</button>
          </div>
          {promoStatus && (
            <p className={`mt-2 text-xs ${promoStatus.valid ? "text-green-400" : "text-red-400"}`}>
              {promoStatus.valid ? "✓" : "✗"} {promoStatus.message}
            </p>
          )}
        </div>}


        {/* Error */}
        {error && (
          <div className="max-w-xl mx-auto mb-6 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400">{error}</div>
        )}

        {/* Plans grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {plans.map((plan) => {
            const planId = billing === "yearly" ? ((plan as any).yearlyId || (plan as any).id) : (plan as any).id;
            const price = billing === "yearly" ? plan.price.yearly : plan.price.monthly;
            const isLoading = loadingPlan === planId;
            const isFree = price === 0;
            const discountedPrice = promoStatus?.valid && !isFree ? (price * (1 - (promoStatus.discount || 0) / 100)).toFixed(2) : null;
            return (
              <div key={(plan as any).id || plan.name} className={`relative p-6 bg-white/3 border-2 rounded-3xl transition-all duration-300 ${plan.color} ${plan.popular ? "scale-105 shadow-2xl" : ""}`}>
                {plan.popular && (
                  <div className={`absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r ${(plan as any).gradient || "from-amber-500 to-orange-500"} text-white text-xs font-bold rounded-full shadow-lg`}>
                    {t("pricing.popular")}
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                  <p className="text-slate-400 text-sm">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-extrabold text-white">
                      {isFree ? t("courses.free") : `$${discountedPrice || price}`}
                    </span>
                    {!isFree && <span className="text-slate-400 text-sm mb-1">/mo</span>}
                  </div>
                  {billing === "yearly" && !isFree && (
                    <div className="text-amber-400 text-xs mt-1">Billed annually · Save 50%</div>
                  )}
                  {discountedPrice && (
                    <div className="text-xs text-slate-500 line-through">${price}/mo</div>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-slate-300">
                      <span className="text-green-400 flex-shrink-0">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelectPlan(plan as any)}
                  disabled={isLoading}
                  className={`w-full py-3.5 rounded-2xl font-bold text-sm transition ${
                    isFree
                      ? "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                      : (plan as any).gradient
                      ? `bg-gradient-to-r ${(plan as any).gradient} text-white hover:opacity-90 shadow-xl`
                      : "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-400 hover:to-orange-400 shadow-xl shadow-amber-500/25"
                  } disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      {t("common.loading")}
                    </span>
                  ) : plan.cta}
                </button>
              </div>
            );
          })}
        </div>

        {/* Provider note */}
        <p className="text-center text-slate-500 text-xs mb-8">
          Paying via <span className="text-slate-400 font-medium">{provider === "stripe" ? "Stripe (Card / Apple Pay / Google Pay)" : "Flutterwave (M-Pesa, Mobile Money, Cards)"}</span>
          {" · "}
          <button onClick={() => handleProviderSwitch(provider === "stripe" ? "flutterwave" : "stripe")} className="text-amber-400 hover:text-amber-300 transition">Switch provider</button>
        </p>

        {/* Payment methods */}
        <div className="text-center mb-16">
          <h3 className="text-white font-semibold mb-6">{t("pricing.payment_methods")}</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {PAYMENT_METHODS.map((method) => (
              <div key={method.name} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-slate-300 text-sm">
                <span>{method.icon}</span>
                <span>{method.name}</span>
              </div>
            ))}
          </div>
          <p className="text-slate-500 text-xs mt-4">All payments are secure and encrypted. Local African currencies supported.</p>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-white text-center mb-8">{t("pricing.faq")}</h3>
          <div className="space-y-4">
            {[
              { q: "Can I cancel anytime?", a: "Yes, you can cancel your subscription at any time. You'll keep access until the end of your billing period." },
              { q: "Is my payment information secure?", a: "Absolutely. We use industry-standard SSL encryption and never store your card details." },
              { q: "Do you support local African payment methods?", a: "Yes! We support M-Pesa, MTN Mobile Money, Airtel Money, Flutterwave, and all major card networks." },
              { q: "Can I switch between Community and Professional plans?", a: "Yes, Community mode is always free. You can upgrade to Professional Premium at any time from your dashboard." },
            ].map((faq) => (
              <div key={faq.q} className="p-5 bg-white/3 border border-white/8 rounded-2xl">
                <h4 className="text-white font-semibold mb-2">{faq.q}</h4>
                <p className="text-slate-400 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="border-t border-white/5 py-8 px-4 mt-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-slate-600 text-sm">
          <p>&copy; 2026 <span className="text-slate-400 font-medium">ZuriTech Global</span>. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-slate-400 transition">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-400 transition">Terms</Link>
            <Link href="/contact" className="hover:text-slate-400 transition">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
