"use client";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useTranslation } from "@/lib/i18n/use-translation";
import type { TranslationKey } from "@/lib/i18n/translations";
import { useState, useMemo } from "react";
import Link from "next/link";
import { SAMPLE_ARTICLES, type BlogArticle } from "@/lib/db/blog";

export default function BlogPage() {
  const { t } = useTranslation();
  // Initialize directly from static data — no async, no Loading... state
  const [selectedCategory, setSelectedCategory] = useState<"all" | "community" | "professional">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = useMemo(() => {
    let filtered = SAMPLE_ARTICLES;
    if (selectedCategory !== "all") {
      filtered = filtered.filter((a) => a.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }
    return filtered;
  }, [selectedCategory, searchQuery]);

  const trendingArticles = useMemo(
    () => [...SAMPLE_ARTICLES].sort((a, b) => b.views - a.views).slice(0, 3),
    []
  );

  const CATEGORIES = [
    { key: "all", label: t("blog.cat.all") },
    { key: "community", label: t("blog.cat.community") },
    { key: "professional", label: t("blog.cat.professional") },
  ];

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white">
      <Navbar />
      <div className="pt-20 max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">{t("blog.title")}</h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Insights, guides, and stories for African professionals and community builders.
          </p>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("blog.search")}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
          />
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key as "all" | "community" | "professional")}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                  selectedCategory === cat.key
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                    : "bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main articles */}
          <div className="lg:col-span-2">
            {filteredArticles.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-4xl mb-4">📝</div>
                <p className="text-slate-400">{t("blog.noresults")}</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} t={t} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar — Trending */}
          <div className="lg:col-span-1">
            <div className="bg-white/3 border border-white/8 rounded-2xl p-5 sticky top-24">
              <h3 className="text-white font-bold text-base mb-4">🔥 {t("blog.trending")}</h3>
              <div className="space-y-4">
                {trendingArticles.map((article, i) => (
                  <div key={article.id} className="flex gap-3">
                    <span className="text-2xl font-black text-amber-500/30 w-6 flex-shrink-0">{i + 1}</span>
                    <div>
                      <p className="text-white text-sm font-medium leading-snug line-clamp-2">{article.title}</p>
                      <p className="text-slate-500 text-xs mt-1">{article.views.toLocaleString()} {t("blog.views")}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function ArticleCard({ article, t }: { article: BlogArticle; t: (key: TranslationKey) => string }) {
  return (
    <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden hover:border-amber-500/30 transition-all duration-300 group">
      <div className="p-6">
        {/* Category badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
            article.category === "community"
              ? "bg-amber-500/15 text-amber-400 border border-amber-500/20"
              : "bg-blue-500/15 text-blue-400 border border-blue-500/20"
          }`}>
            {article.category === "community" ? "Community" : "Professional"}
          </span>
          {article.subcategory && (
            <span className="text-slate-500 text-xs">{article.subcategory}</span>
          )}
          <span className="ml-auto text-slate-500 text-xs">{article.readTime} {t("blog.minread")}</span>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition line-clamp-2">
          {article.title}
        </h2>

        {/* Excerpt */}
        <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">
          {article.excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {article.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="px-2 py-0.5 bg-white/5 rounded-md text-xs text-slate-400">
              #{tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center text-xs font-bold text-amber-400">
              {article.author.charAt(0)}
            </div>
            <div>
              <p className="text-white text-xs font-medium">{article.author}</p>
              <p className="text-slate-500 text-xs">{t("blog.by")} AfriMatch</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-slate-500 text-xs">
            <span>👁 {article.views.toLocaleString()}</span>
            <span>👏 {article.likes.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
