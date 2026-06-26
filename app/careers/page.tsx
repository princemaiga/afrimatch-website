import { Navbar } from "@/components/navbar";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Careers — AfriMatch",
  description: "Join the team building Africa's community and professional network.",
};

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white">
      {/* Nav */}
      <Navbar />

      <div className="pt-32 pb-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-sm font-medium mb-8">
            🌍 We&apos;re Hiring
          </div>
          <h1 className="text-5xl font-extrabold text-white mb-6">Build Africa&apos;s Future With Us</h1>
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
            AfriMatch is on a mission to connect 54 African nations through love and professional growth.
            We&apos;re a remote-first team building the infrastructure for African connection.
          </p>

          <div className="p-8 bg-white/3 border border-white/8 rounded-2xl text-center mb-12">
            <div className="text-5xl mb-4">🚀</div>
            <h2 className="text-2xl font-bold text-white mb-3">We&apos;re Early Stage</h2>
            <p className="text-slate-400 mb-6">
              We&apos;re building the team that will scale AfriMatch across Africa and the diaspora.
              If you&apos;re passionate about African tech and want to make a real impact, we want to hear from you.
            </p>
            <a
              href="mailto:careers@afrimatch.app"
              className="inline-block px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-bold text-lg hover:from-amber-400 hover:to-orange-400 transition"
            >
              Send Your CV → careers@afrimatch.app
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-6 text-left">
            {[
              { icon: "🌍", title: "Remote First", desc: "Work from anywhere in Africa or the diaspora. We believe great talent is everywhere." },
              { icon: "🚀", title: "Equity & Impact", desc: "Join early and share in the success. Build something that matters for 1.4 billion people." },
              { icon: "💡", title: "Build & Learn", desc: "Work on hard problems at scale. We invest in your growth and development." },
            ].map((v) => (
              <div key={v.title} className="p-6 bg-white/3 border border-white/8 rounded-2xl">
                <div className="text-3xl mb-3">{v.icon}</div>
                <h3 className="font-bold text-white mb-2">{v.title}</h3>
                <p className="text-slate-400 text-sm">{v.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-slate-400">
              Questions? Email us at{" "}
              <a href="mailto:careers@afrimatch.app" className="text-amber-400 hover:text-amber-300 transition">
                careers@afrimatch.app
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
