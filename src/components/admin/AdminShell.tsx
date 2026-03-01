'use client'

import { cn } from '@/src/lib/utils/utils'

// ── Page header ───────────────────────────────────────────────────────────────
export function AdminHeader({
  title, subtitle, children,
}: { title: string; subtitle?: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 flex-wrap mb-8">
      <div>
        <h1 className="font-display text-[1.9rem] font-black text-white leading-tight">{title}</h1>
        {subtitle && <p className="text-stone-500 text-sm mt-1">{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </div>
  )
}

// ── KPI card ──────────────────────────────────────────────────────────────────
interface KpiCardProps {
  label:   string
  value:   string | number
  sub?:    string
  icon?:   string
  trend?:  'up' | 'down' | 'neutral'
  trendValue?: string
  accent?: 'teal' | 'orange' | 'green' | 'red' | 'blue'
  className?: string
}
const ACCENT = {
  teal:   { bar: 'from-teal-500 to-teal-400',   icon: 'bg-teal-500/10 text-teal-400'   },
  orange: { bar: 'from-orange-500 to-orange-400', icon: 'bg-orange-500/10 text-orange-400' },
  green:  { bar: 'from-green-500 to-green-400',   icon: 'bg-green-500/10 text-green-400'  },
  red:    { bar: 'from-red-500 to-red-400',       icon: 'bg-red-500/10 text-red-400'      },
  blue:   { bar: 'from-blue-500 to-blue-400',     icon: 'bg-blue-500/10 text-blue-400'    },
}
export function KpiCard({ label, value, sub, icon, trend, trendValue, accent = 'teal', className }: KpiCardProps) {
  const a = ACCENT[accent]
  return (
    <div className={cn(
      'relative bg-stone-900 border border-stone-800 rounded-2xl p-5 overflow-hidden',
      className,
    )}>
      {/* Accent bar */}
      <div className={cn('absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r', a.bar)} />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[0.68rem] font-black uppercase tracking-[0.14em] text-stone-500 mb-2">{label}</p>
          <p className="font-display text-[2.2rem] font-black text-white leading-none">{value}</p>
          {sub && <p className="text-[0.72rem] text-stone-600 mt-1.5">{sub}</p>}
          {trend && trendValue && (
            <p className={cn(
              'text-[0.7rem] font-bold mt-2',
              trend === 'up'   ? 'text-green-400' :
              trend === 'down' ? 'text-red-400'   : 'text-stone-500',
            )}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
            </p>
          )}
        </div>
        {icon && (
          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0', a.icon)}>
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Filter bar ────────────────────────────────────────────────────────────────
interface FilterPillProps {
  label:    string
  active:   boolean
  onClick:  () => void
  count?:   number
}
export function FilterPill({ label, active, onClick, count }: FilterPillProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[0.75rem] font-bold transition-all',
        active
          ? 'bg-teal-500 text-white'
          : 'bg-stone-800 text-stone-400 hover:bg-stone-700 hover:text-stone-200',
      )}
    >
      {label}
      {count !== undefined && (
        <span className={cn(
          'text-[0.65rem] font-black px-1.5 py-0.5 rounded-full',
          active ? 'bg-white/20 text-white' : 'bg-stone-700 text-stone-400',
        )}>
          {count}
        </span>
      )}
    </button>
  )
}

// ── Search input ──────────────────────────────────────────────────────────────
export function AdminSearch({
  value, onChange, placeholder = 'Suchen…',
}: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="relative">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500 text-sm">⌕</span>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-stone-800 border border-stone-700 rounded-xl pl-9 pr-4 py-2.5
                   text-sm text-stone-200 placeholder:text-stone-600
                   focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500
                   transition-all w-full"
      />
    </div>
  )
}

// ── Table primitives ──────────────────────────────────────────────────────────
export function AdminTable({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('overflow-x-auto rounded-2xl border border-stone-800', className)}>
      <table className="w-full text-sm">{children}</table>
    </div>
  )
}
export function Thead({ children }: { children: React.ReactNode }) {
  return (
    <thead className="bg-stone-900 border-b border-stone-800">
      <tr>{children}</tr>
    </thead>
  )
}
export function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={cn(
      'px-5 py-3.5 text-left text-[0.66rem] font-black uppercase tracking-[0.12em] text-stone-500',
      className,
    )}>
      {children}
    </th>
  )
}
export function Tbody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-stone-800/60 bg-stone-900">{children}</tbody>
}
export function Tr({ children, onClick, className }: {
  children: React.ReactNode; onClick?: () => void; className?: string
}) {
  return (
    <tr
      onClick={onClick}
      className={cn(
        'transition-colors',
        onClick ? 'cursor-pointer hover:bg-stone-800/50' : '',
        className,
      )}
    >
      {children}
    </tr>
  )
}
export function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <td className={cn('px-5 py-4 text-stone-300', className)}>
      {children}
    </td>
  )
}

// ── Status badge (dark) ───────────────────────────────────────────────────────
const STATUS_STYLES: Record<string, string> = {
  active:     'bg-green-500/10 text-green-400 border-green-500/20',
  evaluation: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  inquiry:    'bg-blue-500/10 text-blue-400 border-blue-500/20',
  paused:     'bg-stone-500/10 text-stone-400 border-stone-500/20',
  inactive:   'bg-red-500/10 text-red-400 border-red-500/20',
  accepted:   'bg-green-500/10 text-green-400 border-green-500/20',
  pending:    'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  cancelled:  'bg-red-500/10 text-red-400 border-red-500/20',
}
const STATUS_LABELS: Record<string, string> = {
  active:     'Aktiv',
  evaluation: 'Evaluation',
  inquiry:    'Anfrage',
  paused:     'Pausiert',
  inactive:   'Inaktiv',
  accepted:   'Bestätigt',
  pending:    'Ausstehend',
  cancelled:  'Abgesagt',
}
export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded-full border text-[0.68rem] font-bold',
      STATUS_STYLES[status] ?? 'bg-stone-700 text-stone-400 border-stone-600',
    )}>
      {STATUS_LABELS[status] ?? status}
    </span>
  )
}

// ── Skeleton row ──────────────────────────────────────────────────────────────
export function SkeletonRow({ cols = 5 }: { cols?: number }) {
  return (
    <Tr>
      {Array.from({ length: cols }).map((_, i) => (
        <Td key={i}>
          <div className="h-4 rounded bg-stone-800 animate-pulse" style={{ width: `${60 + (i * 13) % 35}%` }} />
        </Td>
      ))}
    </Tr>
  )
}

// ── Empty row ─────────────────────────────────────────────────────────────────
export function EmptyRow({ cols, message }: { cols: number; message: string }) {
  return (
    <tr>
      <td colSpan={cols} className="py-20 text-center text-stone-600 text-sm font-medium">
        {message}
      </td>
    </tr>
  )
}

// ── Pagination ────────────────────────────────────────────────────────────────
export function Pagination({
  page, totalPages, onChange,
}: { page: number; totalPages: number; onChange: (p: number) => void }) {
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-between px-5 py-3 border-t border-stone-800 bg-stone-900 rounded-b-2xl">
      <p className="text-[0.72rem] text-stone-600 font-medium">
        Seite {page} von {totalPages}
      </p>
      <div className="flex gap-1">
        {[
          { label: '«', page: 1,          disabled: page === 1 },
          { label: '‹', page: page - 1,   disabled: page === 1 },
          { label: '›', page: page + 1,   disabled: page >= totalPages },
          { label: '»', page: totalPages, disabled: page >= totalPages },
        ].map(btn => (
          <button
            key={btn.label}
            onClick={() => !btn.disabled && onChange(btn.page)}
            disabled={btn.disabled}
            className={cn(
              'w-8 h-8 rounded-lg text-sm font-bold transition-all',
              btn.disabled
                ? 'text-stone-700 cursor-not-allowed'
                : 'text-stone-400 hover:bg-stone-800 hover:text-teal-400',
            )}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  )
}
