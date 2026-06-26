"use client";
import { Navbar } from "@/components/navbar";
import { useTranslation } from "@/lib/i18n/use-translation";
import Link from "next/link";

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center px-4">
      {/* Navigation */}
      <Navbar />
      <div className="text-center mt-16">
        <div className="text-8xl mb-6">🌍</div>
        <h1 className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-white mt-4 mb-2">{t("notfound.title")}</h2>
        <p className="text-slate-400 mt-2 max-w-md mx-auto mb-8">
          {t("notfound.desc")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-8 py-3 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600 transition"
          >
            {t("notfound.home")}
          </Link>
          <Link
            href="/auth/signup"
            className="px-8 py-3 border-2 border-amber-500 text-amber-400 rounded-lg font-semibold hover:bg-amber-500/10 transition"
          >
            {t("common.joinfree")}
          </Link>
        </div>
      </div>
    </div>
  );
}
