'use client'

//import Link from 'next/link'
import { cn } from '@/src/lib/utils/utils'

// ── Animated background blobs ─────────────────────────────────────────────────
function Blob({ className }: { className: string }) {
  return <div className={cn('absolute rounded-full pointer-events-none', className)} />
}

// ── Pulsing dot for badge ─────────────────────────────────────────────────────
function PulseDot() {
  return (
    <span className="relative flex h-[7px] w-[7px]">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-60" />
      <span className="relative inline-flex rounded-full h-[7px] w-[7px] bg-teal-400" />
    </span>
  )
}

// ── Floating card ─────────────────────────────────────────────────────────────
function FloatingBadge({
  icon, title, subtitle, className,
}: {
  icon: string; title: string; subtitle: string; className?: string
}) {
  return (
    <div className={cn(
      'absolute bg-white rounded-2xl px-4 py-3 shadow-2xl flex items-center gap-3',
      'text-slate-800',
      className,
    )}>
      <div className="w-9 h-9 rounded-[10px] bg-teal-50 flex items-center justify-center text-xl flex-shrink-0">
        {icon}
      </div>
      <div>
        <div className="text-[0.85rem] font-black leading-none">{title}</div>
        <div className="text-[0.72rem] text-slate-500 mt-0.5">{subtitle}</div>
      </div>
    </div>
  )
}

// ── Glass card checklist ──────────────────────────────────────────────────────
const CHECKLIST = [
  'Grundpflege & Körperpflege',
  'Medikamentengabe & Behandlung',
  'Hauswirtschaftliche Versorgung',
  'Begleitung & soziale Betreuung',
  'Demenz- & Palliativpflege',
]

function GlassCard() {
  return (
    <div className="bg-white/6 backdrop-blur-xl border border-white/12 rounded-[2.5rem] p-8 animate-[float-a_8s_ease-in-out_infinite]">
      <div className="w-13 h-13 rounded-[14px] bg-gradient-to-br from-teal-600 to-teal-500 flex items-center justify-center text-2xl shadow-[0_6px_20px_rgba(13,148,136,.4)] mb-5">
        🏥
      </div>
      <div className="font-display text-lg font-bold text-white mb-1.5">Ihr persönlicher Pflegeplan</div>
      <div className="text-sm text-white/50 mb-5">Individuell abgestimmt auf Ihre Bedürfnisse</div>
      <div className="h-px bg-white/10 mb-5" />
      <ul className="flex flex-col gap-3">
        {CHECKLIST.map(item => (
          <li key={item} className="flex items-center gap-2.5 text-[0.83rem] text-white/70">
            <span className="w-5 h-5 rounded-md bg-teal-400/15 border border-teal-400/30 flex items-center justify-center text-[0.65rem] text-teal-400 flex-shrink-0">
              ✓
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

// ── Stat item ──────────────────────────────────────────────────────────────────
function StatItem({ num, suffix, label }: { num: string; suffix: string; label: string }) {
  return (
    <div>
      <div className="font-display text-[2rem] font-black text-white leading-none">
        {num}<span className="text-orange-400">{suffix}</span>
      </div>
      <div className="text-[0.78rem] text-white/45 font-bold uppercase tracking-[0.08em] mt-1.5">
        {label}
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function HeroSection() {

  const handleScroll = (href: string) => {
    const el = document.querySelector(href)
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section className="relative min-h-screen grid lg:grid-cols-2 overflow-hidden bg-[#011c1a]">

      {/* ── Background effects ─────────────────────────────────────── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Blobs */}
        <Blob className="w-[700px] h-[700px] -top-52 -left-52 bg-teal-600/20 blur-[80px] animate-[float-a_12s_ease-in-out_infinite]" />
        <Blob className="w-[500px] h-[500px] -bottom-24 right-[5%] bg-orange-500/10 blur-[80px] animate-[float-b_10s_ease-in-out_infinite]" />
        <Blob className="w-[300px] h-[300px] top-[40%] left-[40%] bg-teal-400/8 blur-[60px] animate-[float-a_15s_ease-in-out_infinite_3s]" />
        {/* Grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* ── Left: Content ──────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col justify-center px-8 sm:px-14 lg:px-20 pt-32 pb-24 animate-fade-in-up">

        {/* Badge */}
        <div className="inline-flex items-center gap-2.5 self-start px-4 py-2 rounded-full bg-teal-400/10 border border-teal-400/25 text-teal-400 text-[0.78rem] font-bold uppercase tracking-[0.1em] mb-8">
          <PulseDot />
          Ambulante Pflege · Zuhause bei Ihnen
        </div>

        {/* Headline */}
        <h1 className="font-display text-[clamp(3rem,5vw,4.5rem)] font-black leading-[1.05] tracking-[-0.02em] text-white mb-7" style={{ animationDelay: '0.1s' }}>
          Professionelle<br />
          <em className="not-italic text-transparent [-webkit-text-stroke:2px_theme(colors.teal.400)]">Pflege,</em>
          {' '}die{' '}
          <span className="relative inline-block">
            berührt.
            <span className="absolute bottom-1 left-0 right-0 h-[6px] bg-gradient-to-r from-orange-500 to-orange-400 rounded-sm opacity-70 -z-10" />
          </span>
        </h1>

        {/* Sub */}
        <p className="text-[1.05rem] leading-[1.8] text-white/60 max-w-[480px] mb-11 font-light">
          Wir begleiten Sie und Ihre Liebsten mit Fachkompetenz,
          Einfühlungsvermögen und Herz – damit Sie in vertrauter Umgebung
          gut versorgt sind.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center gap-4 mb-14">
          <button
            onClick={() => handleScroll('#booking')}
            className={cn(
              'flex items-center gap-2.5 px-8 py-4 rounded-full font-bold text-[0.95rem] uppercase tracking-[0.04em] text-white',
              'bg-gradient-to-r from-orange-500 to-orange-600',
              'shadow-[0_8px_32px_rgba(249,115,22,.35)]',
              'transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(249,115,22,.45)]'
            )}
          >
            <CalendarIcon className="w-5 h-5" />
            Termin vereinbaren
          </button>
          <button
            onClick={() => handleScroll('#services')}
            className={cn(
              'flex items-center gap-2.5 px-7 py-4 rounded-full font-bold text-[0.95rem] uppercase tracking-[0.04em]',
              'text-white/80 border-[1.5px] border-white/20',
              'transition-all duration-200 hover:border-teal-400 hover:text-teal-400 hover:bg-teal-400/6'
            )}
          >
            <ClockIcon className="w-5 h-5" />
            Leistungen entdecken
          </button>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-10 pt-10 border-t border-white/10">
          <StatItem num="12"  suffix="+"  label="Jahre Erfahrung"    />
          <StatItem num="350" suffix="+"  label="Betreute Patienten" />
          <StatItem num="98"  suffix="%"  label="Zufriedenheit"       />
        </div>
      </div>

      {/* ── Right: Visual ──────────────────────────────────────────── */}
      <div className="relative z-10 hidden lg:flex items-center justify-center pr-16">
        <div className="relative w-[380px]">
          {/* Back ghost cards */}
          <div className="absolute -bottom-5 -right-5 w-[80%] bg-white/3 border border-white/8 rounded-[2.5rem] h-32 rotate-[4deg] z-0" />
          <div className="absolute -bottom-10 -right-10 w-[65%] bg-white/[0.015] border border-white/5 rounded-[2.5rem] h-24 rotate-[8deg] z-0" />

          {/* Main glass card */}
          <div className="relative z-10">
            <GlassCard />
          </div>

          {/* Floating badges */}
          <FloatingBadge
            icon="⭐"
            title="4.9 / 5"
            subtitle="Bewertung"
            className="-top-4 -right-8 animate-[float-b_7s_ease-in-out_infinite_1s]"
          />
          <FloatingBadge
            icon="🕐"
            title="24 / 7"
            subtitle="Erreichbar"
            className="-bottom-4 -left-10 animate-[float-a_7s_ease-in-out_infinite_3s]"
          />
        </div>
      </div>

      {/* ── Scroll indicator ───────────────────────────────────────── */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/35 z-20">
        <span className="text-[0.72rem] font-bold uppercase tracking-[0.12em]">Mehr entdecken</span>
        <ArrowDown className="w-5 h-5 animate-bounce" />
      </div>
    </section>
  )
}

// ── Icon helpers ──────────────────────────────────────────────────────────────
function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  )
}
function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="10" />
      <path strokeLinecap="round" d="M12 6v6l4 2" />
    </svg>
  )
}
function ArrowDown({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} color="rgba(255,255,255,.35)">
      <path strokeLinecap="round" d="M12 5v14M5 12l7 7 7-7" />
    </svg>
  )
}
