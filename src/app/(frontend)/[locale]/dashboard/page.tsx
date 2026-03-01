'use client'

import { useAuthState } from '@/src/hooks/useAuth'
import { usePatient, useAppointments, useDocuments } from '@/src/hooks/usePatientData'
import type { Document } from '@/src/types'
import { StatCard, Card, Badge, Skeleton, EmptyState, Button } from '@/src/components/ui';
//import { cn } from '@/src/lib/utils/utils'
import Link from 'next/link'

// ── Care level label ──────────────────────────────────────────────────────────
const careLevelLabel = (level?: string) =>
  level === 'none' || !level ? 'Noch nicht beantragt' : `Pflegegrad ${level}`

// ── Status badge ──────────────────────────────────────────────────────────────
const statusConfig: Record<string, { label: string; color: 'teal' | 'orange' | 'green' | 'stone' }> = {
  active:     { label: '✅ Aktiv betreut',  color: 'green'  },
  evaluation: { label: '📋 In Evaluation',  color: 'orange' },
  inquiry:    { label: '🔍 Anfrage',         color: 'stone'  },
  paused:     { label: '⏸️ Pausiert',        color: 'stone'  },
}

// ── Format time ───────────────────────────────────────────────────────────────
function formatApptDate(iso: string) {
  return new Date(iso).toLocaleDateString('de-DE', {
    weekday: 'long', day: 'numeric', month: 'long',
  })
}
function formatApptTime(iso: string) {
  return new Date(iso).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
}

// ── Quick action card ─────────────────────────────────────────────────────────
function QuickAction({ icon, title, desc, href }: {
  icon: string; title: string; desc: string; href: string
}) {
  return (
    <Link href={href}>
      <Card hover padding="sm" className="flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-xl flex-shrink-0">
          {icon}
        </div>
        <div>
          <p className="font-bold text-[0.88rem] text-stone-800">{title}</p>
          <p className="text-[0.75rem] text-stone-400 mt-0.5">{desc}</p>
        </div>
      </Card>
    </Link>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user }    = useAuthState()
  const { data: patient, loading: patientLoading } = usePatient()
  const { data: appointments } = useAppointments()
  const { data: docs } = useDocuments()

  const nextAppt = (appointments ?? []).find(a => a.status !== 'cancelled')
  const docCount = docs?.totalDocs ?? 0
  const status   = patient?.status
  const statusInfo = status ? statusConfig[status] : null

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Guten Morgen'
    if (h < 18) return 'Guten Tag'
    return 'Guten Abend'
  }

  return (
    <div className="p-6 lg:p-10 max-w-[1100px]">

      {/* ── Welcome header ──────────────────────────────────── */}
      <div className="mb-10">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[0.78rem] font-bold uppercase tracking-[0.12em] text-teal-600 mb-1">
              Mein Bereich
            </p>
            <h1 className="font-display text-[clamp(1.8rem,3vw,2.5rem)] font-black text-stone-900 leading-tight">
              {greeting()}, {user?.firstName ?? '…'} 👋
            </h1>
            {statusInfo && (
              <div className="mt-3">
                <Badge color={statusInfo.color}>{statusInfo.label}</Badge>
              </div>
            )}
          </div>
          <Link href="/de/dashboard/appointments">
            <Button variant="primary" size="sm">
              + Termin buchen
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Stat cards ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {patientLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="h-[100px]">
              <Skeleton className="h-4 w-3/4 mb-3" />
              <Skeleton className="h-7 w-1/2" />
            </Card>
          ))
        ) : (
          <>
            <StatCard
              icon="🏥" label="Pflegegrad" color="teal"
              value={careLevelLabel(patient?.careLevel)}
            />
            <StatCard
              icon="📅" label="Nächster Termin" color="orange"
              value={nextAppt ? formatApptDate(nextAppt.startTime).split(',')[0] : '—'}
              sub={nextAppt ? formatApptTime(nextAppt.startTime) + ' Uhr' : 'Kein Termin'}
            />
            <StatCard
              icon="📄" label="Dokumente" color="blue"
              value={docCount}
              sub="Gesamt hochgeladen"
            />
            <StatCard
              icon="👥" label="Mein Team" color="green"
              value={patient?.assignedStaff?.length ?? '—'}
              sub="Pflegekräfte"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Next appointment ─────────────────────────────── */}
        <div className="lg:col-span-2">
          <h2 className="font-display text-lg font-bold text-stone-800 mb-4">Nächster Termin</h2>
          {nextAppt ? (
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-orange-400" />
              <div className="flex items-start gap-5 mt-1">
                <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center text-2xl flex-shrink-0">
                  📅
                </div>
                <div className="flex-1">
                  <p className="font-display text-xl font-bold text-stone-900">{nextAppt.title}</p>
                  <p className="text-stone-500 text-sm mt-1">
                    {formatApptDate(nextAppt.startTime)}
                  </p>
                  <p className="font-bold text-teal-700 text-sm mt-0.5">
                    {formatApptTime(nextAppt.startTime)} – {formatApptTime(nextAppt.endTime)} Uhr
                  </p>
                  {nextAppt.location && (
                    <p className="text-xs text-stone-400 mt-2">📍 {nextAppt.location}</p>
                  )}
                </div>
                <Badge color="green">Bestätigt</Badge>
              </div>
              <div className="mt-5 pt-5 border-t border-stone-100 flex gap-3">
                <Button variant="ghost" size="sm">Absagen</Button>
                <Link href="/de/dashboard/appointments">
                  <Button variant="primary" size="sm">Alle Termine</Button>
                </Link>
              </div>
            </Card>
          ) : (
            <Card>
              <EmptyState
                icon="📅"
                title="Keine Termine geplant"
                description="Buchen Sie Ihr erstes kostenloses Beratungsgespräch."
                action={
                  <Link href="/de/dashboard/appointments">
                    <Button variant="primary" size="sm">Termin buchen</Button>
                  </Link>
                }
              />
            </Card>
          )}

          {/* ── Recent documents ──────────────────────────── */}
          <h2 className="font-display text-lg font-bold text-stone-800 mt-8 mb-4">Zuletzt hochgeladen</h2>
          <Card padding="sm">
            {docCount > 0 ? (
              <div className="divide-y divide-stone-100">
                {(docs?.docs ?? []).slice(0, 4).map((doc: Document) => (
                  <div key={doc.id} className="flex items-center gap-3.5 py-3">
                    <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center text-lg flex-shrink-0">
                      📄
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-stone-800 truncate">{doc.title}</p>
                      <p className="text-xs text-stone-400">
                        {new Date(doc.createdAt).toLocaleDateString('de-DE')}
                      </p>
                    </div>
                    <Badge color="stone">{doc.category}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState icon="📁" title="Noch keine Dokumente" />
            )}
            <div className="mt-3 pt-3 border-t border-stone-100">
              <Link href="/de/dashboard/documents" className="text-sm font-bold text-teal-600 hover:text-teal-700">
                Alle Dokumente →
              </Link>
            </div>
          </Card>
        </div>

        {/* ── Quick actions ────────────────────────────────── */}
        <div>
          <h2 className="font-display text-lg font-bold text-stone-800 mb-4">Schnellzugriff</h2>
          <div className="flex flex-col gap-3">
            <QuickAction icon="📅" title="Termin buchen"     desc="Kostenlos & unverbindlich"  href="/de/dashboard/appointments" />
            <QuickAction icon="📋" title="Pflegeplan"        desc="Ziele & Medikation"         href="/de/dashboard/careplan"     />
            <QuickAction icon="📄" title="Dokumente"         desc="Berichte & Verträge"        href="/de/dashboard/documents"    />
            <QuickAction icon="👤" title="Profil bearbeiten" desc="Kontaktdaten & Einstellungen" href="/de/dashboard/profile"   />
          </div>

          {/* Contact box */}
          <Card className="mt-6 bg-gradient-to-br from-teal-800 to-teal-950 border-0 text-white">
            <p className="font-display text-base font-bold mb-1">Hilfe benötigt?</p>
            <p className="text-sm text-white/60 mb-4 leading-relaxed">
              Unser Team ist werktags von 08–18 Uhr für Sie erreichbar.
            </p>
            <a
              href="tel:+4989123456789"
              className="flex items-center gap-2 text-sm font-bold text-orange-400 hover:text-orange-300 transition-colors"
            >
              📞 +49 89 123 456 789
            </a>
          </Card>
        </div>
      </div>
    </div>
  )
}