import { getRequestConfig } from 'next-intl/server'

export const locales = ['de', 'en', 'it', 'es', 'pt', 'tr'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'de'

export const localeLabels: Record<Locale, string> = {
  de: 'Deutsch',
  en: 'English',
  it: 'Italiano',
  es: 'Español',
  pt: 'Português',
  tr: 'Türkçe',
}

export const localeFlags: Record<Locale, string> = {
  de: '🇩🇪', en: '🇬🇧', it: '🇮🇹',
  es: '🇪🇸', pt: '🇵🇹', tr: '🇹🇷',
}

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`./${locale}/common.json`)).default,
}))