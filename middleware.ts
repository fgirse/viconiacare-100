import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './src/i18n/config'

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',      // /de/... only when not default
})

export const config = {
  matcher: [
    // Match all paths except:
    // - /admin (Payload CMS)
    // - /api   (API routes)
    // - static assets
    '/((?!admin|api|_next/static|_next/image|favicon.ico|images|fonts|media).*)',
  ],
}