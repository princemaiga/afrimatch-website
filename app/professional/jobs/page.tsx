"use client";
import { Navbar } from "@/components/navbar";
import { useTranslation } from "@/lib/i18n/use-translation";
export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const JOBS = [
  { id: 1, title: "Senior Software Engineer", company: "Flutterwave", location: "Niamey, Niger Republic", type: "Full-time", salary: "$80,000 – $120,000", posted: "2 days ago", logo: "https://ui-avatars.com/api/?name=Flutterwave&background=f59e0b&color=fff&size=60", tags: ["React", "Node.js", "AWS"], remote: true, featured: true },
  { id: 2, title: "Product Manager", company: "Andela", location: "Nairobi, Kenya", type: "Full-time", salary: "$60,000 – $90,000", posted: "1 day ago", logo: "https://ui-avatars.com/api/?name=Andela&background=1e3a5f&color=fff&size=60", tags: ["Product", "Agile", "Data"], remote: true, featured: true },
  { id: 3, title: "Data Scientist", company: "Safaricom", location: "Nairobi, Kenya", type: "Full-time", salary: "$50,000 – $75,000", posted: "3 days ago", logo: "https://ui-avatars.com/api/?name=Safaricom&background=16a34a&color=fff&size=60", tags: ["Python", "ML", "SQL"], remote: false, featured: false },
  { id: 4, title: "UX/UI Designer", company: "Interswitch", location: "Niamey, Niger Republic", type: "Full-time", salary: "$40,000 – $65,000", posted: "5 days ago", logo: "https://ui-avatars.com/api/?name=Interswitch&background=7c3aed&color=fff&size=60", tags: ["Figma", "Design", "UX"], remote: true, featured: false },
  { id: 5, title: "Business Development Manager", company: "Jumia", location: "Cairo, Egypt", type: "Full-time", salary: "$45,000 – $70,000", posted: "1 week ago", logo: "https://ui-avatars.com/api/?name=Jumia&background=f97316&color=fff&size=60", tags: ["Sales", "B2B", "Strategy"], remote: false, featured: false },
  { id: 6, title: "DevOps Engineer", company: "MTN Group", location: "Johannesburg, South Africa", type: "Full-time", salary: "$55,000 – $85,000", posted: "4 days ago", logo: "https://ui-avatars.com/api/?name=MTN&background=fbbf24&color=000&size=60", tags: ["Docker", "Kubernetes", "CI/CD"], remote: true, featured: false },
];

export default function JobsPage() {
  const { t } = useTranslation();
  const JOB_TYPES = [t("jobs.filter.all"), t("jobs.filter.remote"), t("jobs.filter.fulltime"), t("jobs.filter.parttime"), t("jobs.filter.contract")];
  const [activeType, setActiveType] = useState("");
  const [search, setSearch] = useState("");
  const [appliedJobs, setAppliedJobs] = useState<number[]>([]);

  const handleApply = (id: number) => setAppliedJobs((prev) => [...prev, id]);

  const filteredJobs = JOBS.filter((job) => {
    const matchesSearch = search === "" || job.title.toLowerCase().includes(search.toLowerCase()) || job.company.toLowerCase().includes(search.toLowerCase());
    const isAll = activeType === "" || activeType === t("jobs.filter.all");
    const matchesType = isAll || (activeType === t("jobs.filter.remote") && job.remote) || job.type === activeType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white">
      <Navbar />

      <div className="pt-20">
        <div className="bg-gradient-to-br from-blue-900/30 via-[#0a0f1e] to-indigo-900/20 border-b border-white/5 py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium mb-6">
              💼 {t("jobs.title")}
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4">
              {t("jobs.title")}{" "}
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">{t("jobs.subtitle")}</span>
            </h1>
            <p className="text-slate-400 text-lg mb-8">{t("jobs.subtitle")}</p>
            <div className="flex gap-3 max-w-2xl mx-auto">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder={t("jobs.search")}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 text-sm"
                />
              </div>
              <button className="px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-2xl font-semibold hover:from-blue-400 hover:to-indigo-400 transition text-sm whitespace-nowrap">
                Search
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-56 flex-shrink-0">
              <div className="bg-white/3 border border-white/8 rounded-2xl p-5 sticky top-24">
                <h3 className="text-white font-semibold mb-4">Job Type</h3>
                <div className="space-y-2">
                  {JOB_TYPES.map((type) => (
                    <button key={type} onClick={() => setActiveType(type)} className={`w-full text-left px-3 py-2 rounded-xl text-sm transition ${activeType === type ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
                      {type}
                    </button>
                  ))}
                </div>
                <div className="border-t border-white/5 mt-6 pt-6">
                  <Link href="/auth/signup" className="block w-full text-center py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-semibold text-sm hover:from-blue-400 hover:to-indigo-400 transition">
                    Post a Job
                  </Link>
                </div>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <p className="text-slate-400 text-sm"><span className="text-white font-semibold">{filteredJobs.length} jobs</span> found</p>
              </div>

              <div className="space-y-4">
                {filteredJobs.map((job) => (
                  <div key={job.id} className={`p-6 bg-white/3 border rounded-2xl hover:border-blue-500/30 transition-all duration-300 ${job.featured ? "border-amber-500/30" : "border-white/8"}`}>
                    {job.featured && (
                      <div className="inline-flex items-center gap-1 px-2 py-1 bg-amber-500/20 border border-amber-500/30 rounded-lg text-amber-400 text-xs font-medium mb-3">
                        ⭐ {t("jobs.featured")}
                      </div>
                    )}
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 bg-white/5">
                        <Image src={job.logo} alt={job.company} width={56} height={56} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-bold text-white mb-1">{job.title}</h3>
                            <p className="text-slate-400 text-sm">{job.company} · {job.location}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="text-amber-400 font-semibold text-sm">{job.salary}</div>
                            <div className="text-slate-500 text-xs mt-1">{job.posted}</div>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-3">
                          <span className="px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 text-xs font-medium">{job.type}</span>
                          {job.remote && <span className="px-2.5 py-1 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-xs font-medium">🌐 {t("jobs.remote")}</span>}
                          {job.tags.map((tag) => (
                            <span key={tag} className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-slate-400 text-xs">{tag}</span>
                          ))}
                        </div>
                        <div className="flex gap-3 mt-4">
                          <button onClick={() => handleApply(job.id)} className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition ${appliedJobs.includes(job.id) ? "bg-green-500/20 border border-green-500/30 text-green-400" : "bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-400 hover:to-indigo-400 shadow-lg shadow-blue-500/20"}`}>
                            {appliedJobs.includes(job.id) ? `✓ ${t("jobs.applied")}` : t("jobs.apply")}
                          </button>
                          <button className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-400 font-semibold text-sm hover:bg-white/10 hover:text-white transition">Save</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 text-center">
                <div className="max-w-md mx-auto p-8 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-3xl">
                  <div className="text-4xl mb-4">💼</div>
                  <h3 className="text-xl font-bold text-white mb-3">{t("jobs.title")}</h3>
                  <p className="text-slate-400 text-sm mb-6">{t("jobs.subtitle")}</p>
                  <Link href="/auth/signup?mode=professional" className="inline-block px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-2xl font-bold hover:from-blue-400 hover:to-indigo-400 transition shadow-xl shadow-blue-500/25">
                    {t("common.joinfree")}
                  </Link>
                </div>
              </div>
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
