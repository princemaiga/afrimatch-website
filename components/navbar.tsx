"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { LanguageSwitcher } from "./language-switcher";
import { useTranslation } from "@/lib/i18n/use-translation";

const NAV_LINK_DEFS = [
  { key: "nav.community" as const, href: "/community" },
  { key: null, label: "Jobs", href: "/professional/jobs" },
  { key: null, label: "Courses", href: "/professional/courses" },
  { key: null, label: "Mentors", href: "/professional/mentors" },
  { key: "nav.pricing" as const, href: "/pricing" },
  { key: null, label: "Blog", href: "/blog" },
];

export function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const NAV_LINKS = NAV_LINK_DEFS.map((def) => ({
    label: def.key ? t(def.key) : (def.label ?? ""),
    href: def.href,
  }));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const isAuth = status === "authenticated";

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#080d1a]/95 backdrop-blur-2xl border-b border-white/[0.08] shadow-xl shadow-black/20"
          : "bg-[#080d1a]/70 backdrop-blur-xl border-b border-white/[0.04]"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
              <div className="relative w-8 h-8 rounded-lg overflow-hidden ring-1 ring-amber-500/20 group-hover:ring-amber-500/40 transition-all">
                <Image src="/images/afrimatch-logo.png" alt="AfriMatch" fill className="object-cover" />
              </div>
              <span className="text-[1.05rem] font-bold tracking-tight bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
                AfriMatch
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-6 text-[0.82rem] font-medium">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors duration-200 ${
                    pathname === link.href || pathname?.startsWith(link.href + "/")
                      ? "text-amber-400"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop right */}
            <div className="hidden md:flex items-center gap-2.5">
              <LanguageSwitcher />
              {isAuth ? (
                <div className="flex items-center gap-2.5">
                  <Link
                    href="/dashboard"
                    className={`px-3.5 py-2 text-[0.82rem] font-medium transition-colors duration-200 ${
                      pathname === "/dashboard" ? "text-amber-400" : "text-slate-300 hover:text-white"
                    }`}
                  >
                    {t("nav.dashboard")}
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="px-3.5 py-2 text-[0.82rem] font-medium text-slate-400 hover:text-white transition-colors duration-200"
                  >
                    Sign Out
                  </button>
                  <Link href="/dashboard" className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] rounded-lg transition-all duration-200">
                    <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-xs font-bold flex-shrink-0">
                      {session?.user?.name?.[0]?.toUpperCase() || session?.user?.email?.[0]?.toUpperCase() || "A"}
                    </div>
                    <span className="text-white text-xs font-medium max-w-[80px] truncate">
                      {session?.user?.name?.split(" ")[0] || "Account"}
                    </span>
                  </Link>
                </div>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="px-4 py-2 text-[0.82rem] font-medium text-slate-300 hover:text-white transition-colors duration-200"
                  >
                    {t("nav.signin")}
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg text-[0.82rem] font-semibold hover:from-amber-400 hover:to-orange-400 transition-all duration-200 shadow-lg shadow-amber-500/20"
                  >
                    {t("nav.signup")}
                  </Link>
                </>
              )}
            </div>

            {/* Mobile right */}
            <div className="flex md:hidden items-center gap-2">
              <LanguageSwitcher />
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-white/[0.06] transition-colors"
                aria-label="Toggle menu"
              >
                <span className={`w-5 h-0.5 bg-white rounded-full transition-all duration-200 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
                <span className={`w-5 h-0.5 bg-white rounded-full transition-all duration-200 ${mobileOpen ? "opacity-0" : ""}`} />
                <span className={`w-5 h-0.5 bg-white rounded-full transition-all duration-200 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="bg-[#0d1526] border-t border-white/[0.06] px-4 py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  pathname === link.href ? "bg-amber-500/10 text-amber-400" : "text-slate-300 hover:bg-white/[0.05] hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-white/[0.06] space-y-2">
              {isAuth ? (
                <>
                  <Link href="/dashboard" className="block px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:bg-white/[0.05] hover:text-white transition-colors">
                    Dashboard
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-white/[0.05] hover:text-white transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="block px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:bg-white/[0.05] hover:text-white transition-colors">
                    {t("nav.signin")}
                  </Link>
                  <Link href="/auth/signup" className="block px-4 py-3 rounded-xl text-sm font-bold text-center bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/20">
                    {t("nav.signup")} →
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
