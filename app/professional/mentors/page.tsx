"use client";
import { Navbar } from "@/components/navbar";
import { useTranslation } from "@/lib/i18n/use-translation";
export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const MENTORS = [
  { id: 1, name: "Dr. Amara Osei", title: "CTO & Tech Entrepreneur", company: "TechAfrica", location: "Accra, Ghana", expertise: ["Tech Leadership", "Startups", "AI/ML"], rate: "$150/hr", sessions: 320, rating: 4.9, avatar: "https://ui-avatars.com/api/?name=Amara+Osei&background=3b82f6&color=fff&size=200", bio: "Former Google engineer, now building Africa's tech ecosystem. 15+ years experience.", available: true, featured: true },
  { id: 2, name: "Fatima Al-Rashid", title: "Investment Director", company: "Partech Africa", location: "Dakar, Senegal", expertise: ["Venture Capital", "Finance", "Strategy"], rate: "$200/hr", sessions: 180, rating: 4.8, avatar: "https://ui-avatars.com/api/?name=Fatima+Rashid&background=f59e0b&color=fff&size=200", bio: "Led $50M+ in African tech investments. Expert in fundraising and business strategy.", available: true, featured: true },
  { id: 3, name: "Kwame Mensah", title: "Product Lead", company: "Flutterwave", location: "Niamey, Niger Republic", expertise: ["Product Management", "Fintech", "Growth"], rate: "$120/hr", sessions: 250, rating: 4.9, avatar: "https://ui-avatars.com/api/?name=Kwame+Mensah&background=7c3aed&color=fff&size=200", bio: "Built products used across Africa. Passionate about fintech and financial inclusion.", available: false, featured: false },
  { id: 4, name: "Zara Nkosi", title: "Marketing Director", company: "Jumia", location: "Johannesburg, SA", expertise: ["Digital Marketing", "Brand", "Growth Hacking"], rate: "$100/hr", sessions: 190, rating: 4.7, avatar: "https://ui-avatars.com/api/?name=Zara+Nkosi&background=e11d48&color=fff&size=200", bio: "Scaled Jumia's marketing to 10+ African markets. Expert in growth and brand strategy.", available: true, featured: false },
  { id: 5, name: "Chidi Okeke", title: "Senior Engineer", company: "Microsoft Africa", location: "Nairobi, Kenya", expertise: ["Software Engineering", "Cloud", "Mentorship"], rate: "$90/hr", sessions: 410, rating: 4.9, avatar: "https://ui-avatars.com/api/?name=Chidi+Okeke&background=16a34a&color=fff&size=200", bio: "Microsoft engineer helping African developers level up. Specializes in cloud architecture.", available: true, featured: false },
  { id: 6, name: "Aisha Kamara", title: "HR & People Director", company: "Andela", location: "Kigali, Rwanda", expertise: ["HR", "Talent", "Leadership"], rate: "$110/hr", sessions: 145, rating: 4.8, avatar: "https://ui-avatars.com/api/?name=Aisha+Kamara&background=0ea5e9&color=fff&size=200", bio: "Built Andela's talent pipeline across Africa. Expert in career development and leadership.", available: true, featured: false },
];

export default function MentorsPage() {
  const { t } = useTranslation();
  const EXPERTISE_FILTERS = [t("mentors.filter.all"), t("mentors.filter.tech"), t("mentors.filter.business"), "Marketing", "Product", "HR", "Startups"];
  const [activeFilter, setActiveFilter] = useState("");
  const [bookedMentors, setBookedMentors] = useState<number[]>([]);

  const handleBook = (id: number) => setBookedMentors((prev) => [...prev, id]);

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white">
      <Navbar />

      <div className="pt-20">
        <div className="bg-gradient-to-br from-amber-900/20 via-[#0a0f1e] to-orange-900/20 border-b border-white/5 py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-sm font-medium mb-6">
              🤝 {t("mentors.title")}
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4">
              {t("mentors.title")}{" "}
              <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">{t("mentors.subtitle")}</span>
            </h1>
            <p className="text-slate-400 text-lg">
              {t("mentors.subtitle")}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex gap-2 flex-wrap mb-8">
            {EXPERTISE_FILTERS.map((filter) => (
              <button key={filter} onClick={() => setActiveFilter(filter)} className={`px-5 py-2.5 rounded-xl text-sm font-medium transition ${activeFilter === filter ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white" : "bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10"}`}>
                {filter}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MENTORS.map((mentor) => (
              <div key={mentor.id} className={`bg-white/3 border rounded-2xl overflow-hidden hover:border-amber-500/30 transition-all duration-300 hover:-translate-y-1 ${mentor.featured ? "border-amber-500/30" : "border-white/8"}`}>
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0">
                      <Image src={mentor.avatar} alt={mentor.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-bold text-white truncate">{mentor.name}</h3>
                        {mentor.featured && <span className="text-amber-400 text-xs">⭐</span>}
                      </div>
                      <p className="text-slate-400 text-xs truncate">{mentor.title}</p>
                      <p className="text-slate-500 text-xs">{mentor.company} · {mentor.location}</p>
                    </div>
                  </div>

                  <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-2">{mentor.bio}</p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {mentor.expertise.map((exp) => (
                      <span key={exp} className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded text-amber-400 text-xs">{exp}</span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mb-4 text-xs text-slate-400">
                    <span className="text-amber-400 font-semibold">★ {mentor.rating}</span>
                    <span>{mentor.sessions} sessions</span>
                    <span className={mentor.available ? "text-green-400" : "text-slate-500"}>
                      {mentor.available ? "● Available" : "● Busy"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold text-sm">{mentor.rate}</span>
                    <button onClick={() => handleBook(mentor.id)} className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition ${bookedMentors.includes(mentor.id) ? "bg-green-500/20 border border-green-500/30 text-green-400" : mentor.available ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-400 hover:to-orange-400 shadow-lg shadow-amber-500/20" : "bg-white/5 border border-white/10 text-slate-500 cursor-not-allowed"}`} disabled={!mentor.available && !bookedMentors.includes(mentor.id)}>
                      {bookedMentors.includes(mentor.id) ? `✓ ${t("mentors.booked")}` : mentor.available ? t("mentors.book") : t("mentors.filter.all")}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="max-w-md mx-auto p-8 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-3xl">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-bold text-white mb-3">{t("mentors.title")}</h3>
              <p className="text-slate-400 text-sm mb-6">{t("mentors.subtitle")}</p>
              <Link href="/auth/signup?mode=professional&role=mentor" className="inline-block px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-bold hover:from-amber-400 hover:to-orange-400 transition shadow-xl shadow-amber-500/25">
                {t("common.joinfree")}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-white/5 py-8 px-4 mt-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-slate-600 text-sm">
          <p><span>© 2026 ZuriTech Global. All rights reserved.</span></p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-slate-400 transition">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-400 transition">Terms</Link>
            <Link href="/contact" className="hover:text-slate-400 transition">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
