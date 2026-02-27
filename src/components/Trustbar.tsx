function IconBadge() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {/* back shield shape */}
      <path d="M12 2L4 5.5V11c0 4.8 3.4 9.1 8 10 4.6-.9 8-5.2 8-10V5.5L12 2Z" fill="#ca8a04" opacity="0.25" />
      {/* front shield */}
      <path d="M12 4L5.5 7V11c0 3.9 2.8 7.5 6.5 8.4C15.7 18.5 18.5 14.9 18.5 11V7L12 4Z" fill="#ca8a04" />
      {/* checkmark */}
      <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

function IconShield() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {/* outer cross arms */}
      <rect x="10" y="3" width="4" height="18" rx="2" fill="#ca8a04" opacity="0.25" />
      <rect x="3" y="10" width="18" height="4" rx="2" fill="#ca8a04" opacity="0.25" />
      {/* inner cross */}
      <rect x="11" y="5" width="2" height="14" rx="1" fill="#ca8a04" />
      <rect x="5" y="11" width="14" height="2" rx="1" fill="#ca8a04" />
      {/* center dot */}
      <circle cx="12" cy="12" r="1.5" fill="white" />
    </svg>
  )
}

function IconClock() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {/* outer ring */}
      <circle cx="12" cy="12" r="9" fill="#ca8a04" opacity="0.25" />
      {/* inner face */}
      <circle cx="12" cy="12" r="7" fill="#ca8a04" />
      {/* hour hand */}
      <line x1="12" y1="12" x2="12" y2="7" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      {/* minute hand */}
      <line x1="12" y1="12" x2="15.5" y2="13.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      {/* center pin */}
      <circle cx="12" cy="12" r="1" fill="white" />
    </svg>
  )
}

function IconGlobe() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {/* outer circle */}
      <circle cx="12" cy="12" r="9" fill="#ca8a04" opacity="0.25" />
      <circle cx="12" cy="12" r="9" stroke="#ca8a04" strokeWidth="1.5" fill="none" />
      {/* meridian ellipse */}
      <ellipse cx="12" cy="12" rx="4" ry="9" stroke="#ca8a04" strokeWidth="1.5" fill="none" />
      {/* latitude lines */}
      <line x1="3.5" y1="9" x2="20.5" y2="9" stroke="#ca8a04" strokeWidth="1.2" />
      <line x1="3.5" y1="15" x2="20.5" y2="15" stroke="#ca8a04" strokeWidth="1.2" />
      {/* fill inside globe */}
      <circle cx="12" cy="12" r="6.5" fill="#ca8a04" opacity="0.15" />
    </svg>
  )
}

function IconHandshake() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {/* left hand base */}
      <path d="M2 10.5c0 0 2-1.5 4-1.5l3 1.5" stroke="#ca8a04" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.4" />
      {/* right hand base */}
      <path d="M22 10.5c0 0-2-1.5-4-1.5L15 11.5" stroke="#ca8a04" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.4" />
      {/* clasped hands body */}
      <path d="M6 9C7 7 9 7 10 8l2 2 2-2c1-1 3-1 4 1l1 2-5 5H9L5 12l1-3Z" fill="#ca8a04" />
      {/* finger detail */}
      <path d="M10 8l2 2 2-2" stroke="white" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      {/* bottom fingers */}
      <path d="M9 16l1.5 2M12 16v2M15 16l-1.5 2" stroke="#ca8a04" strokeWidth="1.4" strokeLinecap="round" opacity="0.5" />
    </svg>
  )
}

const TRUST_ITEMS = [
  { Icon: IconBadge,     label: 'MDK-geprüfte Qualität' },
  { Icon: IconShield,    label: 'Alle Kassen zugelassen' },
  { Icon: IconClock,     label: '24/7 Erreichbar' },
  { Icon: IconGlobe,     label: '6 Sprachen' },
  { Icon: IconHandshake, label: 'Kostenlose Erstberatung' },
]

export default function TrustBar() {
  return (
    <div className="hidden md:block bg-gradient-to-r from-slate-800 via-slate-600 to-slate-900 border-b border-stone-200">
      <div className="max-w-[1600px] mx-auto px-6 py-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
        {TRUST_ITEMS.map(({ Icon, label }, i) => (
          <span key={label} className="flex items-center gap-x-8">
            <span className="flex items-center gap-2 text-[0.82rem] font-bold uppercase tracking-[0.04em] text-stone-200">
              <Icon />
              {label}
            </span>
            {i < TRUST_ITEMS.length - 1 && (
              <span className="hidden sm:block w-px h-5 bg-stone-300" />
            )}
          </span>
        ))}
      </div>
    </div>
  )
}