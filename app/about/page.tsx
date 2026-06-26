"use client";

import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/navbar";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#080d1a] text-white">
      <Navbar />
      {/* Hero */}
      <section className="relative pt-28 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-transparent to-rose-900/20" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <Image src="/afrimatch-logo.png" alt="AfriMatch" width={80} height={80} className="rounded-2xl" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-500 bg-clip-text text-transparent">
            About AfriMatch
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Africa’s premier platform for community discovery and professional growth — built by Africans, for Africans worldwide.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-amber-400">Our Mission</h2>
              <p className="text-slate-300 text-lg leading-relaxed mb-6">
                AfriMatch was born from a simple truth: Africans deserve a platform that understands their culture, 
                celebrates their identity, and connects them with opportunities — in community and in career.
              </p>
              <p className="text-slate-300 text-lg leading-relaxed mb-6">
                We are building Africa’s premier network — a place where you can discover your community, land your dream job, learn from the continent’s top mentors, and build meaningful connections across all 54 African nations and the global diaspora.
              </p>
              <p className="text-slate-300 text-lg leading-relaxed">
                Founded in 2026 by ZuriTech Global, AfriMatch is headquartered in Niamey, Niger Republic, with teams across 
                Nairobi, Accra, Johannesburg, Paris, London, and New York.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                { number: "54", label: "African Countries" },
                { number: "1.4B+", label: "Target Audience" },
                { number: "2", label: "Modes: Community & Pro" },
                { number: "2026", label: "Year Founded" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                  <div className="text-3xl font-black text-amber-400 mb-2">{stat.number}</div>
                  <div className="text-slate-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 bg-white/2">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🌍",
                title: "Pan-African Pride",
                desc: "We celebrate every African culture, language, and tradition. From Swahili to Yoruba, from Cairo to Cape Town — all are welcome.",
              },
              {
                icon: "🔒",
                title: "Safety First",
                desc: "AI-powered safety tools, ID verification badges, and a dedicated Safety Centre protect every member of our community.",
              },
              {
                icon: "🚀",
                title: "Empowerment",
                desc: "We don't just connect people — we empower them. Through jobs, mentorship, and skills, we help Africans rise.",
              },
              {
                icon: "🤝",
                title: "Trusted Connections",
                desc: "We believe in meaningful connections built on shared values, culture, and community — not superficial interactions.",
              },
              {
                icon: "🌐",
                title: "Diaspora Included",
                desc: "Whether you're in Lagos or London, Accra or Atlanta — AfriMatch is your home. We bridge the gap for Africans worldwide.",
              },
              {
                icon: "💡",
                title: "Innovation",
                desc: "We're constantly building new features to serve our community better — from AI career recommendations to video profiles and more.",
              },
            ].map((value) => (
              <div key={value.title} className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                <p className="text-slate-400 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-white">Built by Africans</h2>
          <p className="text-slate-300 text-lg mb-12 leading-relaxed">
            Our team spans 12 countries across Africa and the diaspora. We are engineers, designers, 
            marketers, and dreamers — united by a shared vision of a connected Africa.
          </p>
          <div className="bg-gradient-to-r from-amber-500/10 to-rose-500/10 border border-amber-500/20 rounded-3xl p-10">
            <p className="text-2xl font-bold text-white mb-4">
              &ldquo;AfriMatch is not just an app. It&apos;s a movement.&rdquo;
            </p>
            <p className="text-amber-400 font-semibold">— Prince Maiga, Founder & CEO, ZuriTech Global</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold mb-6 text-white">Join the Movement</h2>
          <p className="text-slate-300 text-lg mb-10">
            Be part of Africa’s growing professional and community network. Discover your people. Build your career. Grow together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-2xl text-lg hover:opacity-90 transition"
            >
              Get Started Free
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 border border-white/20 text-white font-bold rounded-2xl text-lg hover:bg-white/5 transition"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
