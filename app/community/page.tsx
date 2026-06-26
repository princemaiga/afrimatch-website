"use client";
import { Navbar } from "@/components/navbar";
import { useTranslation } from "@/lib/i18n/use-translation";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Footer } from "@/components/footer";

// Community member profiles — professional/community focused
const MEMBERS = [
  {
    id: 1,
    name: "Amara Diallo",
    title: "Software Engineer",
    company: "Andela",
    location: "Dakar, Senegal",
    country: "Senegal",
    industry: "Technology",
    languages: ["French", "Wolof", "English"],
    skills: ["React", "Node.js", "Python"],
    interests: ["Open Source", "EdTech", "Community Building"],
    groups: ["African Developers", "Francophone Tech"],
    bio: "Building open-source tools for African developers. Passionate about EdTech and community-driven innovation.",
    verified: true,
    avatar: "https://ui-avatars.com/api/?name=Amara+Diallo&background=f59e0b&color=fff&size=200",
  },
  {
    id: 2,
    name: "Kwame Asante",
    title: "Product Manager",
    company: "Paystack",
    location: "Accra, Ghana",
    country: "Ghana",
    industry: "Fintech",
    languages: ["English", "Twi"],
    skills: ["Product Strategy", "Fintech", "Growth"],
    interests: ["Fintech", "Entrepreneurship", "Mentorship"],
    groups: ["West Africa Founders", "Fintech Africa"],
    bio: "Product leader at one of Africa's leading fintech companies. Helping build the financial infrastructure of Africa.",
    verified: true,
    avatar: "https://ui-avatars.com/api/?name=Kwame+Asante&background=0ea5e9&color=fff&size=200",
  },
  {
    id: 3,
    name: "Fatima Diallo",
    title: "Public Health Specialist",
    company: "WHO Africa",
    location: "Brazzaville, Congo",
    country: "Congo",
    industry: "Healthcare",
    languages: ["French", "English", "Lingala"],
    skills: ["Epidemiology", "Community Health", "Research"],
    interests: ["Healthcare Access", "Maternal Health", "Africa CDC"],
    groups: ["African Health Professionals", "Diaspora Doctors"],
    bio: "Working to improve healthcare access across Africa. Focused on maternal health and community-based interventions.",
    verified: true,
    avatar: "https://ui-avatars.com/api/?name=Fatima+Diallo&background=7c3aed&color=fff&size=200",
  },
  {
    id: 4,
    name: "Nkechi Adeyemi",
    title: "Creative Director",
    company: "Lagos Creative Studio",
    location: "Lagos, Nigeria",
    country: "Nigeria",
    industry: "Creative & Design",
    languages: ["English", "Yoruba", "Igbo"],
    skills: ["Brand Identity", "African Prints", "Sustainable Fashion"],
    interests: ["African Fashion", "Sustainable Design", "Cultural Heritage"],
    groups: ["African Creatives", "Lagos Fashion Week"],
    bio: "Creative director specialising in African print design and sustainable fashion. Celebrating African identity through art.",
    verified: false,
    avatar: "https://ui-avatars.com/api/?name=Nkechi+Adeyemi&background=0ea5e9&color=fff&size=200",
  },
  {
    id: 5,
    name: "Aisha Kamara",
    title: "Environmental Scientist",
    company: "UNEP",
    location: "Nairobi, Kenya",
    country: "Kenya",
    industry: "Environment",
    languages: ["English", "Swahili", "French"],
    skills: ["Environmental Policy", "Conservation", "Climate Research"],
    interests: ["Wildlife Conservation", "Climate Action", "Environmental Advocacy"],
    groups: ["African Environmentalists", "East Africa Climate Network"],
    bio: "Wildlife conservationist and environmental scientist at UNEP. Advocating for climate action across the African continent.",
    verified: true,
    avatar: "https://ui-avatars.com/api/?name=Aisha+Kamara&background=16a34a&color=fff&size=200",
  },
  {
    id: 6,
    name: "Chioma Eze",
    title: "Investigative Journalist",
    company: "Premium Times",
    location: "Abuja, Nigeria",
    country: "Nigeria",
    industry: "Media & Journalism",
    languages: ["English", "Igbo"],
    skills: ["Investigative Reporting", "Data Journalism", "Storytelling"],
    interests: ["Press Freedom", "Accountability Journalism", "Pan-Africanism"],
    groups: ["African Journalists Network", "Women in Media Africa"],
    bio: "Investigative journalist covering governance, accountability, and social justice across West Africa.",
    verified: true,
    avatar: "https://ui-avatars.com/api/?name=Chioma+Eze&background=dc2626&color=fff&size=200",
  },
];

const INDUSTRY_FILTERS = ["All", "Technology", "Fintech", "Healthcare", "Creative & Design", "Environment", "Media & Journalism"];

export default function CommunityPage() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState("All");
  const [connectedMembers, setConnectedMembers] = useState<number[]>([]);

  const handleConnect = (id: number) => {
    setConnectedMembers((prev) => [...prev, id]);
  };

  const visibleMembers = activeFilter === "All"
    ? MEMBERS
    : MEMBERS.filter((m) => m.industry === activeFilter);

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white">
      <Navbar />
      <div className="pt-20 max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white">{t("community.title")}</h1>
              <p className="text-slate-400 mt-1">{t("community.subtitle")}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 text-sm font-medium">
                🌍 {connectedMembers.length} {t("community.connect")}s
              </div>
              <Link href="/auth/signup" className="px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 text-sm font-medium hover:bg-amber-500/20 transition">
                ⚙️ Preferences
              </Link>
            </div>
          </div>

          {/* Industry Filters */}
          <div className="flex gap-2 flex-wrap">
            {INDUSTRY_FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                  activeFilter === filter
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                    : "bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Member Grid — LinkedIn/Meetup style */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleMembers.map((member) => (
            <div
              key={member.id}
              className="group bg-white/3 border border-white/8 rounded-2xl overflow-hidden hover:border-amber-500/30 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Card Header — avatar + name + title */}
              <div className="p-5 flex items-start gap-4">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                  <Image src={member.avatar} alt={member.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white truncate">{member.name}</h3>
                    {member.verified && (
                      <span className="flex-shrink-0 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                    )}
                  </div>
                  <p className="text-amber-400 text-sm font-medium truncate">{member.title}</p>
                  <p className="text-slate-500 text-xs truncate">{member.company} · {member.location}</p>
                </div>
              </div>

              {/* Bio */}
              <div className="px-5 pb-3">
                <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">{member.bio}</p>
              </div>

              {/* Skills */}
              <div className="px-5 pb-3">
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1.5">Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {member.skills.map((skill) => (
                    <span key={skill} className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded-md text-xs text-amber-400">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div className="px-5 pb-3">
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1.5">Interests</p>
                <div className="flex flex-wrap gap-1.5">
                  {member.interests.slice(0, 3).map((interest) => (
                    <span key={interest} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-md text-xs text-slate-300">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              {/* Languages + Industry */}
              <div className="px-5 pb-4">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>🌐 {member.languages.slice(0, 2).join(", ")}</span>
                  <span>·</span>
                  <span>🏢 {member.industry}</span>
                </div>
              </div>

              {/* Action button */}
              <div className="px-5 pb-5">
                <button
                  onClick={() => handleConnect(member.id)}
                  className={`w-full py-2.5 rounded-xl font-semibold transition text-sm ${
                    connectedMembers.includes(member.id)
                      ? "bg-amber-500/20 border border-amber-500/30 text-amber-400"
                      : "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-400 hover:to-orange-400 shadow-lg shadow-amber-500/20"
                  }`}
                >
                  {connectedMembers.includes(member.id) ? `✓ Connected` : `🌍 ${t("community.connect")}`}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Sign up CTA */}
        <div className="mt-12 text-center">
          <div className="max-w-md mx-auto p-8 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-3xl">
            <div className="text-4xl mb-4">🌍</div>
            <h3 className="text-2xl font-bold text-white mb-3">{t("community.join")}</h3>
            <p className="text-slate-400 text-sm mb-6">
              {t("community.subtitle")}
            </p>
            <Link
              href="/auth/signup"
              className="inline-block px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-bold hover:from-amber-400 hover:to-orange-400 transition shadow-xl shadow-amber-500/25"
            >
              {t("community.join")}
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
