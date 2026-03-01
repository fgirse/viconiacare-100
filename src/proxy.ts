import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { routing } from '@/src/i18n/routing'
import { defaultLocale } from '@/src/i18n/config'
import { getSessionFromRequest } from '@/src/lib/auth/session-edge'

const intlMiddleware = createMiddleware(routing)

// Routes that require authentication (without locale prefix)
const PROTECTED_PATHS = ['/dashboard']
// Routes only accessible while logged out (without locale prefix)
const GUEST_ONLY_PATHS = ['/login']

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Detect optional locale prefix
  const localeMatch = pathname.match(/^\/(de|en|fr|it|es|pt|tr)(?=\/|$)/)
  const locale      = localeMatch?.[1] ?? null

  // Bare path: strip locale prefix if present; with `as-needed`, no prefix = default locale
  const barePath = locale ? pathname.slice(locale.length + 1) || '/' : pathname

  const isProtected = PROTECTED_PATHS.some(p => barePath === p || barePath.startsWith(`${p}/`))
  const isGuestOnly = GUEST_ONLY_PATHS.some(p => barePath === p || barePath.startsWith(`${p}/`))

  if (isProtected || isGuestOnly) {
    const session = await getSessionFromRequest(req)

    if (isProtected && !session) {
      // Preserve locale prefix in redirect target; default locale has no prefix (as-needed)
      const loginPath = locale && locale !== defaultLocale ? `/${locale}/login` : '/login'
      const loginUrl  = new URL(loginPath, req.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }

    if (isGuestOnly && session) {
      const dashPath = locale && locale !== defaultLocale ? `/${locale}/dashboard` : '/dashboard'
      return NextResponse.redirect(new URL(dashPath, req.url))
    }
  }

  return intlMiddleware(req)
}

export const config = {
  matcher: [
    '/((?!admin|api|_next/static|_next/image|favicon.ico|images|fonts|media).*)',
  ],
}
