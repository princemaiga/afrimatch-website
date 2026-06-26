"use client";
import { useLanguage } from "./language-context";
import { t as translate, type TranslationKey } from "./translations";

/**
 * useTranslation — returns a `t()` function bound to the current language.
 *
 * Usage:
 *   const { t } = useTranslation();
 *   <h1>{t("hero.headline")}</h1>
 */
export function useTranslation() {
  const { languageCode } = useLanguage();
  const t = (key: TranslationKey): string => translate(key, languageCode);
  return { t, languageCode };
}
