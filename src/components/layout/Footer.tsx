import Link from 'next/link'
import Image from 'next/image'
const SERVICES = [
  'Grundpflege', 'Behandlungspflege', 'Hauswirtschaft',
  'Begleitung', 'Demenzbetreuung', 'Palliativpflege',
]

const INFO_LINKS = [
  { label: 'Über uns',      href: '#why-us'   },
  { label: 'Unser Team',    href: '#team'     },
  { label: 'Karriere',      href: '/karriere' },
  { label: 'Pflegegrade',   href: '/pflegegrade' },
  { label: 'Kostenübernahme', href: '/kosten' },
  { label: 'FAQ',           href: '/faq'      },
]

const LANGUAGES = [
  { code: 'de', flag: '🇩🇪', label: 'DE' },
  { code: 'en', flag: '🇬🇧', label: 'EN' },
  { code: 'it', flag: '🇮🇹', label: 'IT' },
  { code: 'es', flag: '🇪🇸', label: 'ES' },
  { code: 'pt', flag: '🇵🇹', label: 'PT' },
  { code: 'tr', flag: '🇹🇷', label: 'TR' },
]

const SOCIALS = [
  { icon: 'f',  label: 'Facebook',  href: '#' },
  { icon: '📸', label: 'Instagram', href: '#' },
  { icon: 'in', label: 'LinkedIn',  href: '#' },
  { icon: '💬', label: 'WhatsApp',  href: '#' },
]

export default function Footer() {
  return (
    <footer id="contact" className="bg-slate-900 text-white pt-20">
      <div className="max-w-[1200px] mx-auto px-6">

        {/* ── Main grid ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-10 pb-16 border-b border-white/8">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-20 h-20 rounded-xl bg-gradient-to-r from-transparent to-yellow-300/10 flex items-center justify-center text-xl">
                <Image
                src="/ViconiaCareLogoobg.svg"
                alt="ViconiaCare Logo"
                width={60}
                height={60}
              />
              </div>
              <Image
                src="/text1.png"
                alt="ViconiaCare Logo"
                width={200}
                height={100}
              />
            </div>

            <p className="text-sm leading-relaxed text-white/45 max-w-[280px] mb-7 font-light">
              ViconiaCare: Ambulante Pflege, die mit Ihnen wächst – professionell, herzlich und zuverlässig.
            </p>

            <div className="flex flex-col gap-3">
              {[
                { icon: '📞', text: '+49 40 123 456 789', href: 'tel:+4940123456789' },
                { icon: '✉️', text: 'info@viconiacare.de', href: 'mailto:info@viconiacare.de' },
                { icon: '📍', text: 'Weidestr. 120 b, 22083 Hamburg', href: null },
                { icon: '🕐', text: 'Mo–Fr 08:00–18:00 · Notfall 24/7', href: null },
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
                  ? <Link key={text} href={href}>{inner}</Link>
                  : <div key={text}>{inner}</div>
              })}
            </div>

            {/* Social icons */}
            <div className="flex gap-2.5 mt-6">
              {SOCIALS.map(s => (
                <Link
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-[10px] bg-white/6 border border-white/10 flex items-center justify-center text-sm text-white/50 transition-all duration-200 hover:bg-teal-800/40 hover:border-teal-600 hover:text-teal-400 hover:-translate-y-0.5"
                >
                  {s.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display text-base font-bold text-white mb-5">Leistungen</h4>
            <ul className="flex flex-col gap-2.5">
              {SERVICES.map(s => (
                <li key={s}>
                  <Link
                    href="#services"
                    className="text-sm text-white/45 transition-colors duration-200 hover:text-teal-400"
                  >
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-display text-base font-bold text-white mb-5">Informationen</h4>
            <ul className="flex flex-col gap-2.5">
              {INFO_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-white/45 transition-colors duration-200 hover:text-teal-400"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Language + Emergency */}
          <div>
            <h4 className="font-display text-base font-bold text-white mb-5">Sprache</h4>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  className="px-3 py-1.5 rounded-full bg-white/6 border border-white/10 text-xs font-bold text-white/50 transition-all duration-200 hover:bg-teal-800/40 hover:border-teal-600 hover:text-teal-400 first:bg-teal-800/40 first:border-teal-600 first:text-teal-400"
                >
                  {lang.flag} {lang.label}
                </button>
              ))}
            </div>

            <h4 className="font-display text-base font-bold text-white mt-7 mb-4">Notfall</h4>
            <Link
              href="tel:+4989123456789"
              className="text-sm font-bold text-orange-400 hover:text-orange-300 transition-colors duration-200"
            >
              📞 24/7 Notfallnummer
            </Link>
          </div>
        </div>

        {/* ── Bottom bar ──────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-7">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} PflegePlus GmbH · Ambulanter Pflegedienst · Alle Rechte vorbehalten.
          </p>
          <div className="flex items-center gap-5">
            {['Impressum', 'Datenschutz', 'AGB', 'Barrierefreiheit'].map((link, i, arr) => (
              <span key={link} className="flex items-center gap-5">
                <Link href={`/${link.toLowerCase()}`} className="text-xs text-white/30 hover:text-teal-400 transition-colors duration-200">
                  {link}
                </Link>
                {i < arr.length - 1 && <span className="w-px h-3.5 bg-white/15" />}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
