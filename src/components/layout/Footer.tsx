import { Link } from '@/src/i18n/navigation'
type AppPathname = string
import Image from 'next/image'
import LogoViconia from '@/public/images/ViconiaCareLogoobg.svg';
import LocaleSwitcher from '@/src/components/LocaleSwitcher'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/src/i18n/config'

interface NavItem { label: string; link: string; openInNewTab?: boolean }
interface SiteContact { phone?: string; email?: string; address?: string }
interface NavigationGlobal { footerLeistungen?: NavItem[]; footerInfos?: NavItem[] }

const normalizeNavItems = (items?: NavItem[]): NavItem[] => {
  if (!items?.length) return []
  return items.filter((item) => Boolean(item?.label?.trim()) && Boolean(item?.link?.trim()))
}

async function getFooterData(locale: Locale): Promise<{
  leistungen: NavItem[]
  infos: NavItem[]
  siteName: string
  contact: SiteContact
}> {
  try {
    const payload = await getPayload({ config: configPromise })

    const [localizedNav, site] = await Promise.all([
      payload.findGlobal({
        slug: 'navigation',
        depth: 0,
        locale,
        fallbackLocale: false,
      }) as Promise<NavigationGlobal>,
      payload.findGlobal({ slug: 'site-settings', depth: 0 }) as Promise<{
        siteName?: string
        contact?: SiteContact
      }>,
    ])

    return {
      leistungen: normalizeNavItems(localizedNav.footerLeistungen),
      infos: normalizeNavItems(localizedNav.footerInfos),
      siteName: site.siteName ?? 'ViconiaCare GmbH',
      contact: site.contact ?? {},
    }
  } catch (err) {
    console.error('[Footer] getFooterData error:', err)
    return {
      leistungen: [],
      infos: [],
      siteName: 'ViconiaCare GmbH',
      contact: {},
    }
  }
}

// ── SVG Icons (duotone yellow-600 / white) ───────────────────────────
const IconPhone = () => (
  <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.18 21 3 13.82 3 5c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.24 1.01L6.62 10.79z" fill="#f6ca08ff"/>
    <path d="M15.5 5a5 5 0 015 5M15.5 8a2 2 0 012 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.8"/>
  </svg>
)

const IconMail = () => (
  <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
    <rect x="2" y="4" width="20" height="16" rx="3" fill="#f6bb08ff"/>
    <path d="M2 7l10 7 10-7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.85"/>
  </svg>
)

const IconMapPin = () => (
  <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#f6bb08ff"/>
    <circle cx="12" cy="9" r="2.5" fill="white" opacity="0.85"/>
  </svg>
)

const IconClock = () => (
  <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
    <circle cx="12" cy="12" r="9" fill="f"/>
    <path d="M12 7v5l3.5 2" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" opacity="0.9"/>
  </svg>
)

const IconFacebook = () => (
  <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
    <path d="M24 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" fill="#f6bb08ff"/>
  </svg>
)

const IconInstagram = () => (
  <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
    <rect x="2" y="2" width="20" height="20" rx="6" fill="#f6bb08ff"/>
    <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="1.5" opacity="0.9"/>
    <circle cx="17.5" cy="6.5" r="1.2" fill="white" opacity="0.9"/>
  </svg>
)

const IconLinkedIn = () => (
  <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
    <rect x="2" y="2" width="20" height="20" rx="4" fill="#f6bb08ff"/>
    <path d="M8 11v5M8 8v.01M12 11v5M12 14a2 2 0 014 0v2" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" opacity="0.9"/>
  </svg>
)

const IconWhatsApp = () => (
  <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
    <path d="M12 2a10 10 0 00-8.55 15.15L2 22l4.99-1.3A10 10 0 1012 2z" fill="#f6bb08ff"/>
    <path d="M16.01 14.98c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.49-.89-.79-1.48-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.21-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.8.36-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.22 3.07c.15.2 2.1 3.2 5.1 4.49.71.3 1.27.48 1.7.62.72.22 1.37.19 1.88.12.57-.09 1.77-.72 2.02-1.43.25-.7.25-1.29.18-1.42-.07-.13-.27-.21-.57-.35z" fill="white" opacity="0.9"/>
  </svg>
)

const SOCIALS = [
  { icon: <IconFacebook />,  label: 'Facebook',  href: '#' },
  { icon: <IconInstagram />, label: 'Instagram', href: '#' },
  { icon: <IconLinkedIn />,  label: 'LinkedIn',  href: '#' },
  { icon: <IconWhatsApp />,  label: 'WhatsApp',  href: '#' },
]

export default async function Footer({ locale }: { locale: Locale }) {
  const { leistungen, infos, siteName, contact } = await getFooterData(locale)
  const t = await getTranslations({ locale, namespace: 'footer' })

  const services = leistungen
  const infoLinks = infos

  const phone   = contact.phone   ?? '+49 40 123 456 789'
  const email   = contact.email   ?? 'info@viconiacare.de'
  const address = contact.address ?? 'Weidestr. 120 b, 22083 Hamburg'
  return (
    <footer id="contact" className="bg-slate-900 text-white pt-20">
      <div className="max-w-[1200px] mx-auto px-6">

        {/* ── Main grid ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-10 pb-16 border-b border-white/8">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-20 h-20 rounded-xl  flex items-center justify-center text-xl">
                <Image
                src={LogoViconia}
                alt="ViconiaCare Logo"
                width={60}
                height={60}
              />
              </div>
              <p className='font-passionate text-[2.2rem] text-yellow-500'>{siteName}
             </p> 
            </div>

            <p className="text-sm leading-relaxed text-white/45 max-w-[280px] mb-7 font-light">
              {t('tagline')}
            </p>

            <div className="flex flex-col gap-3">
              {[
                { icon: <IconPhone />,  text: phone,   href: `tel:${phone.replace(/\s/g, '')}` },
                { icon: <IconMail />,   text: email,   href: `mailto:${email}` },
                { icon: <IconMapPin />, text: address, href: null as string | null },
                { icon: <IconClock />,  text: 'Mo–Fr 08:00–18:00 · Notfall 24/7', href: null as string | null },
              ].map(({ icon, text, href }) => {
                const inner = (
                  <div className="flex items-center gap-2.5 text-sm text-white/55 transition-colors duration-200 hover:text-teal-400">
                    <div className="w-8 h-8 rounded-lg bg-white/6 flex items-center justify-center text-base flex-shrink-0">
                      {icon}
                    </div>
                    {text}
                  </div>
                )
                return href
                  ? <a key={text} href={href}>{inner}</a>
                  : <div key={text}>{inner}</div>
              })}
            </div>

            {/* Social icons */}
            <div className="flex gap-2.5 mt-6">
              {SOCIALS.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-[10px] bg-white/6 border border-white/10 flex items-center justify-center text-sm text-white/50 transition-all duration-200 hover:bg-teal-800/40 hover:border-teal-600 hover:text-teal-400 hover:-translate-y-0.5"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* B1 Services */}
          {services.length > 0 && (
            <div>
              <h4 className="font-display text-base font-bold text-white mb-5">{t('col_services')}</h4>
              <ul className="flex flex-col gap-2.5">
                {services.map((item) => (
                  <li key={`${item.label}-${item.link}`}>
                    <Link
                      href={item.link as AppPathname}
                      {...(item.openInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="text-sm text-white/45 transition-colors duration-200 hover:text-yellow-600"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* B2 Info */}
          {infoLinks.length > 0 && (
            <div>
              <h4 className="font-display text-base font-bold text-white mb-5">{t('col_info')}</h4>
              <ul className="flex flex-col gap-2.5">
                {infoLinks.map((item) => (
                  <li key={`${item.label}-${item.link}`}>
                    <Link
                      href={item.link as AppPathname}
                      {...(item.openInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="text-sm text-white/45 transition-colors duration-200 hover:text-yellow-600"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Language + Emergency */}
          <div>
            <h4 className="font-display text-base font-bold text-white mb-5">{t('col_language')}</h4>
            <LocaleSwitcher />

            <h4 className="font-display text-base font-bold text-white mt-7 mb-4">{t('col_emergency')}</h4>
            <a
              href="tel:+4989123456789"
              className="text-sm font-bold text-orange-400 hover:text-orange-300 transition-colors duration-200"
            >
              📞 {t('emergency')}
            </a>
          </div>
        </div>

        {/* ── Bottom bar ──────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-7">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} {siteName} · Ambulanter Pflegedienst & <span className="text-yellow-500 uppercase font-mono">Medicus Design</span> ·Basel·🇨🇭 · {t('rights')}
          </p>
          <div className="flex items-center gap-5">
            {[
              { label: t('imprint'),       href: '#' },
              { label: t('privacy'),       href: '#' },
              { label: t('terms'),         href: '#' },
              { label: t('accessibility'), href: '#' },
            ].map((link, i, arr) => (
              <span key={link.label} className="flex items-center gap-5">
                <a href={link.href} className="text-xs text-white/30 hover:text-yellow-600 transition-colors duration-200">
                  {link.label}
                </a>
                {i < arr.length - 1 && <span className="w-px h-3.5 bg-white/15" />}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
