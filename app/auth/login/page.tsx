"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n/use-translation";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [authMethod, setAuthMethod] = useState<"email" | "phone" | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await signIn("credentials", { email, password, redirect: false });
      if (!result?.ok) {
        setError(result?.error === "CredentialsSignin" ? "Incorrect email or password." : result?.error || "Login failed");
        return;
      }
      router.push("/dashboard");
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/auth/phone-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await response.json();
      if (!response.ok) { setError(data.message || "Failed to send OTP"); return; }
      router.push(`/auth/verify-phone?sessionId=${data.sessionId}&isLogin=true`);
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080d1a] flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-[45%] relative flex-col justify-between p-12 bg-gradient-to-br from-[#0d1526] to-[#080d1a] border-r border-white/[0.06] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl" />
        </div>
        <Link href="/" className="relative flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl overflow-hidden ring-1 ring-amber-500/20">
            <Image src="/images/afrimatch-logo.png" alt="AfriMatch" width={36} height={36} className="object-cover" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">AfriMatch</span>
        </Link>
        <div className="relative">
          <blockquote className="text-2xl font-bold text-white leading-snug mb-6">
            &ldquo;The only platform built for African professionals and communities.&rdquo;
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-amber-500/30">
              <Image src="https://ui-avatars.com/api/?name=Amara+Osei&background=f59e0b&color=fff&size=40" alt="Amara" width={40} height={40} />
            </div>
            <div>
              <div className="text-white font-semibold text-sm">Amara Osei</div>
              <div className="text-slate-500 text-xs">Accra, Ghana · AfriMatch Member</div>
            </div>
          </div>
        </div>
        <div className="relative flex gap-3">
          {["54 Countries", "18+ Languages", "Free to Join"].map((b) => (
            <span key={b} className="px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-full text-slate-400 text-xs">{b}</span>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl overflow-hidden">
                <Image src="/images/afrimatch-logo.png" alt="AfriMatch" width={36} height={36} className="object-cover" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">AfriMatch</span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-white mb-2">{t("auth.signin.title")}</h1>
            <p className="text-slate-400 text-sm">{t("auth.signin.subtitle")}</p>
          </div>

          {/* Social login */}
          <div className="space-y-2.5 mb-6">
            <button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="w-full flex items-center justify-center gap-3 py-3 bg-white text-slate-900 rounded-xl font-semibold text-sm hover:bg-slate-100 transition-all duration-200 shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {t("auth.signin.google")}
            </button>
            <button
              onClick={() => signIn("facebook", { callbackUrl: "/dashboard" })}
              className="w-full flex items-center justify-center gap-3 py-3 bg-[#1877F2] text-white rounded-xl font-semibold text-sm hover:bg-[#166FE5] transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              {t("auth.signin.facebook")}
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.08]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-[#080d1a] text-slate-500">{t("common.or")} {t("auth.signin.title").toLowerCase()} {t("common.or")}</span>
            </div>
          </div>

          {/* Method selector */}
          {!authMethod && (
            <div className="space-y-2.5">
              <button
                onClick={() => setAuthMethod("email")}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold text-sm hover:from-amber-400 hover:to-orange-400 transition-all duration-200 shadow-lg shadow-amber-500/20"
              >
                {t("auth.signin.email.btn")}
              </button>
              <button
                onClick={() => setAuthMethod("phone")}
                className="w-full py-3 bg-white/[0.05] border border-white/[0.1] text-white rounded-xl font-semibold text-sm hover:bg-white/[0.08] transition-all duration-200"
              >
                {t("auth.signin.phone")}
              </button>
            </div>
          )}

          {/* Email form */}
          {authMethod === "email" && (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">{t("auth.signin.email")}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.1] rounded-xl text-white placeholder-slate-600 text-sm focus:border-amber-500/60 focus:bg-white/[0.07] focus:outline-none transition-all duration-200"
                  required
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{t("auth.signin.password")}</label>
                  <Link href="/auth/forgot-password" className="text-xs text-amber-400 hover:text-amber-300 transition-colors">{t("auth.signin.forgot")}</Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.1] rounded-xl text-white placeholder-slate-600 text-sm focus:border-amber-500/60 focus:bg-white/[0.07] focus:outline-none transition-all duration-200 pr-10"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors text-xs">
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                  <span className="flex-shrink-0">⚠️</span> {error}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold text-sm hover:from-amber-400 hover:to-orange-400 transition-all duration-200 shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : t("auth.signin.button")}
              </button>
              <button type="button" onClick={() => setAuthMethod(null)} className="w-full py-2 text-slate-500 hover:text-slate-300 transition-colors text-sm">
                ← {t("common.back")}
              </button>
            </form>
          )}

          {/* Phone form */}
          {authMethod === "phone" && (
            <form onSubmit={handlePhoneLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">{t("validation.phone")}</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+234 800 000 0000"
                  className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.1] rounded-xl text-white placeholder-slate-600 text-sm focus:border-amber-500/60 focus:outline-none transition-all duration-200"
                  required
                />
                <p className="text-xs text-slate-500 mt-1.5">Include country code (e.g., +234, +27, +254)</p>
              </div>
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                  <span>⚠️</span> {error}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold text-sm hover:from-amber-400 hover:to-orange-400 transition-all duration-200 shadow-lg shadow-amber-500/20 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t("common.loading")}
                  </span>
                ) : t("auth.signin.otp")}
              </button>
              <button type="button" onClick={() => setAuthMethod(null)} className="w-full py-2 text-slate-500 hover:text-slate-300 transition-colors text-sm">
                ← {t("common.back")}
              </button>
            </form>
          )}

          <p className="mt-8 text-center text-slate-500 text-sm">
            {t("auth.signin.noaccount")}{" "}
            <Link href="/auth/signup" className="text-amber-400 hover:text-amber-300 transition-colors font-semibold">
              {t("common.joinfree")} →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
