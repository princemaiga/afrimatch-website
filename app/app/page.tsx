import { Navbar } from "@/components/navbar";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Mobile App — AfriMatch",
  description: "AfriMatch mobile app — coming soon to iOS and Android.",
};

export default function AppPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white">
      <Navbar />

      <div className="pt-32 pb-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-24 h-24 mx-auto mb-8 rounded-3xl overflow-hidden shadow-2xl shadow-amber-500/30">
            <Image src="/images/afrimatch-logo.png" alt="AfriMatch App" width={96} height={96} className="object-cover" />
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-sm font-medium mb-8">
            📱 Coming Soon
          </div>
          <h1 className="text-5xl font-extrabold text-white mb-6">AfriMatch Mobile App</h1>
          <p className="text-xl text-slate-400 mb-10">
            We&apos;re building native iOS and Android apps so you can take AfriMatch everywhere.
            In the meantime, use our full-featured web app on any device.
          </p>

          <Link
            href="/auth/signup"
            className="inline-block px-10 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-bold text-lg hover:from-amber-400 hover:to-orange-400 transition shadow-xl shadow-amber-500/25 mb-8"
          >
            Use the Web App Now →
          </Link>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="p-5 bg-white/5 border border-white/10 rounded-2xl opacity-60 cursor-default">
              <div className="text-3xl mb-2">🍎</div>
              <div className="text-xs text-slate-400 mb-1">Coming soon</div>
              <div className="font-bold text-white">App Store</div>
            </div>
            <div className="p-5 bg-white/5 border border-white/10 rounded-2xl opacity-60 cursor-default">
              <div className="text-3xl mb-2">📱</div>
              <div className="text-xs text-slate-400 mb-1">Coming soon</div>
              <div className="font-bold text-white">Google Play</div>
            </div>
          </div>

          <p className="mt-8 text-slate-500 text-sm">
            Want to be notified when the app launches?{" "}
            <a href="mailto:app@afrimatch.app" className="text-amber-400 hover:text-amber-300 transition">
              app@afrimatch.app
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
