"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n/use-translation";

type Mode = "community" | "professional" | "both";
type Step = "mode" | "auth";

const MODES = [
  {
    id: "community" as Mode,
    icon: "🌍",
    uiLabel: "community" as const,
    color: "hover:border-amber-500/60 hover:bg-amber-500/5",
    activeColor: "border-amber-500/60 bg-amber-500/5",
    badge: null,
  },
  {
    id: "professional" as Mode,
    icon: "💼",
    uiLabel: "professional" as const,
    color: "hover:border-blue-500/60 hover:bg-blue-500/5",
    activeColor: "border-blue-500/60 bg-blue-500/5",
    badge: null,
  },
  {
    id: "both" as Mode,
    icon: "🌟",
    uiLabel: "both" as const,
    color: "hover:border-amber-500/60 hover:bg-amber-500/5",
    activeColor: "border-amber-500/60 bg-amber-500/5",
    badge: "Most Popular",
  },
];

export default function SignupPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [step, setStep] = useState<Step>("mode");
  const [selectedMode, setSelectedMode] = useState<Mode>("both");
  const [authMethod, setAuthMethod] = useState<"email" | "phone" | null>(null);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) { setError("Passwords do not match"); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters"); return; }
    setLoading(true);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, mode: selectedMode }),
      });
      const data = await response.json();
      if (!response.ok) { setError(data.message || "Signup failed"); return; }
      setSuccess("Account created! Signing you in...");
      const loginResult = await signIn("credentials", { email, password, redirect: false });
      if (loginResult?.ok) {
        setTimeout(() => router.push("/auth/profile-setup"), 1200);
      } else {
        setTimeout(() => router.push("/auth/login"), 1200);
      }
    } catch {
      setError("An error occurred. Please try again.");
      setStep("auth");
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/auth/phone-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, mode: selectedMode }),
      });
      const data = await response.json();
      if (!response.ok) { setError(data.message || "Failed to send OTP"); return; }
      setTimeout(() => router.push(`/auth/verify-phone?sessionId=${data.sessionId}`), 1200);
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080d1a] flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[42%] relative flex-col justify-between p-12 bg-gradient-to-br from-[#0d1526] to-[#080d1a] border-r border-white/[0.06] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl" />
        </div>
        <Link href="/" className="relative flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl overflow-hidden ring-1 ring-amber-500/20">
            <Image src="/images/afrimatch-logo.png" alt="AfriMatch" width={36} height={36} className="object-cover" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">AfriMatch</span>
        </Link>
        <div className="relative space-y-6">
          <h2 className="text-3xl font-extrabold text-white leading-tight">
            One account.<br />Two powerful worlds.
          </h2>
          <div className="space-y-4">
            {[
              { icon: "🌍", title: "Community Mode", desc: "Connect authentically across 54 African countries" },
              { icon: "💼", title: "Professional Mode", desc: "Land your dream job, find mentors, grow your career" },
              { icon: "🔒", title: "Verified & Safe", desc: "Verified profiles. Trusted community." },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <div className="w-9 h-9 bg-amber-500/10 rounded-lg flex items-center justify-center text-base flex-shrink-0">{item.icon}</div>
                <div>
                  <div className="text-white font-semibold text-sm">{item.title}</div>
                  <div className="text-slate-500 text-xs mt-0.5">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="flex -space-x-2 mb-3">
            {["Amara", "Kofi", "Zara", "Kwame"].map((name) => (
              <div key={name} className="w-8 h-8 rounded-full border-2 border-[#0d1526] overflow-hidden">
                <Image src={`https://ui-avatars.com/api/?name=${name}&background=f59e0b&color=fff&size=32`} alt={name} width={32} height={32} />
              </div>
            ))}
          </div>
          <p className="text-slate-500 text-xs">Join Africans already connecting on AfriMatch</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-[440px]">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl overflow-hidden">
                <Image src="/images/afrimatch-logo.png" alt="AfriMatch" width={36} height={36} className="object-cover" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">AfriMatch</span>
            </Link>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center gap-2 mb-8">
            {["Choose Mode", "Create Account"].map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                  (step === "mode" && i === 0) || (step === "auth" && i === 1)
                    ? "bg-amber-500 text-black"
                    : (step === "auth" && i === 0)
                    ? "bg-green-500 text-black"
                    : "bg-white/[0.08] text-slate-500"
                }`}>
                  {(step === "auth" && i === 0) ? "✓" : i + 1}
                </div>
                <span className={`text-xs font-medium ${step === "mode" && i === 0 ? "text-white" : step === "auth" && i === 1 ? "text-white" : "text-slate-500"}`}>
                  {label}
                </span>
                {i < 1 && <div className="w-8 h-px bg-white/[0.1]" />}
              </div>
            ))}
          </div>

          {/* STEP 1: Mode selection */}
          {step === "mode" && (
            <div>
              <div className="mb-7">
                <h1 className="text-3xl font-extrabold text-white mb-2">{t("auth.signup.title")}</h1>
                <p className="text-slate-400 text-sm">Choose how you want to use AfriMatch — you can always switch later.</p>
              </div>
              <div className="space-y-3 mb-6">
                {MODES.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setSelectedMode(mode.id)}
                    className={`w-full p-4 border rounded-xl text-left transition-all duration-200 relative ${
                      selectedMode === mode.id ? mode.activeColor + " border-opacity-100" : "border-white/[0.08] bg-white/[0.02] " + mode.color
                    }`}
                  >
                    {mode.badge && (
                      <span className="absolute top-3 right-3 px-2 py-0.5 bg-amber-500 text-black text-[10px] font-bold rounded-full">{mode.badge}</span>
                    )}
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{mode.icon}</span>
                      <div>
                        <div className="font-bold text-white text-sm">
                          {mode.uiLabel === "community" ? t("features.community.title") : mode.uiLabel === "professional" ? t("features.professional.title") : t("features.community.title") + " + " + t("features.professional.title")}
                        </div>
                        <div className="text-slate-400 text-xs mt-0.5">
                          {mode.uiLabel === "community" ? t("features.community.desc") : mode.uiLabel === "professional" ? t("features.professional.desc") : t("features.safe.desc")}
                        </div>
                      </div>
                      {selectedMode === mode.id && (
                        <div className="ml-auto w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center text-black text-[10px] font-bold flex-shrink-0">✓</div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep("auth")}
                    className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold text-sm hover:from-amber-400 hover:to-orange-400 transition-all duration-200 shadow-lg shadow-amber-500/20"
              >
                {t("common.next")} →
              </button>
            </div>
          )}

          {/* STEP 2: Auth */}
          {step === "auth" && (
            <div>
              <div className="mb-7">
                <button onClick={() => setStep("mode")} className="text-slate-500 hover:text-slate-300 text-xs mb-4 flex items-center gap-1 transition-colors">
                  ← Back
                </button>
                <h1 className="text-3xl font-extrabold text-white mb-2">{t("auth.signup.button")}</h1>
                <p className="text-slate-400 text-sm">
                  Signing up as{" "}
                  <span className="text-amber-400 font-semibold">
                    {selectedMode === "both" ? "Community + Professional" : selectedMode === "community" ? "Community" : "Professional"}
                  </span>
                </p>
              </div>

              {/* Social */}
              {!authMethod && (
                <>
                  <div className="space-y-2.5 mb-5">
                    <button
                      onClick={() => signIn("google", { callbackUrl: "/auth/profile-setup" })}
                      className="w-full flex items-center justify-center gap-3 py-3 bg-white text-slate-900 rounded-xl font-semibold text-sm hover:bg-slate-100 transition-all duration-200"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Continue with Google
                    </button>
                    <button
                      onClick={() => signIn("facebook", { callbackUrl: "/auth/profile-setup" })}
                      className="w-full flex items-center justify-center gap-3 py-3 bg-[#1877F2] text-white rounded-xl font-semibold text-sm hover:bg-[#166FE5] transition-all duration-200"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      Continue with Facebook
                    </button>
                  </div>
                  <div className="relative mb-5">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/[0.08]" /></div>
                    <div className="relative flex justify-center text-xs"><span className="px-3 bg-[#080d1a] text-slate-500">or sign up with</span></div>
                  </div>
                  <div className="space-y-2.5">
                    <button onClick={() => setAuthMethod("email")} className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold text-sm hover:from-amber-400 hover:to-orange-400 transition-all duration-200 shadow-lg shadow-amber-500/20">
                      Sign Up with Email
                    </button>
                    <button onClick={() => setAuthMethod("phone")} className="w-full py-3 bg-white/[0.05] border border-white/[0.1] text-white rounded-xl font-semibold text-sm hover:bg-white/[0.08] transition-all duration-200">
                      Sign Up with Phone
                    </button>
                  </div>
                </>
              )}

              {/* Email form */}
              {authMethod === "email" && (
                <form onSubmit={handleEmailSignup} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">{t("auth.signup.email")}</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com"
                      className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.1] rounded-xl text-white placeholder-slate-600 text-sm focus:border-amber-500/60 focus:outline-none transition-all" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">{t("auth.signup.password")}</label>
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 8 characters"
                        className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.1] rounded-xl text-white placeholder-slate-600 text-sm focus:border-amber-500/60 focus:outline-none transition-all pr-10" required />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs transition-colors">{showPassword ? "Hide" : "Show"}</button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Confirm Password</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••"
                      className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.1] rounded-xl text-white placeholder-slate-600 text-sm focus:border-amber-500/60 focus:outline-none transition-all" required />
                  </div>
                  {error && <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm"><span>⚠️</span> {error}</div>}
                  <button type="submit" disabled={loading}
                    className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold text-sm hover:from-amber-400 hover:to-orange-400 transition-all duration-200 shadow-lg shadow-amber-500/20 disabled:opacity-50">
                    {loading ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{t("common.loading")}</span> : t("auth.signup.button") + " →"}
                  </button>
                  <button type="button" onClick={() => setAuthMethod(null)} className="w-full py-2 text-slate-500 hover:text-slate-300 text-sm transition-colors">← Back</button>
                  <p className="text-xs text-slate-600 text-center">{t("auth.signup.terms")}</p>
                </form>
              )}

              {/* Phone form */}
              {authMethod === "phone" && (
                <form onSubmit={handlePhoneSignup} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Phone Number</label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+234 800 000 0000"
                      className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.1] rounded-xl text-white placeholder-slate-600 text-sm focus:border-amber-500/60 focus:outline-none transition-all" required />
                    <p className="text-xs text-slate-500 mt-1.5">Include country code (e.g., +234, +27, +254)</p>
                  </div>
                  {error && <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm"><span>⚠️</span> {error}</div>}
                  <button type="submit" disabled={loading}
                    className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold text-sm hover:from-amber-400 hover:to-orange-400 transition-all duration-200 shadow-lg shadow-amber-500/20 disabled:opacity-50">
                    {loading ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending OTP...</span> : "Send OTP →"}
                  </button>
                  <button type="button" onClick={() => setAuthMethod(null)} className="w-full py-2 text-slate-500 hover:text-slate-300 text-sm transition-colors">← Back</button>
                </form>
              )}
            </div>
          )}

                    {/* Success state shown inline */}
          {success && step === "auth" && (
            <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-center">
              <div className="text-2xl mb-2">🎉</div>
              <p className="text-green-400 text-sm font-medium">{success}</p>
              <div className="flex justify-center mt-3">
                <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
              </div>
            </div>
          )}
          <p className="mt-7 text-center text-slate-500 text-sm">
            {t("auth.signup.hasaccount")}{" "}
            <Link href="/auth/login" className="text-amber-400 hover:text-amber-300 transition-colors font-semibold">{t("nav.signin")} →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
