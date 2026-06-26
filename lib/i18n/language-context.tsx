"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { detectLanguage, getLanguageByCode, type Language } from "./languages";

interface LanguageContextType {
  language: Language;
  languageCode: string;
  setLanguage: (code: string) => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  language: { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
  languageCode: "en",
  setLanguage: () => {},
  isRTL: false,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [languageCode, setLanguageCode] = useState("en");

  useEffect(() => {
    // Check localStorage first, then auto-detect from browser
    const stored = localStorage.getItem("afrimatch_language");
    const code = stored || detectLanguage();
    setLanguageCode(code);
    // Apply dir and lang attributes immediately on load (critical for Arabic RTL)
    const lang = getLanguageByCode(code);
    document.documentElement.dir = lang.rtl ? "rtl" : "ltr";
    document.documentElement.lang = code;
  }, []);

  const setLanguage = useCallback((code: string) => {
    setLanguageCode(code);
    localStorage.setItem("afrimatch_language", code);
    // Update document direction for RTL languages (Arabic)
    const lang = getLanguageByCode(code);
    document.documentElement.dir = lang.rtl ? "rtl" : "ltr";
    document.documentElement.lang = code;
  }, []);

  const language = getLanguageByCode(languageCode);

  return (
    <LanguageContext.Provider value={{ language, languageCode, setLanguage, isRTL: !!language.rtl }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
