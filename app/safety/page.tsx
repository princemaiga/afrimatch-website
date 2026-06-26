"use client";

import Link from "next/link";
import { Navbar } from "@/components/navbar";

const SAFETY_FEATURES = [
  {
    icon: "✅",
    title: "Profile Verification",
    desc: "Every user is encouraged to verify their identity with a government-issued ID or selfie verification. Verified profiles receive a blue checkmark visible to all users.",
    color: "from-green-500/10 to-emerald-500/10",
    border: "border-green-500/20",
    accent: "text-green-400",
  },
  {
    icon: "🤖",
    title: "AI-Powered Moderation",
    desc: "Our AI systems continuously scan messages, images, and profiles to detect and remove scams, harassment, explicit content, and fake accounts before they reach you.",
    color: "from-blue-500/10 to-indigo-500/10",
    border: "border-blue-500/20",
    accent: "text-blue-400",
  },
  {
    icon: "🚫",
    title: "Block & Report",
    desc: "Block any user instantly and report suspicious behaviour with one tap. Our trust & safety team reviews every report within 24 hours.",
    color: "from-red-500/10 to-rose-500/10",
    border: "border-red-500/20",
    accent: "text-red-400",
  },
  {
    icon: "🔒",
    title: "End-to-End Encryption",
    desc: "All messages between users are encrypted in transit and at rest. We never read your private conversations.",
    color: "from-purple-500/10 to-violet-500/10",
    border: "border-purple-500/20",
    accent: "text-purple-400",
  },
  {
    icon: "📍",
    title: "Location Privacy",
    desc: "We never share your exact location. Distances are shown as approximate ranges. You control what location information is visible on your profile.",
    color: "from-amber-500/10 to-orange-500/10",
    border: "border-amber-500/20",
    accent: "text-amber-400",
  },
  {
    icon: "👁️",
    title: "Privacy Controls",
    desc: "Premium members can control who sees their profile activity and manage their visibility settings. Your privacy is always in your hands.",
    color: "from-slate-500/10 to-gray-500/10",
    border: "border-slate-500/20",
    accent: "text-slate-400",
  },
];

const SAFETY_TIPS = [
  {
    category: "Protecting Your Account",
    tips: [
      "Use a strong, unique password for your AfriMatch account and enable two-factor authentication if available.",
      "Never share your login credentials or account access with anyone.",
      "Log out of shared or public devices after every session.",
      "Review your connected apps and active sessions regularly from account settings.",
    ],
  },
  {
    category: "Protecting Your Information",
    tips: [
      "Never share financial information, bank details, or passwords with anyone you connect with online.",
      "Be cautious of anyone who asks for money, gift cards, or crypto — this is almost always a scam.",
      "Keep professional conversations on AfriMatch messaging until you have established trust.",
      "Report any request for money or personal financial details immediately using the Report button.",
    ],
  },
  {
    category: "Recognising Suspicious Accounts",
    tips: [
      "Watch for profiles that seem too perfect, use generic stock-photo images, or have very little activity.",
      "Be cautious of anyone who makes unusually large promises (jobs, investment returns, opportunities) very quickly.",
      "Fraudsters often create urgency — legitimate opportunities do not require immediate payment or personal details.",
      "If something feels wrong, trust your instincts and report the account.",
    ],
  },
];

export default function SafetyCentrePage() {
  return (
    <div className="min-h-screen bg-[#080d1a] text-white">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-28 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-radial from-green-500/8 via-emerald-500/4 to-transparent rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-xs font-semibold mb-8 tracking-wide uppercase">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
            Safety Centre
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            Your Safety is Our{" "}
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Top Priority
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
            AfriMatch is built on trust. We use advanced technology, human review, and community guidelines
            to keep every member safe — whether you are here to build your network or advance your career.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl hover:from-green-400 hover:to-emerald-400 transition-all shadow-lg shadow-green-500/20"
            >
              Join Safely Today
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/5 transition-all"
            >
              Report an Issue
            </Link>
          </div>
        </div>
      </section>

      {/* Safety Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How We Keep You Safe
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Multiple layers of protection work together to create a safe environment for every user.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SAFETY_FEATURES.map((feature) => (
              <div
                key={feature.title}
                className={`bg-gradient-to-br ${feature.color} border ${feature.border} rounded-2xl p-7 hover:scale-[1.02] transition-transform duration-200`}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className={`text-lg font-bold mb-3 ${feature.accent}`}>{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Tips */}
      <section className="py-20 px-4 bg-white/[0.02] border-y border-white/[0.05]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Safety Tips for Members
            </h2>
            <p className="text-slate-400 text-lg">
              Follow these guidelines to protect yourself and enjoy AfriMatch safely.
            </p>
          </div>
          <div className="space-y-8">
            {SAFETY_TIPS.map((section) => (
              <div key={section.category} className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-7">
                <h3 className="text-lg font-bold text-amber-400 mb-5">{section.category}</h3>
                <ul className="space-y-3">
                  {section.tips.map((tip) => (
                    <li key={tip} className="flex items-start gap-3 text-slate-300 text-sm leading-relaxed">
                      <span className="text-green-400 mt-0.5 flex-shrink-0">✓</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Resources */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-4">Emergency Resources</h2>
            <p className="text-slate-400">If you are in immediate danger, please contact local emergency services.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { country: "Nigeria", number: "112 / 199", desc: "Nigeria Emergency Management Agency" },
              { country: "Kenya", number: "999 / 112", desc: "Kenya National Police Service" },
              { country: "Ghana", number: "191 / 192", desc: "Ghana Police Service / Ambulance" },
              { country: "South Africa", number: "10111 / 10177", desc: "SAPS / Ambulance Service" },
              { country: "United Kingdom", number: "999 / 101", desc: "Emergency / Non-Emergency Police" },
              { country: "United States", number: "911", desc: "Emergency Services" },
            ].map((resource) => (
              <div key={resource.country} className="flex items-center gap-4 p-5 bg-white/[0.03] border border-white/[0.07] rounded-xl">
                <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 text-xl flex-shrink-0">
                  🆘
                </div>
                <div>
                  <p className="font-semibold text-white">{resource.country}</p>
                  <p className="text-red-400 font-bold text-lg">{resource.number}</p>
                  <p className="text-slate-500 text-xs">{resource.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Report CTA */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-3xl p-12">
            <div className="text-5xl mb-6">🛡️</div>
            <h2 className="text-3xl font-bold text-white mb-4">See Something? Report It.</h2>
            <p className="text-slate-400 mb-8 leading-relaxed">
              Our Trust & Safety team reviews every report within 24 hours. Your report helps protect
              the entire AfriMatch community. You can report directly from any profile or message.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/20"
              >
                Contact Safety Team
              </Link>
              <Link
                href="/auth/signup"
                className="px-8 py-4 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/5 transition-all"
              >
                Join AfriMatch
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.05] py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-slate-600 text-sm">
          <p>&copy; {new Date().getFullYear()} <span className="text-slate-400 font-medium">ZuriTech Global</span>. All rights reserved.</p>
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
