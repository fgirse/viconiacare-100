'use client'

import { useAdminStats } from '@/src/hooks/useAdminData'
import { AdminHeader, KpiCard } from '@/src/components/admin/AdminShell'
import { cn } from '@/src/lib/utils/utils';
import Link from 'next/link'

// ── Mini donut-style status bar ───────────────────────────────────────────────
function StatusBar({ counts }: { counts: Record<string, number> }) {
  const total = Object.values(counts).reduce((a, b) => a + b, 0)
  if (total === 0) return null

  const segments = [
    { key: 'active',     label: 'Aktiv',      color: 'bg-green-500'  },
    { key: 'evaluation', label: 'Evaluation', color: 'bg-orange-500' },
    { key: 'inquiry',    label: 'Anfrage',    color: 'bg-blue-500'   },
    { key: 'paused',     label: 'Pausiert',   color: 'bg-stone-500'  },
    { key: 'inactive',   label: 'Inaktiv',    color: 'bg-red-700'    },
  ]

  return (
    <div>
      {/* Bar */}
      <div className="flex h-2 rounded-full overflow-hidden gap-0.5 mb-4">
        {segments.map(s => {
          const pct = ((counts[s.key] ?? 0) / total) * 100
          if (pct === 0) return null
          return (
            <div
              key={s.key}
              className={cn('h-full rounded-full transition-all', s.color)}
              style={{ width: `${pct}%` }}
            />
          )
        })}
      </div>
      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
        {segments.map(s => (
          <div key={s.key} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={cn('w-2 h-2 rounded-full flex-shrink-0', s.color)} />
              <span className="text-[0.72rem] text-stone-400 font-medium">{s.label}</span>
            </div>
            <span className="text-[0.72rem] font-black text-stone-300">
              {counts[s.key] ?? 0}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Quick link card ───────────────────────────────────────────────────────────
function QuickLink({ href, icon, title, sub }: {
  href: string; icon: string; title: string; sub: string
}) {
  return (
    <Link href={href} className="group block p-4 bg-stone-800/50 hover:bg-stone-800 border border-stone-800 hover:border-teal-700/50 rounded-2xl transition-all">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <p className="text-sm font-bold text-stone-200 group-hover:text-teal-400 transition-colors">{title}</p>
          <p className="text-[0.7rem] text-stone-600">{sub}</p>
        </div>
        <span className="ml-auto text-stone-700 group-hover:text-teal-500 transition-colors text-lg">›</span>
      </div>
    </Link>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AdminOverviewPage() {
  const { data: stats, loading } = useAdminStats()

  const now  = new Date()
  const date = now.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="p-6 lg:p-9 max-w-[1200px]">

      {/* Header */}
      <div className="mb-9">
        <p className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-teal-500 mb-1">Admin</p>
        <AdminHeader
          title="Übersicht"
          subtitle={date}
        />
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[110px] rounded-2xl bg-stone-900 border border-stone-800 animate-pulse" />
          ))
        ) : (
          <>
            <KpiCard
              label="Patienten gesamt"
              value={stats?.totalPatients ?? '—'}
              sub={`${stats?.activePatients ?? 0} aktiv betreut`}
              icon="⬡"
              accent="teal"
              trend="up"
              trendValue="vs. letzten Monat"
            />
            <KpiCard
              label="Neue Anfragen"
              value={stats?.newInquiries ?? '—'}
              sub="Warten auf Bearbeitung"
              icon="◈"
              accent="orange"
            />
            <KpiCard
              label="In Evaluation"
              value={stats?.inEvaluation ?? '—'}
              sub="Bedarfsanalyse läuft"
              icon="◉"
              accent="blue"
            />
            <KpiCard
              label="Aktive Mitarbeiter"
              value={stats?.activeStaff ?? '—'}
              sub={`von ${stats?.totalStaff ?? 0} gesamt`}
              icon="▦"
              accent="green"
            />
          </>
        )}
      </div>

      {/* Two columns */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Status distribution */}
        <div className="lg:col-span-1">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6">
            <p className="text-[0.68rem] font-black uppercase tracking-[0.14em] text-stone-500 mb-4">
              Patientenstatus
            </p>
            {loading ? (
              <div className="space-y-3">
                {[1,2,3].map(i => <div key={i} className="h-4 bg-stone-800 rounded animate-pulse" />)}
              </div>
            ) : (
              <StatusBar counts={stats?.statusCounts ?? {}} />
            )}
          </div>

          {/* Quick actions */}
          <div className="mt-4 bg-stone-900 border border-stone-800 rounded-2xl p-5">
            <p className="text-[0.68rem] font-black uppercase tracking-[0.14em] text-stone-500 mb-3">
              Schnellzugriff
            </p>
            <div className="flex flex-col gap-2">
              <QuickLink href="/de/admin/patients" icon="⬡" title="Patienten" sub="Liste & Details" />
              <QuickLink href="/de/admin/staff"    icon="◉" title="Mitarbeiter" sub="Team verwalten" />
              <QuickLink href="/de/admin/calendar" icon="▦" title="Kalender" sub="Alle Termine" />
            </div>
          </div>
        </div>

        {/* Activity feed / upcoming */}
        <div className="lg:col-span-2">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 h-full">
            <p className="text-[0.68rem] font-black uppercase tracking-[0.14em] text-stone-500 mb-4">
              System-Status
            </p>

            {/* Status grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { label: 'Payload CMS',    status: 'online',  icon: '●' },
                { label: 'MongoDB Atlas',  status: 'online',  icon: '●' },
                { label: 'Cal.com API',    status: 'online',  icon: '●' },
                { label: 'Resend E-Mail',  status: 'online',  icon: '●' },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between px-4 py-3 bg-stone-800/50 rounded-xl border border-stone-800">
                  <span className="text-[0.78rem] text-stone-400 font-medium">{s.label}</span>
                  <span className="flex items-center gap-1.5 text-[0.68rem] font-bold text-green-400">
                    <span className="text-[0.5rem] animate-pulse">●</span> Online
                  </span>
                </div>
              ))}
            </div>

            {/* Environment */}
            <p className="text-[0.68rem] font-black uppercase tracking-[0.14em] text-stone-500 mb-3">
              Umgebung
            </p>
            <div className="space-y-2">
              {[
                { label: 'Next.js',        value: '14.x' },
                { label: 'Payload CMS',    value: '2.x'  },
                { label: 'Node.js',        value: '≥ 18' },
                { label: 'Umgebung',       value: process.env.NODE_ENV ?? 'development' },
              ].map(r => (
                <div key={r.label} className="flex items-center justify-between py-1.5 border-b border-stone-800/40 last:border-0">
                  <span className="text-[0.75rem] text-stone-500">{r.label}</span>
                  <span className="text-[0.75rem] font-bold text-stone-300 font-mono">{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}