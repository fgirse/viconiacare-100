
export const locales = ['de', 'en', 'fr', 'it', 'es', 'pt', 'tr'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'de'

export const localeLabels: Record<Locale, string> = {
  de: 'Deutsch',
  en: 'English',
  fr: 'Français',
  it: 'Italiano',
  es: 'Español',
  pt: 'Português',
  tr: 'Türkçe',
}

export const localeFlags: Record<Locale, string> = {
  de: '🇩🇪', en: '🇬🇧', fr: '🇫🇷', it: '🇮🇹',
  es: '🇪🇸', pt: '🇵🇹', tr: '🇹🇷',
}