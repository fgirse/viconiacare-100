import { getRequestConfig } from 'next-intl/server'
import { locales, defaultLocale } from './config'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  // Validate the locale, fall back to default if invalid
  if (!locale || !locales.includes(locale as typeof locales[number])) {
    locale = defaultLocale
  }

  return {
    locale,
    messages: (await import(`./locales/${locale}/common.json`)).default,
  }
})
