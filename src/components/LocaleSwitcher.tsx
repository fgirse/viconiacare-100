'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/src/i18n/navigation'
import { locales, localeFlags, localeLabels } from '@/src/i18n/config'
import type { Locale } from '@/src/i18n/config'

export default function LocaleSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const currentLocale = useLocale()

  function switchLocale(locale: Locale) {
    router.replace(pathname, { locale })
  }

  return (
    <div className="flex flex-wrap gap-2">
      {locales.map((locale) => (
        <button
          key={locale}
          onClick={() => switchLocale(locale)}
          className={`px-3 py-1.5 rounded-full border text-xs font-bold transition-all duration-200 ${
            locale === currentLocale
              ? 'bg-teal-800/40 border-teal-600 text-teal-400'
              : 'bg-white/6 border-white/10 text-white/50 hover:bg-teal-800/40 hover:border-teal-600 hover:text-teal-400'
          }`}
        >
          {localeFlags[locale]} {localeLabels[locale]}
        </button>
      ))}
    </div>
  )
}
