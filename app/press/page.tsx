import { Navbar } from "@/components/navbar";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Press — AfriMatch",
  description: "Press resources and media kit for AfriMatch.",
};

export default function PressPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white">
      <Navbar />

      <div className="pt-32 pb-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-extrabold text-white mb-6">Press &amp; Media</h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Resources for journalists and media professionals covering AfriMatch.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="p-6 bg-white/3 border border-white/8 rounded-2xl">
              <h2 className="text-xl font-bold text-white mb-4">About AfriMatch</h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                AfriMatch is Africa&apos;s dual-purpose platform combining community and professional networking for Africans
                and the diaspora worldwide. Founded to connect Africans and professionals across
                54 countries, AfriMatch offers both a community platform and a professional network in one place.
              </p>
              <p className="text-slate-400 text-sm leading-relaxed">
                The platform supports 18+ African languages and currencies, with payment options including Stripe
                for international users and Flutterwave for African payments in local currencies.
              </p>
            </div>

            <div className="p-6 bg-white/3 border border-white/8 rounded-2xl">
              <h2 className="text-xl font-bold text-white mb-4">Key Facts</h2>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">•</span> Pan-African platform covering all 54 African countries</li>
                <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">•</span> Dual-mode: Community + Professional networking</li>
                <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">•</span> Supports 18+ African languages</li>
                <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">•</span> Local African currency payments via Flutterwave</li>
                <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">•</span> International payments via Stripe</li>
                <li className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">•</span> Free to join with premium subscription tiers</li>
              </ul>
            </div>
          </div>

          <div className="p-8 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-center">
            <h2 className="text-2xl font-bold text-white mb-3">Press Enquiries</h2>
            <p className="text-slate-400 mb-6">
              For interviews, media assets, or press enquiries, please contact our team.
            </p>
            <a
              href="mailto:press@afrimatch.app"
              className="inline-block px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-bold text-lg hover:from-amber-400 hover:to-orange-400 transition"
            >
              Contact Press Team → press@afrimatch.app
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
