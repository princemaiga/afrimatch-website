"use client";
export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams()!;
  const [activeMode, setActiveMode] = useState<"community" | "professional">("community");
  const [subscription, setSubscription] = useState<any>(null);
  const [paymentBanner, setPaymentBanner] = useState<"success" | "cancelled" | null>(null);
  const [loadingSub, setLoadingSub] = useState(true);

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  // Check payment status from URL params
  useEffect(() => {
    const payment = searchParams?.get("payment");
    if (payment === "success") {
      setPaymentBanner("success");
      // Clean URL
      const url = new URL(window.location.href);
      url.searchParams.delete("payment");
      url.searchParams.delete("plan");
      url.searchParams.delete("provider");
      window.history.replaceState({}, "", url.pathname);
    } else if (payment === "cancelled") {
      setPaymentBanner("cancelled");
    }
  }, [searchParams]);

  // Fetch real subscription status
  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/payments")
        .then((r) => r.json())
        .then((data) => {
          setSubscription(data.active ?? null);
        })
        .catch(() => setSubscription(null))
        .finally(() => setLoadingSub(false));
    }
  }, [status]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") return null;

  const userName = session?.user?.name || session?.user?.email?.split("@")[0] || "there";
  const userInitial = userName.charAt(0).toUpperCase();
  const isPremium = !!subscription;

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-[#0a0f1e]/90 backdrop-blur-xl z-50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden">
              <Image src="/images/afrimatch-logo.png" alt="AfriMatch" fill className="object-cover" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">AfriMatch</span>
          </Link>

          {/* Mode switcher */}
          <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 gap-1">
            <button
              onClick={() => setActiveMode("community")}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${activeMode === "community" ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white" : "text-slate-400 hover:text-white"}`}
            >
              🌍 Community
            </button>
            <button
              onClick={() => setActiveMode("professional")}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${activeMode === "professional" ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white" : "text-slate-400 hover:text-white"}`}
            >
              💼 Professional
            </button>
          </div>

          <div className="flex items-center gap-3">
            {isPremium && (
              <span className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-amber-500/20 border border-amber-500/30 rounded-lg text-amber-400 text-xs font-semibold">
                ⭐ Premium
              </span>
            )}
            <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xs font-bold">
              {userInitial}
            </div>
            <button
              onClick={handleSignOut}
              className="text-sm text-slate-400 hover:text-white transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <div className="pt-20 max-w-7xl mx-auto px-4 py-8">
        {/* Payment success/cancelled banner */}
        {paymentBanner === "success" && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎉</span>
              <div>
                <p className="text-green-400 font-semibold">Payment successful! Welcome to Premium.</p>
                <p className="text-slate-400 text-sm">Your subscription is now active. Enjoy all premium features.</p>
              </div>
            </div>
            <button onClick={() => setPaymentBanner(null)} className="text-slate-500 hover:text-white transition text-xl">×</button>
          </div>
        )}
        {paymentBanner === "cancelled" && (
          <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">ℹ️</span>
              <p className="text-amber-400">Payment was cancelled. You can upgrade anytime from the <Link href="/pricing" className="underline">pricing page</Link>.</p>
            </div>
            <button onClick={() => setPaymentBanner(null)} className="text-slate-500 hover:text-white transition text-xl">×</button>
          </div>
        )}

        {/* Welcome banner */}
        <div className="mb-8 p-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Welcome back, {userName}! 👋</h1>
              <p className="text-slate-400 text-sm">
                {activeMode === "community"
                  ? "Complete your profile to start connecting with your community."
                  : "Build your professional network across Africa."}
              </p>
            </div>
            <Link
              href={activeMode === "community" ? "/community" : "/professional/jobs"}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold text-sm hover:from-amber-400 hover:to-orange-400 transition"
            >
              {activeMode === "community" ? "Explore Community" : "Find Jobs"}
            </Link>
          </div>
        </div>

        {/* Subscription status */}
        {!loadingSub && (
          <div className="mb-8">
            {isPremium ? (
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⭐</span>
                  <div>
                    <p className="text-amber-400 font-semibold">Premium Active</p>
                    <p className="text-slate-400 text-xs">
                      Plan: {subscription.planId?.replace(/_/g, " ")} · Renews:{" "}
                      {subscription.currentPeriodEnd
                        ? new Date(subscription.currentPeriodEnd).toLocaleDateString()
                        : "—"}
                    </p>
                  </div>
                </div>
                <Link href="/pricing" className="text-sm text-amber-400 hover:text-amber-300 transition">Manage Plan →</Link>
              </div>
            ) : (
              <div className="p-4 bg-white/3 border border-white/8 rounded-2xl flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="text-white font-semibold">Free Plan</p>
                  <p className="text-slate-400 text-xs">Upgrade to unlock unlimited features</p>
                </div>
                <Link
                  href="/pricing"
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-sm font-semibold hover:from-amber-400 hover:to-orange-400 transition"
                >
                  Upgrade to Premium
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Main content */}
        {activeMode === "community" ? (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Community</h2>
                <Link href="/community" className="text-amber-400 text-sm hover:text-amber-300 transition">Explore →</Link>
              </div>
              <div className="p-8 bg-white/3 border border-white/8 rounded-2xl text-center">
                <div className="text-4xl mb-3">❤️</div>
                <p className="text-white font-semibold mb-1">No connections yet</p>
                <p className="text-slate-400 text-sm mb-4">Complete your profile and start discovering people near you.</p>
                <Link
                  href="/community"
                  className="inline-block px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-sm font-semibold hover:from-amber-400 hover:to-orange-400 transition"
                >
                  Explore Community
                </Link>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-5 bg-white/3 border border-white/8 rounded-2xl">
                <h3 className="font-semibold text-white mb-4">Complete Your Profile</h3>
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Profile Strength</span>
                    <span>20%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full">
                    <div className="h-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" style={{ width: "20%" }} />
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Account created</li>
                  <li className="flex items-center gap-2"><span className="text-slate-500">○</span> Add profile photo</li>
                  <li className="flex items-center gap-2"><span className="text-slate-500">○</span> Complete bio</li>
                  <li className="flex items-center gap-2"><span className="text-slate-500">○</span> Set preferences</li>
                </ul>
                <Link
                  href="/auth/profile-setup"
                  className="block mt-4 text-center py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-sm font-semibold hover:from-amber-400 hover:to-orange-400 transition"
                >
                  Complete Profile
                </Link>
              </div>

              {!isPremium && (
                <div className="p-5 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl">
                  <h3 className="font-semibold text-white mb-2">Upgrade to Premium</h3>
                  <p className="text-slate-400 text-xs mb-4">Unlock unlimited messaging, profile insights, and advanced community discovery tools.</p>
                  <Link href="/pricing" className="block text-center py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-sm font-semibold hover:from-amber-400 hover:to-orange-400 transition">
                    View Plans
                  </Link>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Job Applications</h2>
                <Link href="/professional/jobs" className="text-blue-400 text-sm hover:text-blue-300 transition">Find Jobs →</Link>
              </div>
              <div className="p-8 bg-white/3 border border-white/8 rounded-2xl text-center">
                <div className="text-4xl mb-3">💼</div>
                <p className="text-white font-semibold mb-1">No applications yet</p>
                <p className="text-slate-400 text-sm mb-4">Browse African tech and business jobs and apply today.</p>
                <Link
                  href="/professional/jobs"
                  className="inline-block px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl text-sm font-semibold hover:from-blue-400 hover:to-indigo-400 transition"
                >
                  Browse Jobs
                </Link>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">Network</h2>
                  <Link href="/professional/mentors" className="text-blue-400 text-sm hover:text-blue-300 transition">Find Mentors →</Link>
                </div>
                <div className="p-8 bg-white/3 border border-white/8 rounded-2xl text-center">
                  <div className="text-4xl mb-3">🤝</div>
                  <p className="text-white font-semibold mb-1">Start building your network</p>
                  <p className="text-slate-400 text-sm mb-4">Connect with professionals across Africa and the diaspora.</p>
                  <Link
                    href="/professional/mentors"
                    className="inline-block px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl text-sm font-semibold hover:from-blue-400 hover:to-indigo-400 transition"
                  >
                    Find Connections
                  </Link>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-5 bg-white/3 border border-white/8 rounded-2xl">
                <h3 className="font-semibold text-white mb-4">Profile Completion</h3>
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Profile Strength</span>
                    <span>20%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full">
                    <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" style={{ width: "20%" }} />
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li className="flex items-center gap-2"><span className="text-green-400">✓</span> Account created</li>
                  <li className="flex items-center gap-2"><span className="text-slate-500">○</span> Add work experience</li>
                  <li className="flex items-center gap-2"><span className="text-slate-500">○</span> Add skills</li>
                  <li className="flex items-center gap-2"><span className="text-slate-500">○</span> Upload CV</li>
                </ul>
                <Link
                  href="/auth/profile-setup"
                  className="block mt-4 text-center py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl text-sm font-semibold hover:from-blue-400 hover:to-indigo-400 transition"
                >
                  Complete Profile
                </Link>
              </div>

              <div className="p-5 bg-white/3 border border-white/8 rounded-2xl">
                <h3 className="font-semibold text-white mb-3">Upcoming Sessions</h3>
                <div className="text-slate-400 text-sm text-center py-4">
                  No sessions booked yet.
                  <br />
                  <Link href="/professional/mentors" className="text-amber-400 hover:text-amber-300 transition">Find a mentor →</Link>
                </div>
              </div>

              {!isPremium && (
                <div className="p-5 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-2xl">
                  <h3 className="font-semibold text-white mb-2">Professional Premium</h3>
                  <p className="text-slate-400 text-xs mb-4">Unlock InMail, featured profile, and advanced job filters.</p>
                  <Link href="/pricing" className="block text-center py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl text-sm font-semibold hover:from-blue-400 hover:to-indigo-400 transition">
                    Upgrade Now
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
