export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  rtl?: boolean;
  region?: string;
}

export const LANGUAGES: Language[] = [
  // Primary African + Global languages
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧", region: "Global" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷", region: "Global" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦", rtl: true, region: "Africa/Middle East" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇵🇹", region: "Global" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸", region: "Global" },
  { code: "sw", name: "Swahili", nativeName: "Kiswahili", flag: "🇰🇪", region: "East Africa" },
  { code: "af", name: "Afrikaans", nativeName: "Afrikaans", flag: "🇿🇦", region: "Southern Africa" },
  { code: "yo", name: "Yoruba", nativeName: "Yorùbá", flag: "🇳🇬", region: "West Africa" },
  { code: "ha", name: "Hausa", nativeName: "Hausa", flag: "🇳🇬", region: "West Africa" },
  { code: "ig", name: "Igbo", nativeName: "Igbo", flag: "🇳🇬", region: "West Africa" },
  { code: "wo", name: "Wolof", nativeName: "Wolof", flag: "🇸🇳", region: "West Africa" },
  { code: "tw", name: "Twi (Ashanti)", nativeName: "Twi", flag: "🇬🇭", region: "West Africa" },
  // Additional African languages
  { code: "am", name: "Amharic", nativeName: "አማርኛ", flag: "🇪🇹", region: "East Africa" },
  { code: "so", name: "Somali", nativeName: "Soomaali", flag: "🇸🇴", region: "East Africa" },
  { code: "zu", name: "Zulu", nativeName: "isiZulu", flag: "🇿🇦", region: "Southern Africa" },
  { code: "xh", name: "Xhosa", nativeName: "isiXhosa", flag: "🇿🇦", region: "Southern Africa" },
  { code: "sn", name: "Shona", nativeName: "chiShona", flag: "🇿🇼", region: "Southern Africa" },
  { code: "rw", name: "Kinyarwanda", nativeName: "Kinyarwanda", flag: "🇷🇼", region: "East Africa" },
  { code: "ln", name: "Lingala", nativeName: "Lingála", flag: "🇨🇩", region: "Central Africa" },
  { code: "mg", name: "Malagasy", nativeName: "Malagasy", flag: "🇲🇬", region: "Indian Ocean" },
  { code: "ff", name: "Fula", nativeName: "Fulfulde", flag: "🌍", region: "West Africa" },
  { code: "bm", name: "Bambara", nativeName: "Bamanankan", flag: "🇲🇱", region: "West Africa" },
  // Global languages
  { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳", region: "Asia" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳", region: "Asia" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪", region: "Europe" },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹", region: "Europe" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺", region: "Europe/Asia" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵", region: "Asia" },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷", region: "Asia" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", flag: "🇹🇷", region: "Europe/Asia" },
];

// Primary languages shown first in the switcher
export const PRIMARY_LANGUAGES = LANGUAGES.slice(0, 12);

// Map browser language codes to our language codes
export function detectLanguage(): string {
  if (typeof window === "undefined") return "en";
  
  const browserLang = navigator.language || navigator.languages?.[0] || "en";
  const langCode = browserLang.split("-")[0].toLowerCase();
  
  // Check if we support this language
  const supported = LANGUAGES.find((l) => l.code === langCode);
  if (supported) return supported.code;
  
  // Fallback mappings
  const fallbacks: Record<string, string> = {
    "zh-tw": "zh",
    "zh-hk": "zh",
    "pt-br": "pt",
    "en-us": "en",
    "en-gb": "en",
    "fr-ca": "fr",
    "ar-eg": "ar",
    "ar-ma": "ar",
    "ar-dz": "ar",
    "ar-tn": "ar",
  };
  
  const fullCode = browserLang.toLowerCase();
  if (fallbacks[fullCode]) return fallbacks[fullCode];
  
  return "en";
}

export function getLanguageByCode(code: string): Language {
  return LANGUAGES.find((l) => l.code === code) || LANGUAGES[0];
}
