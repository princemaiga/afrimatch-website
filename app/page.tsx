"use client";
export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useTranslation } from "@/lib/i18n/use-translation";

/* ─── DATA ─────────────────────────────────────────────────────────────────── */

const TESTIMONIALS = [
  {
    name: "Kwame Asante",
    location: "Accra, Ghana",
    text: "I applied to three companies through AfriMatch Professional and landed an interview within a week. The platform understands the African job market.",
    avatar: "https://ui-avatars.com/api/?name=Kwame+Asante&background=1e3a5f&color=f59e0b&size=80",
    mode: "professional" as const,
  },
  {
    name: "Fatima Diallo",
    location: "Dakar, Senegal",
    text: "AfriMatch connected me with a mentor in my industry. The guidance I received helped me grow professionally in ways I didn't expect.",
    avatar: "https://ui-avatars.com/api/?name=Fatima+Diallo&background=7c3aed&color=fff&size=80",
    mode: "professional" as const,
  },
  {
    name: "Amara Osei",
    location: "Kumasi, Ghana",
    text: "I joined AfriMatch Community during the beta and connected with professionals from 12 different countries. The community feels genuinely African.",
    avatar: "https://ui-avatars.com/api/?name=Amara+Osei&background=f59e0b&color=fff&size=80",
    mode: "community" as const,
  },
  {
    name: "Nadia Mensah",
    location: "Nairobi, Kenya",
    text: "As a recruiter, AfriMatch Professional gives me access to verified African talent I couldn't find anywhere else. The quality of profiles is exceptional.",
    avatar: "https://ui-avatars.com/api/?name=Nadia+Mensah&background=1e3a5f&color=f59e0b&size=80",
    mode: "professional" as const,
  },
];

const COMMUNITY_FEATURES = [
  { icon: "🌍", title: "Pan-African Reach", desc: "Connect with people across all 54 African countries and the global diaspora." },
  { icon: "✅", title: "Verified Profiles", desc: "Users submit identity verification. Badges help you know who you're connecting with." },
  { icon: "💬", title: "Rich Conversations", desc: "Chat, voice notes, and video calls — connect the way that feels natural." },
  { icon: "🎯", title: "Shared Interests", desc: "Discover people by country, language, interests, and the values that matter to you." },
  { icon: "🔒", title: "Private & Safe", desc: "Advanced privacy controls, AI-powered moderation, and a dedicated Safety Centre." },
  { icon: "🤝", title: "Shared Values", desc: "Discover people who share your background, goals, and community values." },
];

const PROFESSIONAL_FEATURES = [
  { icon: "💼", title: "AI Career Recommendations", desc: "Your skills connected to the right opportunities across Africa and the diaspora." },
  { icon: "🎓", title: "Certified Courses", desc: "Learn from Africa's top professionals and earn certificates employers trust." },
  { icon: "🤝", title: "Expert Mentorship", desc: "Book 1-on-1 sessions with experienced mentors in your exact industry." },
  { icon: "🏢", title: "Company Profiles", desc: "Know the culture, team, and values before you apply — no surprises." },
  { icon: "📊", title: "Career Analytics", desc: "Track profile views, applications, and career growth in real time." },
  { icon: "🌐", title: "Global Network", desc: "Build connections from Lagos to London, Nairobi to New York." },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: "👤",
    title: "Create Your Profile",
              desc: "Sign up free in 60 seconds. Add your photo, interests, and what you're looking for — community, career, or both.",
  },
  {
    step: "02",
    icon: "🔍",
    title: "Discover & Connect",
    desc: "Discover people based on shared interests, location, culture, and community values.",
  },
  {
    step: "03",
    icon: "💬",
    title: "Connect & Thrive",
    desc: "Chat, video call, apply for jobs, book mentors — your journey starts the moment you connect.",
  },
];

const WHY_DIFFERENT = [
  {
    icon: "🌍",
    title: "Built for Africa, by Africans",
    desc: "Every feature is designed with African culture, languages, and values at the centre — not adapted from a Western template.",
  },
  {
    icon: "🔐",
    title: "Safety First, Always",
    desc: "ID verification, AI moderation, and a dedicated Safety Centre protect every user on the platform.",
  },
  {
    icon: "💳",
    title: "Pay Your Way",
    desc: "M-Pesa, MTN Mobile Money, Airtel, Stripe, Flutterwave — every major African and global payment method supported.",
  },
  {
    icon: "🗣️",
    title: "18+ African Languages",
    desc: "Swahili, Hausa, Zulu, Amharic, Wolof, French, Arabic and more — use AfriMatch in your language.",
  },
  {
    icon: "⚡",
    title: "Two Platforms in One",
    desc: "Switch between Community and Professional mode with a single tap — one account, two powerful worlds.",
  },
  {
    icon: "🚀",
    title: "Mobile App Coming Soon",
    desc: "Native iOS and Android apps are in development. Join the waitlist and be first to access them.",
  },
];

const SAFETY_FEATURES = [
  { icon: "🪪", title: "ID Verification", desc: "Users can submit a government ID to receive a verified badge on their profile." },
  { icon: "🤖", title: "AI Moderation", desc: "Automated detection of inappropriate content, scams, and fake profiles." },
  { icon: "🚨", title: "Report & Block", desc: "One-tap reporting and blocking, reviewed by a human moderation team within 24 hours." },
  { icon: "🔒", title: "Data Privacy", desc: "Your data is encrypted, never sold, and fully GDPR-compliant." },
];

const FAQS = [
  {
    q: "Is AfriMatch free to use?",
    a: "Yes — signing up and joining the community are completely free. Professional Premium plans unlock unlimited applications, courses, mentorship, and more.",
  },
  {
    q: "Which countries does AfriMatch support?",
    a: "All 54 African countries plus the global African diaspora in Europe, North America, and beyond.",
  },
  {
    q: "What payment methods are accepted?",
    a: "We support M-Pesa, MTN Mobile Money, Airtel Money, Flutterwave, Stripe, Visa, Mastercard, Apple Pay, and Google Pay.",
  },
  {
    q: "How does profile verification work?",
    a: "Users submit a selfie and government ID. Our system verifies the identity and awards a verified badge — typically within 24 hours.",
  },
  {
    q: "Can I use both Community and Professional mode?",
    a: "Absolutely. One account gives you access to both modes. Switch between them at any time from your dashboard.",
  },
  {
    q: "Is my data safe?",
    a: "Yes. All data is encrypted in transit and at rest. We never sell your personal data. See our Privacy Policy for full details.",
  },
];

const RECRUITER_FEATURES = [
  { icon: "🎯", title: "Targeted Talent Search", desc: "Filter by skill, location, experience level, and language across Africa's growing professional network." },
  { icon: "📣", title: "Job Posting & Promotion", desc: "Post jobs and reach qualified African professionals across 54 countries." },
  { icon: "📊", title: "Applicant Analytics", desc: "Track views, applications, and conversion rates for every job posting in real time." },
  { icon: "🤝", title: "Direct Outreach", desc: "Message candidates directly — no gatekeepers, no agency fees." },
];

/* ─── COMPONENT ─────────────────────────────────────────────────────────────── */

export default function Home() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"community" | "professional">("community");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [earlyAccessEmail, setEarlyAccessEmail] = useState("");
  const [earlyAccessSubmitted, setEarlyAccessSubmitted] = useState(false);

  const handleEarlyAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (earlyAccessEmail) {
      setEarlyAccessSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#080d1a] text-white overflow-x-hidden">

      {/* ═══════════════════════════════════════════════════════════════════════
          NAVIGATION
      ═══════════════════════════════════════════════════════════════════════ */}
      <nav className="fixed top-0 w-full z-50 bg-[#080d1a]/80 backdrop-blur-2xl border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-lg ring-1 ring-amber-500/20">
              <Image src="/images/afrimatch-logo.png" alt="AfriMatch" fill className="object-cover" />
            </div>
            <span className="text-[1.1rem] font-bold tracking-tight bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
              AfriMatch
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-7 text-[0.82rem] font-medium text-slate-400">
            <Link href="/community" className="hover:text-white transition-colors duration-200">{t("nav.community")}</Link>
            <Link href="/professional/jobs" className="hover:text-white transition-colors duration-200">Jobs</Link>
            <Link href="/professional/courses" className="hover:text-white transition-colors duration-200">Courses</Link>
            <Link href="/professional/mentors" className="hover:text-white transition-colors duration-200">Mentors</Link>
            <Link href="/pricing" className="hover:text-white transition-colors duration-200">{t("nav.pricing")}</Link>
            <Link href="/blog" className="hover:text-white transition-colors duration-200">Blog</Link>
          </div>

          <div className="flex items-center gap-2.5">
            <LanguageSwitcher />
                        <Link
                    href="/auth/login"
                    className="hidden sm:block px-4 py-2 text-[0.82rem] font-medium text-slate-300 hover:text-white transition-colors duration-200">
              {t("nav.signin")}
            </Link>
            <Link
              href="/auth/signup"
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg text-[0.82rem] font-semibold hover:from-amber-400 hover:to-orange-400 transition-all duration-200 shadow-lg shadow-amber-500/20"
            >
              {t("nav.signup")}
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="relative pt-28 pb-20 px-4 overflow-hidden">
        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-gradient-radial from-amber-500/8 via-orange-500/4 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-rose-500/6 rounded-full blur-3xl" />
          <div className="absolute top-60 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl" />
          {/* Subtle grid */}
          <div className="absolute inset-0 opacity-[0.015]" style={{backgroundImage: "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)", backgroundSize: "60px 60px"}} />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-semibold mb-8 tracking-wide uppercase">
            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
            {t("hero.tagline")}
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-[4.5rem] font-extrabold leading-[1.08] tracking-tight mb-6">
            {t("hero.headline").includes("\n") ? (
              <>
                <span className="text-white">Real People.</span>
                <br />
                <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">Real Africa.</span>
                <br />
                <span className="text-white">Real Connections.</span>
              </>
            ) : (
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">
                {t("hero.headline")}
              </span>
            )}
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            {t("hero.subheadline")}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <Link
              href="/auth/signup"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold text-base hover:from-amber-400 hover:to-orange-400 transition-all duration-200 shadow-2xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5"
            >
              🌍 {t("hero.cta.community")}
            </Link>
            <Link
              href="/auth/signup?mode=professional"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/[0.06] border border-white/[0.12] text-white rounded-xl font-bold text-base hover:bg-white/[0.1] hover:border-white/20 transition-all duration-200 hover:-translate-y-0.5"
            >
              💼 {t("hero.cta.professional")}
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-3 text-sm text-slate-500">
            <div className="flex -space-x-2">
              {["Amara", "Kofi", "Zara", "Kwame", "Fatima"].map((name) => (
                <div key={name} className="w-8 h-8 rounded-full border-2 border-[#080d1a] overflow-hidden ring-1 ring-amber-500/20">
                  <Image
                    src={`https://ui-avatars.com/api/?name=${name}&background=f59e0b&color=fff&size=32`}
                    alt={name} width={32} height={32}
                  />
                </div>
              ))}
            </div>
            <span>Join <strong className="text-amber-400 font-semibold">Africans</strong> {t("hero.tagline").toLowerCase().includes("connect") ? t("hero.tagline") : "connecting across the continent"}</span>
          </div>
        </div>

        {/* Hero visual — dual mode preview cards */}
        <div className="max-w-4xl mx-auto mt-20 grid sm:grid-cols-2 gap-5 relative z-10">
          {/* Community card */}
          <div className="relative bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/20 rounded-2xl p-6 overflow-hidden group hover:border-amber-500/40 transition-all duration-300">
            <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center text-xl">🌍</div>
              <div>
                <div className="text-sm font-bold text-white">{t("features.community.title")}</div>
                <div className="text-xs text-amber-400">{t("features.community.desc")}</div>
              </div>
            </div>
            <div className="space-y-2.5 mb-5">
              {["Verified community members", "Shared interests & values", "Country & language filters", "Video & voice calls"].map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm text-slate-300">
                  <span className="w-4 h-4 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-400 text-[10px] flex-shrink-0">✓</span>
                  {f}
                </div>
              ))}
            </div>
            <Link href="/auth/signup" className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors">
              Join Community Free <span className="text-xs">→</span>
            </Link>
          </div>

          {/* Professional card */}
          <div className="relative bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-transparent border border-blue-500/20 rounded-2xl p-6 overflow-hidden group hover:border-blue-500/40 transition-all duration-300">
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-xl">💼</div>
              <div>
                <div className="text-sm font-bold text-white">{t("features.professional.title")}</div>
                <div className="text-xs text-blue-400">{t("features.professional.desc")}</div>
              </div>
            </div>
            <div className="space-y-2.5 mb-5">
              {["AI-powered career recommendations", "Certified skill courses", "1-on-1 mentorship", "Company culture insights"].map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm text-slate-300">
                  <span className="w-4 h-4 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 text-[10px] flex-shrink-0">✓</span>
                  {f}
                </div>
              ))}
            </div>
            <Link href="/auth/signup?mode=professional" className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors">
              Start Career Free <span className="text-xs">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          STATS BAR
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-14 px-4 border-y border-white/[0.06] bg-white/[0.015]">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { number: "54", label: "Countries", sub: "Pan-African Coverage" },
            { number: "18+", label: "Languages", sub: "Swahili, Hausa, Zulu & more" },
            { number: "2", label: "Modes", sub: "Community & Professional" },
            { number: "100%", label: "African Focus", sub: "Built for Africa, by Africans" },
          ].map((stat) => (
            <div key={stat.label} className="group">
              <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent mb-1 tabular-nums">
                {stat.number}
              </div>
              <div className="text-white font-semibold text-sm mb-0.5">{stat.label}</div>
              <div className="text-slate-500 text-xs">{stat.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          DUAL MODE FEATURES
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-28 px-4" id="features">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-3">One Platform. Two Worlds.</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
              Everything You Need to{" "}
              <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                Connect &amp; Grow
              </span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Switch seamlessly between community connections and building your career — all in one place.
            </p>
          </div>

          {/* Tab toggle */}
          <div className="flex justify-center mb-12">
            <div className="flex bg-white/[0.04] border border-white/[0.08] rounded-xl p-1 gap-1">
              <button
                onClick={() => setActiveTab("community")}
                className={`px-7 py-2.5 rounded-lg font-semibold transition-all duration-200 text-sm ${
                  activeTab === "community"
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                🌍 {t("features.community.title")}
              </button>
              <button
                onClick={() => setActiveTab("professional")}
                className={`px-7 py-2.5 rounded-lg font-semibold transition-all duration-200 text-sm ${
                  activeTab === "professional"
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                💼 {t("features.professional.title")}
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {(activeTab === "community" ? COMMUNITY_FEATURES : PROFESSIONAL_FEATURES).map((feature) => (
              <div
                key={feature.title}
                className="group p-6 bg-white/[0.03] border border-white/[0.07] rounded-2xl hover:border-amber-500/30 hover:bg-white/[0.05] transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className="w-11 h-11 bg-amber-500/10 rounded-xl flex items-center justify-center text-xl mb-4 group-hover:bg-amber-500/15 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-base font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href={activeTab === "community" ? "/auth/signup" : "/auth/signup?mode=professional"}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold text-base hover:from-amber-400 hover:to-orange-400 transition-all duration-200 shadow-xl shadow-amber-500/20 hover:-translate-y-0.5"
            >
              {activeTab === "community" ? t("hero.cta.community") + " →" : t("hero.cta.professional") + " →"}
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-28 px-4 bg-white/[0.015] border-y border-white/[0.06]" id="how-it-works">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-3">Simple Process</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Get Started in 3 Steps</h2>
            <p className="text-slate-400 text-lg">No complicated setup. Sign up free and start connecting in minutes.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-8 left-1/3 right-1/3 h-px bg-gradient-to-r from-amber-500/30 via-orange-500/30 to-amber-500/30" />
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.step} className="relative text-center group">
                <div className="relative inline-flex w-16 h-16 mx-auto mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl blur-sm group-hover:blur-md transition-all" />
                  <div className="relative w-16 h-16 bg-gradient-to-br from-amber-500/15 to-orange-500/15 border border-amber-500/30 rounded-2xl flex items-center justify-center text-2xl group-hover:border-amber-500/50 transition-colors">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-[10px] font-black text-black">
                    {i + 1}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/auth/signup" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold text-base hover:from-amber-400 hover:to-orange-400 transition-all duration-200 shadow-xl shadow-amber-500/20 hover:-translate-y-0.5">
              Create Your Free Account →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          RECRUITER / EMPLOYER SECTION
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-28 px-4" id="recruiters">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-blue-400 text-xs font-semibold uppercase tracking-widest mb-3">For Employers &amp; Recruiters</p>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-5 leading-tight">
                Hire Top African Talent{" "}
                <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  Talent
                </span>
              </h2>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                Access a verified pool of African professionals across every industry and country.
                Post jobs, search talent, and connect directly — no agency fees, no middlemen.
              </p>
              <div className="space-y-4 mb-8">
                {RECRUITER_FEATURES.map((f) => (
                  <div key={f.title} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 mt-0.5">
                      {f.icon}
                    </div>
                    <div>
                      <div className="font-semibold text-white text-sm mb-0.5">{f.title}</div>
                      <div className="text-slate-400 text-sm leading-relaxed">{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/auth/signup?mode=professional&role=recruiter"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-bold text-sm hover:from-blue-400 hover:to-indigo-400 transition-all duration-200 shadow-lg shadow-blue-500/20 hover:-translate-y-0.5"
              >
                Post a Job Free →
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/5 rounded-3xl blur-2xl" />
              <div className="relative bg-white/[0.04] border border-white/[0.08] rounded-3xl p-8 space-y-4">
                <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">Recent Applications</div>
                {[
                  { name: "Amara Osei", role: "Senior Frontend Engineer", location: "Accra, Ghana", badge: "🟢 Available" },
                  { name: "Fatima Ndiaye", role: "Product Manager", location: "Dakar, Senegal", badge: "🟡 Open to offers" },
                  { name: "Kwame Mensah", role: "Data Scientist", location: "Lagos, Nigeria", badge: "🟢 Available" },
                ].map((c) => (
                  <div key={c.name} className="flex items-center gap-4 p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl hover:border-blue-500/20 transition-colors">
                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                      <Image src={`https://ui-avatars.com/api/?name=${c.name}&background=1e3a5f&color=f59e0b&size=40`} alt={c.name} width={40} height={40} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-white text-sm">{c.name}</div>
                      <div className="text-slate-400 text-xs truncate">{c.role} · {c.location}</div>
                    </div>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">{c.badge}</span>
                  </div>
                ))}
                <div className="pt-2 text-center">
                  <span className="text-xs text-slate-500">Discover verified African professionals across industries</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SAFETY & VERIFICATION
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-28 px-4 bg-white/[0.015] border-y border-white/[0.06]" id="safety">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-4">
                {SAFETY_FEATURES.map((f) => (
                  <div key={f.title} className="p-5 bg-white/[0.03] border border-white/[0.07] rounded-2xl hover:border-green-500/20 transition-colors">
                    <div className="text-2xl mb-3">{f.icon}</div>
                    <div className="font-bold text-white text-sm mb-1.5">{f.title}</div>
                    <div className="text-slate-400 text-xs leading-relaxed">{f.desc}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <p className="text-green-400 text-xs font-semibold uppercase tracking-widest mb-3">Safety &amp; Trust</p>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-5 leading-tight">
                Your Safety Is{" "}
                <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  Our Priority
                </span>
              </h2>
              <p className="text-slate-400 text-lg mb-6 leading-relaxed">
                AfriMatch was built with safety at its core. AI-powered moderation, ID verification badges, and dedicated safety tools keep every user in control.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                {["ID Verified", "AI Moderated", "GDPR Compliant", "SSL Encrypted", "Priority Support"].map((badge) => (
                  <span key={badge} className="px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-xs font-semibold">
                    ✓ {badge}
                  </span>
                ))}
              </div>
              <Link
                href="/safety"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl font-semibold text-sm hover:bg-green-500/15 hover:border-green-500/50 transition-all duration-200"
              >
                Visit Safety Centre →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          WHY AFRIMATCH IS DIFFERENT
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-28 px-4" id="why-afrimatch">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-3">Why AfriMatch</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
              Not Another Western App{" "}
              <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                Rebranded
              </span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              AfriMatch was designed from the ground up for African users — with African values, African payment methods, and African languages.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHY_DIFFERENT.map((item) => (
              <div key={item.title} className="group p-6 bg-white/[0.03] border border-white/[0.07] rounded-2xl hover:border-amber-500/25 hover:bg-white/[0.05] transition-all duration-300 hover:-translate-y-0.5">
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          TESTIMONIALS
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-28 px-4 bg-white/[0.015] border-y border-white/[0.06]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-3">Real Stories</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              Hear From Our{" "}
              <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                Community
              </span>
            </h2>
            <p className="text-slate-400 text-lg">Beta members sharing their early experiences on AfriMatch.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="group p-6 bg-white/[0.03] border border-white/[0.07] rounded-2xl hover:border-amber-500/20 transition-all duration-300">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-amber-500/20">
                    <Image src={t.avatar} alt={t.name} width={48} height={48} />
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">{t.name}</div>
                    <div className="text-slate-500 text-xs mt-0.5">{t.location}</div>
                    <span className={`inline-block mt-1.5 text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      t.mode === "community"
                        ? "bg-amber-500/15 text-amber-400"
                        : "bg-blue-500/15 text-blue-400"
                    }`}>
                      {t.mode === "community" ? "🌍 Community" : "💼 Professional"}
                    </span>
                  </div>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <div className="mt-4 flex gap-0.5">
                  {[1,2,3,4,5].map((s) => <span key={s} className="text-amber-400 text-sm">★</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          APP COMING SOON + EARLY ACCESS
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-28 px-4" id="app">
        <div className="max-w-5xl mx-auto">
          <div className="relative bg-gradient-to-br from-amber-500/8 via-orange-500/5 to-purple-500/8 border border-amber-500/15 rounded-3xl p-10 md:p-16 text-center overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-amber-500/10 rounded-full blur-3xl" />
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-semibold mb-6 uppercase tracking-wide">
                📱 Mobile App — Coming Soon
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                AfriMatch in Your Pocket
              </h2>
              <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
                Native iOS and Android apps are in development. Join the early access list and be the first to know when we launch.
              </p>

              {earlyAccessSubmitted ? (
                <div className="inline-flex items-center gap-2 px-6 py-3.5 bg-green-500/15 border border-green-500/30 rounded-xl text-green-400 font-semibold">
                  ✓ You&apos;re on the list! We&apos;ll notify you at launch.
                </div>
              ) : (
                <form onSubmit={handleEarlyAccess} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    value={earlyAccessEmail}
                    onChange={(e) => setEarlyAccessEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="flex-1 px-4 py-3 bg-white/[0.06] border border-white/[0.12] rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500/50 transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold text-sm hover:from-amber-400 hover:to-orange-400 transition-all duration-200 shadow-lg shadow-amber-500/20 whitespace-nowrap"
                  >
                    Join Waitlist
                  </button>
                </form>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Link href="/auth/signup" className="flex items-center gap-3 px-6 py-4 bg-white/[0.05] border border-white/[0.1] rounded-xl hover:bg-white/[0.08] transition-colors group">
                  <span className="text-2xl">🌍</span>
                  <div className="text-left">
                    <div className="text-[10px] text-slate-500 uppercase tracking-wide">Available Now</div>
                    <div className="font-bold text-white text-sm">Web Browser</div>
                  </div>
                </Link>
                <div className="flex items-center gap-3 px-6 py-4 bg-white/[0.02] border border-white/[0.06] rounded-xl opacity-50 cursor-default">
                  <span className="text-2xl">🍎</span>
                  <div className="text-left">
                    <div className="text-[10px] text-slate-500 uppercase tracking-wide">Coming Soon</div>
                    <div className="font-bold text-white text-sm">iOS App</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-6 py-4 bg-white/[0.02] border border-white/[0.06] rounded-xl opacity-50 cursor-default">
                  <span className="text-2xl">🤖</span>
                  <div className="text-left">
                    <div className="text-[10px] text-slate-500 uppercase tracking-wide">Coming Soon</div>
                    <div className="font-bold text-white text-sm">Android App</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          FAQ
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-28 px-4 bg-white/[0.015] border-y border-white/[0.06]" id="faq">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-3">FAQ</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Common Questions</h2>
            <p className="text-slate-400 text-lg">Everything you need to know before joining.</p>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className={`border rounded-xl overflow-hidden transition-all duration-200 ${
                  openFaq === i ? "border-amber-500/30 bg-amber-500/5" : "border-white/[0.07] bg-white/[0.02] hover:border-white/[0.12]"
                }`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                >
                  <span className="font-semibold text-white text-sm pr-4">{faq.q}</span>
                  <span className={`text-amber-400 text-lg flex-shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-45" : ""}`}>+</span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5">
                    <p className="text-slate-400 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <p className="text-slate-500 text-sm">
              Still have questions?{" "}
              <Link href="/contact" className="text-amber-400 hover:text-amber-300 transition-colors font-medium">
                Contact our team →
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          FINAL CTA
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-28 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-semibold mb-8 uppercase tracking-wide">
            🚀 Free to Join. Always.
          </div>
          <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            Your Story Starts{" "}
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Today.</span>
          </h2>
          <p className="text-slate-400 text-xl mb-10 leading-relaxed">
            Free to join. Free to connect. Premium features when you&apos;re ready to level up.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold text-lg hover:from-amber-400 hover:to-orange-400 transition-all duration-200 shadow-2xl shadow-amber-500/30 hover:-translate-y-0.5"
            >
              Join AfriMatch Free →
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-white/[0.05] border border-white/[0.12] text-white rounded-xl font-bold text-lg hover:bg-white/[0.08] transition-all duration-200 hover:-translate-y-0.5"
            >
              View Pricing
            </Link>
          </div>
          <p className="mt-5 text-slate-600 text-sm">No credit card required. Cancel anytime.</p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════════════════════════════ */}
      <footer className="border-t border-white/[0.06] py-16 px-4 bg-[#050a14]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-10 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl overflow-hidden ring-1 ring-amber-500/20">
                  <Image src="/images/afrimatch-logo.png" alt="AfriMatch" width={36} height={36} className="object-cover" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">AfriMatch</span>
              </Link>
              <p className="text-slate-500 text-sm leading-relaxed mb-5 max-w-xs">
                Africa&apos;s platform for community and professional growth. Connecting 54 nations through trusted community discovery and career opportunities.
              </p>
              <div className="flex gap-3">
                {["Twitter", "LinkedIn", "Instagram"].map((s) => (
                  <div key={s} className="w-8 h-8 bg-white/[0.05] border border-white/[0.08] rounded-lg flex items-center justify-center text-slate-500 text-xs hover:border-amber-500/30 hover:text-amber-400 transition-colors cursor-default">
                    {s[0]}
                  </div>
                ))}
              </div>
            </div>

            {/* Community */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Community</h4>
              <ul className="space-y-2.5 text-sm text-slate-500">
                {[
                  { label: "Browse Members", href: "/community" },
                  { label: "How It Works", href: "/#how-it-works" },
                  { label: "Success Stories", href: "/blog" },
                  { label: "Safety Centre", href: "/safety" },
                  { label: "Pricing", href: "/pricing" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="hover:text-amber-400 transition-colors duration-200">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Professional */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Professional</h4>
              <ul className="space-y-2.5 text-sm text-slate-500">
                {[
                  { label: "Find Jobs", href: "/professional/jobs" },
                  { label: "Online Courses", href: "/professional/courses" },
                  { label: "Find a Mentor", href: "/professional/mentors" },
                  { label: "Post a Job", href: "/professional/jobs" },
                  { label: "For Recruiters", href: "/#recruiters" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="hover:text-amber-400 transition-colors duration-200">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
              <ul className="space-y-2.5 text-sm text-slate-500">
                {[
                  { label: "About Us", href: "/about" },
                  { label: "Blog", href: "/blog" },
                  { label: "Careers", href: "/careers" },
                  { label: "Press", href: "/press" },
                  { label: "Contact", href: "/contact" },
                  { label: "Privacy Policy", href: "/privacy" },
                  { label: "Terms of Service", href: "/terms" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="hover:text-amber-400 transition-colors duration-200">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-white/[0.06] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-600 text-sm">© 2026 ZuriTech Global. All rights reserved. Built with ❤️ for Africa.</p>
            <div className="flex gap-6 text-sm text-slate-600">
              <Link href="/privacy" className="hover:text-slate-400 transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-slate-400 transition-colors">Terms</Link>
              <Link href="/safety" className="hover:text-slate-400 transition-colors">Safety</Link>
              <Link href="/contact" className="hover:text-slate-400 transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
