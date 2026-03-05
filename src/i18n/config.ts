
export const locales = ['de', 'en', 'fr', 'it', 'es', 'pt', 'tr'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'de'

export const localeLabels: Record<Locale, string> = {
  de: 'Deutsch',
  en: 'English',
  fr: 'Russisch',
  it: 'Italiano',
  es: 'Español',
  pt: 'Ucraniano',
  tr: 'Türkçe',
}

export const localeFlags: Record<Locale, string> = {
  de: '🇩🇪', en: '🇬🇧', fr: '🇷🇺', it: '🇮🇹',
  es: '🇪🇸', pt: '🇺🇦', tr: '🇹🇷',
}