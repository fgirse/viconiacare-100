'use client'

import { useEffect, } from 'react'

// ── Utils ─────────────────────────────────────────────────────────────────────
function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

// ── Types ─────────────────────────────────────────────────────────────────────
interface Service {
  icon: string
  title: string
  description: string
  tags: string[]
  featured?: boolean
}

// ── Data ─────────────────────────────────────────────────────────────────────
const SERVICES: Service[] = [
  {
    icon: '🛁',
    title: 'Grundpflege & Körperpflege',
    description: 'Waschen, Ankleiden, Mundpflege und Lagerung – würdevoll und schonend, auf Ihren Rhythmus abgestimmt.',
    tags: ['Täglich', 'Morgens / Abends', 'Nach Bedarf'],
  },
  {
    icon: '💊',
    title: 'Behandlungspflege',
    description: 'Medikamentengabe, Wundversorgung, Injektionen und weitere ärztlich verordnete Maßnahmen – zuverlässig und fachkundig.',
    tags: ['SGB XI § 37', 'Ärztlich verordnet', 'Kasse übernimmt'],
    featured: true,
  },
  {
    icon: '🏠',
    title: 'Hauswirtschaft',
    description: 'Einkaufen, Kochen, Reinigung und Wäsche – damit Sie sich in einem aufgeräumten Zuhause wohlfühlen.',
    tags: ['Wöchentlich', 'Flexibel', 'Individuell'],
  },
  {
    icon: '🤝',
    title: 'Begleitung & Betreuung',
    description: 'Arztbesuche, Spaziergänge, Gespräche – wir sind für Sie da und sorgen für soziale Teilhabe.',
    tags: ['§ 45b SGB XI', 'Beratungsanspruch'],
  },
  {
    icon: '🧠',
    title: 'Demenzbetreuung',
    description: 'Einfühlsame Begleitung und strukturierte Tagesgestaltung für Menschen mit Demenz – und Entlastung für Angehörige.',
    tags: ['Spezialisiert', 'Validation', '24h möglich'],
  },
  {
    icon: '🕊️',
    title: 'Palliativpflege',
    description: 'Würdevolle Begleitung am Lebensende – für Schmerzlinderung, Lebensqualität und Unterstützung der Familie.',
    tags: ['SAPV', 'Kooperation Palliativteam'],
  },
]

// ── Scroll-reveal hook ────────────────────────────────────────────────────────
function useScrollReveal(selector = '.reveal') {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const siblings = entry.target.parentElement?.querySelectorAll(selector) ?? []
            const idx = Array.from(siblings).indexOf(entry.target as Element)
            setTimeout(() => entry.target.classList.add('opacity-100', 'translate-y-0'), idx * 80)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )

    document.querySelectorAll(selector).forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [selector])
}

// ── ServiceCard ───────────────────────────────────────────────────────────────
function ServiceCard({ service, index }: { service: Service; index: number }) {
  return (
    <article
      className={cn(
        'reveal opacity-0 translate-y-7 transition-all duration-700',
        'relative rounded-[2rem] p-9 overflow-hidden group cursor-default',
        'border-[1.5px] transition-all',
        service.featured
          ? 'bg-gradient-to-br from-teal-800 to-teal-950 border-teal-700 text-white'
          : 'bg-white border-stone-100 hover:border-teal-200 hover:-translate-y-1.5 hover:shadow-brand-md',
      )}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* Top accent line (appears on hover) */}
      {!service.featured && (
        <span className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-teal-500 to-teal-400 rounded-b-sm scale-x-0 origin-left transition-transform duration-350 group-hover:scale-x-100" />
      )}
      {service.featured && (
        <span className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-orange-400 to-orange-500 rounded-b-sm" />
      )}

      {/* Icon */}
      <div className={cn(
        'w-14 h-14 rounded-2xl flex items-center justify-center text-[1.6rem] mb-6',
        service.featured ? 'bg-white/12' : 'bg-teal-50',
      )}>
        {service.icon}
      </div>

      {/* Text */}
      <h3 className={cn(
        'font-display text-[1.2rem] font-bold mb-2.5 leading-[1.25]',
        service.featured ? 'text-white' : 'text-teal-950',
      )}>
        {service.title}
      </h3>
      <p className={cn(
        'text-[0.875rem] leading-[1.7] mb-6',
        service.featured ? 'text-white/60' : 'text-stone-500',
      )}>
        {service.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {service.tags.map(tag => (
          <span
            key={tag}
            className={cn(
              'px-3 py-1 rounded-full text-[0.72rem] font-bold',
              service.featured
                ? 'bg-white/10 text-white/70'
                : 'bg-teal-50 text-teal-700',
            )}
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function ServicesSection() {
  useScrollReveal('.reveal-services')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    document.querySelectorAll('.reveal-service-header').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section id="services" className="py-[120px] px-6 bg-white relative overflow-hidden scroll-mt-[72px]">

      {/* BG accent */}
      <div className="absolute -top-52 -right-52 w-[600px] h-[600px] rounded-full bg-teal-50 pointer-events-none" />

      <div className="max-w-[1200px] mx-auto relative">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
          <div className="max-w-[560px]">
            <div className="reveal-service-header opacity-0 translate-y-7 transition-all duration-700 flex items-center gap-2 text-[0.75rem] font-bold uppercase tracking-[0.15em] text-teal-600 mb-4">
              <span className="w-6 h-[2px] bg-teal-500 rounded" />
              Unsere Leistungen
            </div>
            <h2 className="reveal-service-header opacity-0 translate-y-7 transition-all duration-700 delay-75 font-display text-[clamp(2.2rem,4vw,3.2rem)] font-black leading-[1.1] tracking-[-0.02em] text-teal-950 mb-4">
              Pflege, die sich <em className="not-italic text-teal-600">anpasst</em> –<br className="hidden sm:block" /> nicht umgekehrt.
            </h2>
            <p className="reveal-service-header opacity-0 translate-y-7 transition-all duration-700 delay-150 text-[1.05rem] leading-[1.75] text-stone-500 font-light">
              Jeder Mensch ist einzigartig. Deshalb gestalten wir unsere Pflegeleistungen
              individuell und flexibel – für mehr Lebensqualität bei Ihnen zu Hause.
            </p>
          </div>
          <button
            onClick={() => document.querySelector('#booking')?.scrollIntoView({ behavior: 'smooth' })}
            className="reveal-service-header opacity-0 translate-y-7 transition-all duration-700 delay-200 flex items-center gap-2 text-[0.85rem] font-bold uppercase tracking-[0.06em] text-teal-600 whitespace-nowrap hover:gap-3 transition-[gap] duration-200"
          >
            Termin buchen
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
