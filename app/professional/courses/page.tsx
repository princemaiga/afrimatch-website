"use client";
import { Navbar } from "@/components/navbar";
import { useTranslation } from "@/lib/i18n/use-translation";
export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const COURSES = [
  { id: 1, title: "Full Stack Web Development Bootcamp", instructor: "Chidi Okeke", category: "Tech", level: "Beginner", duration: "12 weeks", students: 4820, rating: 4.9, price: "Free", image: "https://ui-avatars.com/api/?name=Web+Dev&background=3b82f6&color=fff&size=200", tags: ["React", "Node.js", "PostgreSQL"], featured: true },
  { id: 2, title: "African Business Leadership", instructor: "Amara Mensah", category: "Business", level: "Intermediate", duration: "8 weeks", students: 3200, rating: 4.8, price: "$49", image: "https://ui-avatars.com/api/?name=Business&background=f59e0b&color=fff&size=200", tags: ["Leadership", "Strategy", "Africa"], featured: true },
  { id: 3, title: "Data Science with Python", instructor: "Kwame Asante", category: "Tech", level: "Intermediate", duration: "10 weeks", students: 2900, rating: 4.7, price: "$79", image: "https://ui-avatars.com/api/?name=Data+Science&background=7c3aed&color=fff&size=200", tags: ["Python", "ML", "Analytics"], featured: false },
  { id: 4, title: "Digital Marketing for Africa", instructor: "Fatima Diallo", category: "Marketing", level: "Beginner", duration: "6 weeks", students: 5100, rating: 4.8, price: "Free", image: "https://ui-avatars.com/api/?name=Marketing&background=e11d48&color=fff&size=200", tags: ["SEO", "Social Media", "Content"], featured: false },
  { id: 5, title: "Financial Literacy & Investing", instructor: "Zara Nkosi", category: "Finance", level: "Beginner", duration: "4 weeks", students: 6200, rating: 4.9, price: "Free", image: "https://ui-avatars.com/api/?name=Finance&background=16a34a&color=fff&size=200", tags: ["Investing", "Stocks", "Crypto"], featured: false },
  { id: 6, title: "UI/UX Design Masterclass", instructor: "Kofi Boateng", category: "Design", level: "Intermediate", duration: "8 weeks", students: 2400, rating: 4.7, price: "$59", image: "https://ui-avatars.com/api/?name=UX+Design&background=0ea5e9&color=fff&size=200", tags: ["Figma", "Design", "UX"], featured: false },
];

export default function CoursesPage() {
  const { t } = useTranslation();
  const CATEGORIES = [t("courses.filter.all"), t("courses.filter.tech"), t("courses.filter.business"), "Marketing", "Finance", t("courses.filter.design")];
  const [activeCategory, setActiveCategory] = useState("");
  const [enrolledCourses, setEnrolledCourses] = useState<number[]>([]);

  const handleEnroll = (id: number) => setEnrolledCourses((prev) => [...prev, id]);

  const filteredCourses = COURSES.filter((c) => activeCategory === "" || activeCategory === t("courses.filter.all") || c.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white">
      <Navbar />

      <div className="pt-20">
        <div className="bg-gradient-to-br from-purple-900/30 via-[#0a0f1e] to-indigo-900/20 border-b border-white/5 py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-sm font-medium mb-6">
              🎓 {t("courses.title")}
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4">
              {t("courses.title")}{" "}
              <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">{t("courses.subtitle")}</span>
            </h1>
            <p className="text-slate-400 text-lg mb-6">
              {t("courses.subtitle")}
            </p>
            <div className="flex items-center justify-center gap-8 text-sm">
              <div className="text-center"><div className="text-2xl font-bold text-white">200+</div><div className="text-slate-400">Courses</div></div>
              <div className="text-center"><div className="text-2xl font-bold text-white">Growing</div><div className="text-slate-400">Community</div></div>
              <div className="text-center"><div className="text-2xl font-bold text-white">4.8★</div><div className="text-slate-400">Avg Rating</div></div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex gap-2 flex-wrap mb-8">
            {CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-5 py-2.5 rounded-xl text-sm font-medium transition ${activeCategory === cat ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white" : "bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10"}`}>
                {cat}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div key={course.id} className={`bg-white/3 border rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all duration-300 hover:-translate-y-1 ${course.featured ? "border-amber-500/30" : "border-white/8"}`}>
                <div className="relative h-40 bg-gradient-to-br from-slate-700 to-slate-800">
                  <Image src={course.image} alt={course.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e]/80 to-transparent" />
                  {course.featured && (
                    <div className="absolute top-3 left-3 px-2 py-1 bg-amber-500/80 backdrop-blur-sm rounded-lg text-white text-xs font-medium">⭐ {t("jobs.featured")}</div>
                  )}
                  <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-lg text-white text-xs font-bold">
                    {course.price === "Free" ? <span className="text-green-400">{t("courses.free")}</span> : course.price}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-purple-500/20 border border-purple-500/20 rounded-lg text-purple-400 text-xs">{course.category}</span>
                    <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-lg text-slate-400 text-xs">{course.level}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-1 line-clamp-2">{course.title}</h3>
                  <p className="text-slate-400 text-xs mb-3">by {course.instructor} · {course.duration}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {course.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-xs text-slate-400">{tag}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <span className="text-amber-400">★ {course.rating}</span>
                      <span>({course.students.toLocaleString()} students)</span>
                    </div>
                  </div>
                  <button onClick={() => handleEnroll(course.id)} className={`w-full py-3 rounded-xl font-semibold text-sm transition ${enrolledCourses.includes(course.id) ? "bg-green-500/20 border border-green-500/30 text-green-400" : "bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-400 hover:to-indigo-400 shadow-lg shadow-purple-500/20"}`}>
                    {enrolledCourses.includes(course.id) ? `✓ ${t("courses.enrolled")}` : course.price === "Free" ? t("courses.enroll") : `${t("courses.enroll")} ${course.price}`}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="max-w-md mx-auto p-8 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-3xl">
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="text-xl font-bold text-white mb-3">{t("courses.title")}</h3>
              <p className="text-slate-400 text-sm mb-6">{t("courses.subtitle")}</p>
              <Link href="/auth/signup?mode=professional" className="inline-block px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-2xl font-bold hover:from-purple-400 hover:to-indigo-400 transition shadow-xl shadow-purple-500/25">
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
