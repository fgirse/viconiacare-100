'use client'

import { useState, useEffect, useRef } from 'react'
import { cn } from '@/src/lib/utils/utils';
import CalWidget from '@/src/components/booking/CalWidget'

// ── Types ─────────────────────────────────────────────────────────────────────
interface BookingType {
  id: string
  icon: string
  step: string
  title: string
  description: string
  duration: number   // minutes
  highlighted?: boolean
  popular?: boolean
}

// ── Data ─────────────────────────────────────────────────────────────────────
const BOOKING_TYPES: BookingType[] = [
  {
    id: 'info',
    icon: '📞',
    step: 'Schritt 1',
    title: 'Info-Telefonat',
    description: 'Stellen Sie Ihre Fragen – kostenlos und ohne Verbindlichkeit. Wir erklären Ihnen alles rund um unsere Leistungen.',
    duration: 30,
  },
  {
    id: 'eval',
    icon: '📋',
    step: 'Schritt 2',
    title: 'Bedarfsanalyse',
    description: 'Gemeinsam ermitteln wir Ihren Pflegebedarf und besprechen mögliche Leistungen – präzise und persönlich.',
    duration: 60,
    highlighted: true,
    popular: true,
  },
  {
    id: 'visit',
    icon: '🏡',
    step: 'Schritt 3',
    title: 'Hausbesuch',
    description: 'Wir kommen zu Ihnen – für eine persönliche Evaluation Ihrer Wohnsituation und einen konkreten Pflegeplan.',
    duration: 90,
  },
]

const NOTES = [
  'Kostenlos & unverbindlich',
  'Sofortige Bestätigung per E-Mail',
  'Kostenlose Stornierung bis 24h vorher',
]

// ── BookingCard ───────────────────────────────────────────────────────────────
function BookingCard({
  type,
  onSelect,
  isActive,
  index,
}: {
  type: BookingType
  onSelect: (t: BookingType) => void
  isActive: boolean
  index: number
}) {
  return (
    <article
      className={cn(
        'reveal-booking opacity-0 translate-y-7 transition-all duration-700 cursor-pointer',
        'relative rounded-[2rem] p-10 border-2 text-center overflow-hidden',
        'transition-all',
        type.highlighted
          ? cn(
              'bg-gradient-to-br from-teal-800 to-teal-950 border-teal-700',
              'hover:-translate-y-1.5 hover:shadow-[0_20px_60px_rgba(13,148,136,.35)]',
            )
          : cn(
              'bg-white border-stone-100',
              'hover:border-teal-400 hover:-translate-y-1.5 hover:shadow-brand-md',
              isActive && 'border-teal-400 shadow-brand-md',
            ),
      )}
      style={{ transitionDelay: `${index * 80}ms` }}
      onClick={() => onSelect(type)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onSelect(type)}
    >
      {/* Popular badge */}
      {type.popular && (
        <div className="absolute top-0 right-8 px-3.5 py-1.5 bg-gradient-to-r from-orange-500 to-orange-400 text-white text-[0.7rem] font-bold uppercase tracking-[0.08em] rounded-b-xl shadow-orange-sm">
          Empfohlen
        </div>
      )}

      {/* Icon */}
      <div className={cn(
        'w-[72px] h-[72px] mx-auto mb-6 rounded-full flex items-center justify-center text-[2rem]',
        type.highlighted ? 'bg-white/12' : 'bg-teal-50',
      )}>
        {type.icon}
      </div>

      {/* Step */}
      <div className={cn(
        'text-[0.72rem] font-bold uppercase tracking-[0.12em] mb-2',
        type.highlighted ? 'text-teal-400' : 'text-teal-500',
      )}>
        {type.step}
      </div>

      {/* Title */}
      <h3 className={cn(
        'font-display text-[1.35rem] font-bold mb-3 leading-[1.2]',
        type.highlighted ? 'text-white' : 'text-teal-950',
      )}>
        {type.title}
      </h3>

      {/* Description */}
      <p className={cn(
        'text-[0.875rem] leading-[1.65] mb-6',
        type.highlighted ? 'text-white/60' : 'text-stone-500',
      )}>
        {type.description}
      </p>

      {/* Duration badge */}
      <div className={cn(
        'inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[0.78rem] font-bold mb-7',
        type.highlighted
          ? 'bg-white/10 text-white/60'
          : 'bg-stone-100 text-stone-600',
      )}>
        <ClockIcon className="w-3.5 h-3.5" />
        {type.duration} Minuten
      </div>

      {/* CTA */}
      <button
        className={cn(
          'w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-bold text-[0.9rem] uppercase tracking-[0.04em] transition-all duration-200',
          type.highlighted
            ? 'bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-orange-sm hover:-translate-y-0.5 hover:shadow-orange-md'
            : 'bg-teal-600 text-white shadow-brand-sm hover:bg-teal-700 hover:-translate-y-0.5 hover:shadow-brand-md',
        )}
      >
        <CalIcon className="w-4 h-4" />
        Termin wählen
      </button>
    </article>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function BookingSection() {
  const [activeType, setActiveType] = useState<BookingType | null>(null)
  const widgetRef = useRef<HTMLDivElement>(null)

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('opacity-100', 'translate-y-0')
            observer.unobserve(e.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    document.querySelectorAll('.reveal-booking-header, .reveal-booking').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  // Scroll to widget when opened
  useEffect(() => {
    if (activeType && widgetRef.current) {
      setTimeout(() => {
        widgetRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 100)
    }
  }, [activeType])

  const handleSelect = (type: BookingType) => {
    setActiveType(prev => prev?.id === type.id ? null : type)
  }

  return (
    <section id="booking" className="py-[120px] px-6 bg-white relative overflow-hidden scroll-mt-[72px]">

      {/* BG gradients */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: [
            'radial-gradient(ellipse 800px 600px at 10% 50%, #f0fdfa 0%, transparent 70%)',
            'radial-gradient(ellipse 400px 400px at 90% 20%, #ffedd5 0%, transparent 70%)',
          ].join(',')
        }}
      />

      <div className="max-w-[1200px] mx-auto relative z-10">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="reveal-booking-header opacity-0 translate-y-7 transition-all duration-700 inline-flex items-center justify-center gap-2 text-[0.75rem] font-bold uppercase tracking-[0.15em] text-teal-600 mb-4">
            <span className="w-6 h-[2px] bg-teal-500 rounded" />
            Terminbuchung
            <span className="w-6 h-[2px] bg-teal-500 rounded" />
          </div>
          <h2 className="reveal-booking-header opacity-0 translate-y-7 transition-all duration-700 delay-75 font-display text-[clamp(2.2rem,4vw,3.2rem)] font-black leading-[1.1] tracking-[-0.02em] text-teal-950 mb-4">
            Ihr erster Schritt –<br />
            <em className="not-italic text-teal-600">kostenlos & unverbindlich.</em>
          </h2>
          <p className="reveal-booking-header opacity-0 translate-y-7 transition-all duration-700 delay-150 text-[1.05rem] leading-[1.75] text-stone-500 font-light max-w-[560px] mx-auto">
            Wählen Sie die passende Art des Gesprächs. Wir melden uns prompt
            und begleiten Sie von Anfang an.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 mb-10">
          {BOOKING_TYPES.map((type, i) => (
            <BookingCard
              key={type.id}
              type={type}
              onSelect={handleSelect}
              isActive={activeType?.id === type.id}
              index={i}
            />
          ))}
        </div>

        {/* Cal widget (conditionally rendered) */}
        {activeType && (
          <div ref={widgetRef} className="max-w-[720px] mx-auto mb-10">
            <CalWidget
              eventTypeId={activeType.id}
              title={activeType.title}
              description={`${activeType.step} · ${activeType.duration} Minuten`}
              onClose={() => setActiveType(null)}
            />
          </div>
        )}

        {/* Notes */}
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 mt-4">
          {NOTES.map(note => (
            <div key={note} className="flex items-center gap-2 text-[0.82rem] font-bold text-stone-500">
              <CheckIcon className="w-4 h-4 text-teal-500" />
              {note}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Icons ─────────────────────────────────────────────────────────────────────
function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="10" />
      <path strokeLinecap="round" d="M12 6v6l4 2" />
    </svg>
  )
}
function CalIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  )
}
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}
