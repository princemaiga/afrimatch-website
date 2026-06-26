"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "@/lib/i18n/use-translation";

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-[#060b18] border-t border-white/5 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden">
                <Image src="/images/afrimatch-logo.png" alt="AfriMatch" fill className="object-cover" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                AfriMatch
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              {t("footer.tagline")}
            </p>
            <div className="flex gap-3">
              <a href="https://twitter.com/afrimatch" target="_blank" rel="noopener noreferrer" aria-label="Twitter"
                className="w-9 h-9 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-white/10 transition text-slate-400 hover:text-white">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://instagram.com/afrimatch" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                className="w-9 h-9 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-white/10 transition text-slate-400 hover:text-white">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="https://linkedin.com/company/afrimatch" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                className="w-9 h-9 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-white/10 transition text-slate-400 hover:text-white">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="https://facebook.com/afrimatch" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                className="w-9 h-9 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-white/10 transition text-slate-400 hover:text-white">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{t("footer.platform")}</h4>
            <ul className="space-y-3">
              {[
                { label: t("footer.community"), href: "/community" },
                { label: t("footer.jobs"), href: "/professional/jobs" },
                { label: t("footer.courses"), href: "/professional/courses" },
                { label: t("footer.mentorship"), href: "/professional/mentors" },
                { label: t("footer.pricing"), href: "/pricing" },
                { label: t("footer.app"), href: "/app" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-slate-400 text-sm hover:text-amber-400 transition">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{t("footer.company")}</h4>
            <ul className="space-y-3">
              {[
                { label: t("footer.about"), href: "/about" },
                { label: t("footer.blog"), href: "/blog" },
                { label: t("footer.careers"), href: "/careers" },
                { label: t("footer.press"), href: "/press" },
                { label: t("footer.safety"), href: "/safety" },
                { label: t("footer.privacy"), href: "/privacy" },
                { label: t("footer.terms"), href: "/terms" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-slate-400 text-sm hover:text-amber-400 transition">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{t("footer.contact")}</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-0.5 flex-shrink-0">📧</span>
                <div>
                  <p className="text-slate-400 text-xs mb-0.5">General Inquiries</p>
                  <a href="mailto:contact@afrimatch.app" className="text-slate-300 text-sm hover:text-amber-400 transition">
                    contact@afrimatch.app
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-0.5 flex-shrink-0">⚖️</span>
                <div>
                  <p className="text-slate-400 text-xs mb-0.5">Legal & Compliance</p>
                  <a href="mailto:legal@afrimatch.app" className="text-slate-300 text-sm hover:text-amber-400 transition">
                    legal@afrimatch.app
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-0.5 flex-shrink-0">🛡️</span>
                <div>
                  <p className="text-slate-400 text-xs mb-0.5">Safety & Trust</p>
                  <a href="mailto:safety@afrimatch.app" className="text-slate-300 text-sm hover:text-amber-400 transition">
                    safety@afrimatch.app
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-0.5 flex-shrink-0">📍</span>
                <div>
                  <p className="text-slate-400 text-xs mb-0.5">Headquarters</p>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    ZuriTech Global<br />
                    BP: 12822<br />
                    Niamey, Niger Republic
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <span>&copy; 2026</span>
            <span className="text-amber-400 font-semibold">ZuriTech Global</span>
            <span>— {t("footer.rights")}</span>
          </div>
          <div className="flex items-center gap-6 text-slate-500 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              All systems operational
            </span>
            <span>🌍 Serving 54 African Nations + Global Diaspora</span>
          </div>
          <div className="flex gap-4 text-slate-500 text-xs">
            <Link href="/privacy" className="hover:text-slate-300 transition">{t("footer.privacy")}</Link>
            <Link href="/terms" className="hover:text-slate-300 transition">{t("footer.terms")}</Link>
            <Link href="/sitemap.xml" className="hover:text-slate-300 transition">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
