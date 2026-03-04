'use client'

import { useState } from 'react'
import { useAppointments } from '@/src/hooks/usePatientData'
import { Card, Badge, Button, EmptyState } from '@/src/components/ui'
import { cn } from '@/lib/utils'
import dynamic from 'next/dynamic'

// Lazy-load CalWidget so it doesn't block the page
const CalWidget = dynamic(() => import('@/src/components/booking/CalWidget'), {
  loading: () => (
    <div className="flex items-center justify-center py-20">
      <span className="w-8 h-8 rounded-full border-3 border-teal-100 border-t-teal-600 animate-spin" />
    </div>
  ),
})

// ── Types & helpers ───────────────────────────────────────────────────────────
interface Appointment {
  uid: string
  title: string
  startTime: string
  endTime: string
  status: 'accepted' | 'pending' | 'cancelled'
  eventType?: {
    slug: string
  }
  location?: string
}

const EVENT_TYPE_ICONS: Record<string, string> = {
  'info-telefonat': '📞',
  'bedarfsanalyse':  '📋',
  'hausbesuch':      '🏡',
}
const EVENT_TYPE_LABELS: Record<string, string> = {
  'info-telefonat': 'Info-Telefonat',
  'bedarfsanalyse':  'Bedarfsanalyse',
  'hausbesuch':      'Hausbesuch',
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('de-DE', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}
function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
}
function isPast(iso: string) { return new Date(iso) < new Date() }

const STATUS_BADGE: Record<string, { label: string; color: 'green' | 'orange' | 'stone' | 'red' }> = {
  accepted:  { label: '✅ Bestätigt',  color: 'green'  },
  pending:   { label: '⏳ Ausstehend', color: 'orange' },
  cancelled: { label: '❌ Abgesagt',   color: 'red'    },
}

// ── Appointment card ──────────────────────────────────────────────────────────
function AppointmentCard({
  appt,
  onCancel,
}: {
  appt: Appointment
  onCancel: (uid: string) => void
}) {
  const past      = isPast(appt.startTime)
  const slug      = appt.eventType?.slug ?? ''
  const icon      = EVENT_TYPE_ICONS[slug] ?? '📅'
  const typeLabel = EVENT_TYPE_LABELS[slug] ?? appt.title
  const badge     = STATUS_BADGE[appt.status] ?? { label: appt.status, color: 'stone' as const }

  return (
    <Card className={cn('relative overflow-hidden transition-all', past && 'opacity-60')}>
      {/* Top accent */}
      {!past && (
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-teal-500 to-orange-400" />
      )}

      <div className="flex items-start gap-5 mt-1">
        {/* Icon */}
        <div className={cn(
          'w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0',
          past ? 'bg-stone-100' : 'bg-teal-50',
        )}>
          {icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 flex-wrap">
            <p className="font-display text-lg font-bold text-stone-900 flex-1">{typeLabel}</p>
            <Badge color={badge.color}>{badge.label}</Badge>
          </div>
          <p className="text-stone-500 text-sm mt-1">{fmtDate(appt.startTime)}</p>
          <p className="font-bold text-teal-700 text-sm">
            {fmtTime(appt.startTime)} – {fmtTime(appt.endTime)} Uhr
          </p>
          {appt.location && (
            <p className="text-xs text-stone-400 mt-1.5 flex items-center gap-1">
              📍 {appt.location}
            </p>
          )}
          <p className="text-[0.7rem] text-stone-300 mt-1.5 font-mono">
            ID: {appt.uid}
          </p>
        </div>
      </div>

      {/* Actions */}
      {!past && appt.status !== 'cancelled' && (
        <div className="flex gap-3 mt-5 pt-5 border-t border-stone-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCancel(appt.uid)}
          >
            Absagen
          </Button>
          <Button variant="ghost" size="sm">
            Verschieben
          </Button>
        </div>
      )}
    </Card>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
const BOOKING_TYPES = [
  {
    id: 'info', icon: '📞', step: 'Schritt 1', title: 'Info-Telefonat',
    description: 'Stellen Sie Ihre Fragen kostenlos und unverbindlich.', duration: 30,
  },
  {
    id: 'eval', icon: '📋', step: 'Schritt 2', title: 'Bedarfsanalyse',
    description: 'Gemeinsam ermitteln wir Ihren individuellen Pflegebedarf.', duration: 60, highlighted: true,
  },
  {
    id: 'visit', icon: '🏡', step: 'Schritt 3', title: 'Hausbesuch',
    description: 'Wir kommen zu Ihnen für eine persönliche Evaluation.', duration: 90,
  },
]

export default function AppointmentsPage() {
  const { data: appointments, loading, refetch } = useAppointments()
  const [activeBooking, setActiveBooking] = useState<string | null>(null)
  const [,    setCancelling]    = useState<string | null>(null)
  const [cancelError,   setCancelError]   = useState<string | null>(null)

  const allAppts    = (appointments ?? []) as Appointment[]
  const upcoming    = allAppts.filter(a => !isPast(a.startTime) && a.status !== 'cancelled')
  const past        = allAppts.filter(a =>  isPast(a.startTime) || a.status === 'cancelled')

  const handleCancel = async (uid: string) => {
    if (!confirm('Möchten Sie diesen Termin wirklich absagen?')) return
    setCancelling(uid)
    setCancelError(null)
    try {
      const res = await fetch('/api/booking/cancel', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ uid, reason: 'Abgesagt durch Patient im Portal' }),
      })
      if (!res.ok) throw new Error('Stornierung fehlgeschlagen')
      refetch()
    } catch (e) {
      setCancelError(e instanceof Error ? e.message : 'Fehler beim Absagen')
    } finally {
      setCancelling(null)
    }
  }

  return (
    <div className="p-6 lg:p-10 max-w-[960px]">

      {/* Header */}
      <div className="mb-8">
        <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-teal-600 mb-1">
          Mein Bereich
        </p>
        <h1 className="font-display text-[2rem] font-black text-stone-900">Meine Termine</h1>
        <p className="text-stone-400 text-sm mt-1">
          Buchen, verwalten und überblicken Sie Ihre Pflegetermine.
        </p>
      </div>

      {/* ── Book new appointment ─────────────────────────── */}
      <section className="mb-10">
        <h2 className="font-display text-lg font-bold text-stone-700 mb-4">Neuen Termin buchen</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {BOOKING_TYPES.map(bt => (
            <button
              key={bt.id}
              onClick={() => setActiveBooking(activeBooking === bt.id ? null : bt.id)}
              className={cn(
                'text-left p-5 rounded-3xl border-[1.5px] transition-all duration-200',
                bt.highlighted
                  ? activeBooking === bt.id
                    ? 'border-teal-600 bg-teal-600 text-white shadow-brand-md'
                    : 'border-teal-200 bg-teal-50 hover:border-teal-400'
                  : activeBooking === bt.id
                    ? 'border-teal-500 bg-teal-50 shadow-brand-sm'
                    : 'border-stone-200 bg-white hover:border-teal-300 hover:bg-teal-50/40',
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{bt.icon}</span>
                <span className={cn(
                  'text-[0.65rem] font-black uppercase tracking-wider px-2.5 py-1 rounded-full',
                  bt.highlighted
                    ? activeBooking === bt.id ? 'bg-white/20 text-white' : 'bg-teal-600/10 text-teal-700'
                    : 'bg-stone-100 text-stone-500',
                )}>
                  {bt.step}
                </span>
              </div>
              <p className={cn(
                'font-display font-bold text-base mb-1',
                bt.highlighted && activeBooking === bt.id ? 'text-white' : 'text-stone-900',
              )}>
                {bt.title}
              </p>
              <p className={cn(
                'text-xs leading-relaxed',
                bt.highlighted && activeBooking === bt.id ? 'text-white/70' : 'text-stone-400',
              )}>
                {bt.description}
              </p>
              <p className={cn(
                'text-[0.7rem] font-bold mt-3',
                bt.highlighted && activeBooking === bt.id ? 'text-white/60' : 'text-teal-600',
              )}>
                ⏱ {bt.duration} Minuten
              </p>
            </button>
          ))}
        </div>

        {/* CalWidget */}
        {activeBooking && (
          <div className="mt-6 animate-[fadeIn_.35s_ease]">
            <CalWidget
              eventTypeId={activeBooking}
              title={BOOKING_TYPES.find(b => b.id === activeBooking)?.title ?? ''}
              description="Termin buchen"
              onClose={() => { setActiveBooking(null); refetch() }}
            />
          </div>
        )}
      </section>

      {/* ── Upcoming appointments ───────────────────────── */}
      <section className="mb-10">
        <h2 className="font-display text-lg font-bold text-stone-700 mb-4 flex items-center gap-2">
          Bevorstehende Termine
          {upcoming.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-teal-600 text-white text-[0.65rem] font-black flex items-center justify-center">
              {upcoming.length}
            </span>
          )}
        </h2>

        {cancelError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-700 flex gap-2">
            ⚠️ {cancelError}
          </div>
        )}

        {loading ? (
          <div className="grid gap-4">
            {[1, 2].map(i => <div key={i} className="h-36 rounded-3xl bg-stone-100 animate-pulse" />)}
          </div>
        ) : upcoming.length > 0 ? (
          <div className="grid gap-4">
            {upcoming.map(a => (
              <AppointmentCard key={a.uid} appt={a} onCancel={handleCancel} />
            ))}
          </div>
        ) : (
          <Card>
            <EmptyState
              icon="📅"
              title="Keine bevorstehenden Termine"
              description="Buchen Sie oben Ihren nächsten Termin – kostenlos und unverbindlich."
            />
          </Card>
        )}
      </section>

      {/* ── Past appointments ───────────────────────────── */}
      {past.length > 0 && (
        <section>
          <h2 className="font-display text-lg font-bold text-stone-400 mb-4">
            Vergangene Termine
          </h2>
          <div className="grid gap-4">
            {past.slice(0, 5).map(a => (
              <AppointmentCard key={a.uid} appt={a} onCancel={handleCancel} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}