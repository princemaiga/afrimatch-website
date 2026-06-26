"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/lib/i18n/language-context";
import { LANGUAGES, PRIMARY_LANGUAGES } from "@/lib/i18n/languages";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = search
    ? LANGUAGES.filter(
        (l) =>
          l.name.toLowerCase().includes(search.toLowerCase()) ||
          l.nativeName.toLowerCase().includes(search.toLowerCase()) ||
          l.code.toLowerCase().includes(search.toLowerCase())
      )
    : LANGUAGES;

  const primaryFiltered = search ? [] : PRIMARY_LANGUAGES;
  const otherFiltered = search ? filtered : LANGUAGES.filter((l) => !PRIMARY_LANGUAGES.find((p) => p.code === l.code));

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition text-sm"
        aria-label="Change language"
      >
        <span className="text-base">{language.flag}</span>
        <span className="hidden sm:inline font-medium">{language.code.toUpperCase()}</span>
        <svg className="w-3 h-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-[#0d1526] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 z-[100] overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b border-white/5">
            <input
              type="text"
              placeholder="Search languages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
              autoFocus
            />
          </div>

          <div className="max-h-80 overflow-y-auto">
            {/* Primary languages */}
            {primaryFiltered.length > 0 && (
              <>
                <div className="px-3 py-2 text-xs text-slate-500 font-medium uppercase tracking-wider">
                  Primary Languages
                </div>
                {primaryFiltered.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => { setLanguage(lang.code); setOpen(false); setSearch(""); }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-white/5 transition ${language.code === lang.code ? "bg-amber-500/10 text-amber-400" : "text-slate-300"}`}
                  >
                    <span className="text-lg w-6 text-center">{lang.flag}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{lang.name}</div>
                      <div className="text-xs text-slate-500 truncate">{lang.nativeName}</div>
                    </div>
                    {lang.region && (
                      <span className="text-xs text-slate-600 flex-shrink-0">{lang.region}</span>
                    )}
                    {language.code === lang.code && (
                      <span className="text-amber-400 flex-shrink-0">✓</span>
                    )}
                  </button>
                ))}
              </>
            )}

            {/* Other languages */}
            {otherFiltered.length > 0 && (
              <>
                <div className="px-3 py-2 text-xs text-slate-500 font-medium uppercase tracking-wider border-t border-white/5">
                  {search ? "Results" : "More Languages"}
                </div>
                {otherFiltered.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => { setLanguage(lang.code); setOpen(false); setSearch(""); }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-white/5 transition ${language.code === lang.code ? "bg-amber-500/10 text-amber-400" : "text-slate-300"}`}
                  >
                    <span className="text-lg w-6 text-center">{lang.flag}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{lang.name}</div>
                      <div className="text-xs text-slate-500 truncate">{lang.nativeName}</div>
                    </div>
                    {lang.region && (
                      <span className="text-xs text-slate-600 flex-shrink-0">{lang.region}</span>
                    )}
                    {language.code === lang.code && (
                      <span className="text-amber-400 flex-shrink-0">✓</span>
                    )}
                  </button>
                ))}
              </>
            )}

            {filtered.length === 0 && (
              <div className="px-4 py-8 text-center text-slate-500 text-sm">
                No languages found for &ldquo;{search}&rdquo;
              </div>
            )}
          </div>

          <div className="p-3 border-t border-white/5 text-xs text-slate-600 text-center">
            {LANGUAGES.length} languages available
          </div>
        </div>
      )}
    </div>
  );
}
