import { defineRouting } from 'next-intl/routing'
import { locales, defaultLocale } from './config'

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'always',
  pathnames: {
    '/': '/',
    '/about/history': '/about/history',
    '/about/leitbild': '/about/leitbild',
    '/about/team': '/about/team',
    '/contact': '/contact',
    '/menu_4': '/menu_4',
    '/homevisit': '/homevisit',
    '/interview': '/interview',
    '/phone': '/phone',
  },
})
