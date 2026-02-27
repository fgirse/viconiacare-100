'use client'

import { Service } from '@/src/types/service';
import { ServiceIconSVG } from '@/components/ServiceIcons';

interface ServiceCardProps {
  service: Service
  index: number
}

// Alternate the icon container accent between brand colors
const accentMap = (index: number) =>
  index % 2 === 0
    ? {
        iconBg: 'bg-yellow-600/10 group-hover:bg-yellow-600/20',
        iconColor: 'text-yellow-600',
        tag: 'bg-yellow-600/10 text-yellow-700',
        border: 'hover:border-yellow-600/40',
        dot: 'bg-yellow-500',
      }
    : {
        iconBg: 'bg-emerald-500/10 group-hover:bg-emerald-500/20',
        iconColor: 'text-emerald-600',
        tag: 'bg-emerald-500/10 text-emerald-700',
        border: 'hover:border-emerald-500/40',
        dot: 'bg-emerald-500',
      }

export default function ServiceCard({ service, index }: ServiceCardProps) {
  const accent = accentMap(index)

  return (
    <article
      className={`
        group relative flex flex-col gap-5 rounded-2xl bg-white
        border border-stone-200 ${accent.border}
        p-7 shadow-sm hover:shadow-xl
        transition-all duration-400 ease-out
        hover:-translate-y-1.5
        overflow-hidden
      `}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Subtle background texture on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 80% 20%, rgba(234,179,8,0.04) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />

      {/* Header row: icon + kassen-badge */}
      <div className="flex items-start justify-between gap-3">
        <div
          className={`
            flex items-center justify-center w-14 h-14 rounded-xl
            ${accent.iconBg} ${accent.iconColor}
            transition-all duration-300 shrink-0
          `}
        >
          <ServiceIconSVG name={service.icon} className="w-7 h-7" />
        </div>

        {service.kassenleistung && (
          <span
            className={`
              inline-flex items-center gap-1.5 rounded-full px-2.5 py-1
              text-[0.68rem] font-semibold tracking-wide uppercase
              ${accent.tag}
            `}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${accent.dot}`} />
            Kassenleistung
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-stone-900 font-bold text-[1.05rem] leading-snug tracking-tight">
        {service.title}
      </h3>

      {/* Short description */}
      <p className="text-stone-500 text-sm leading-relaxed flex-1">
        {service.shortDescription}
      </p>

      {/* Highlights */}
      {service.highlights && service.highlights.length > 0 && (
        <ul className="space-y-1.5 mt-auto border-t border-stone-100 pt-4">
          {service.highlights.slice(0, 4).map((h, i) => (
            <li
              key={i}
              className="flex items-center gap-2 text-stone-600 text-xs"
            >
              <svg
                className={`w-3.5 h-3.5 shrink-0 ${accent.iconColor}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {h.point}
            </li>
          ))}
        </ul>
      )}

      {/* Bottom arrow hint */}
      <div
        className={`
          absolute bottom-5 right-5 w-7 h-7 rounded-full
          flex items-center justify-center
          ${accent.iconBg} ${accent.iconColor}
          opacity-0 group-hover:opacity-100
          translate-x-2 group-hover:translate-x-0
          transition-all duration-300
        `}
        aria-hidden="true"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
    </article>
  )
}
