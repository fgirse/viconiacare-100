'use client'

import { useState, useMemo } from 'react'
import { cn } from '@/src/lib/utils/utils';
import { useCalSlots } from '@/src/hooks/useCalSlots'
import { useCreateBooking } from '@/src/hooks/useCreateBooking'
import type { CalSlot } from '@/src/lib/cal/client'

// ── Types ─────────────────────────────────────────────────────
interface CalWidgetProps {
  eventTypeId:  string
  title:        string
  description:  string
  onClose:      () => void
}

type Step = 'calendar' | 'form' | 'success' | 'error'

// ── Date/Time helpers ─────────────────────────────────────────
const tz = () => Intl.DateTimeFormat().resolvedOptions().timeZone

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString('de-DE', {
    hour: '2-digit', minute: '2-digit', timeZone: tz(),
  })
}
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('de-DE', {
    weekday: 'long', day: 'numeric', month: 'long', timeZone: tz(),
  })
}

// ── Step indicator ────────────────────────────────────────────
function StepBar({ current }: { current: number }) {
  const steps = ['Datum wählen', 'Ihre Daten', 'Bestätigung']
  return (
    <div className="flex items-center gap-2 px-7 pt-5 pb-1">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <div className={cn(
            'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300',
            i < current  ? 'bg-teal-600 text-white' :
            i === current ? 'bg-teal-600 text-white ring-4 ring-teal-100' :
                            'bg-stone-100 text-stone-400'
          )}>
            {i < current ? '✓' : i + 1}
          </div>
          <span className={cn(
            'text-xs font-bold hidden sm:block transition-colors',
            i === current ? 'text-teal-700' : 'text-stone-400'
          )}>{s}</span>
          {i < 2 && <div className="w-6 h-px bg-stone-200" />}
        </div>
      ))}
    </div>
  )
}

// ── Calendar step ─────────────────────────────────────────────
function CalendarStep({
  eventTypeId,
  onSelect,
}: {
  eventTypeId: string
  onSelect: (slot: CalSlot) => void
}) {
  const { byDate, loading, error, refetch } = useCalSlots({
    eventTypeId,
    timeZone: tz(),
  })
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const availDates = useMemo(() => new Set(Object.keys(byDate)), [byDate])

  const now   = new Date()
  const year  = now.getFullYear()
  const month = now.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  // getDay(): 0=Sun → shift to Mon=0
  const offset = ((new Date(year, month, 1).getDay() + 6) % 7)
  const monthLabel = now.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })

  const dayKey = (d: number) =>
    `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`

  // ── loading
  if (loading) return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="w-10 h-10 rounded-full border-[3px] border-teal-100 border-t-teal-600 animate-spin" />
      <p className="text-sm text-stone-400 font-medium">Verfügbare Termine werden geladen…</p>
    </div>
  )

  // ── error
  if (error) return (
    <div className="py-10 text-center">
      <p className="text-2xl mb-3">⚠️</p>
      <p className="text-sm font-bold text-red-600 mb-1">Termine konnten nicht geladen werden.</p>
      <p className="text-xs text-stone-400 mb-4">{error}</p>
      <button
        onClick={refetch}
        className="px-5 py-2 rounded-full bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition-colors"
      >
        Erneut versuchen
      </button>
    </div>
  )

  return (
    <div className="animate-[fadeIn_.35s_ease]">
      <p className="font-bold text-sm text-teal-900 capitalize mb-4">🗓 {monthLabel}</p>

      {/* Day-name header */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {['Mo','Di','Mi','Do','Fr','Sa','So'].map(d => (
          <div key={d} className="text-center text-[0.68rem] font-bold text-stone-400 py-1">{d}</div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1 mb-6">
        {Array.from({ length: offset }).map((_, i) => <div key={`o${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
          const key   = dayKey(day)
          const avail = availDates.has(key)
          const past  = new Date(key) < new Date(new Date().toDateString())
          const sel   = selectedDate === key
          return (
            <button
              key={day}
              disabled={!avail || past}
              onClick={() => setSelectedDate(sel ? null : key)}
              className={cn(
                'aspect-square rounded-xl flex items-center justify-center text-[0.78rem] font-bold transition-all duration-150',
                (past || !avail) && 'text-stone-200 cursor-default',
                avail && !past && !sel && 'bg-teal-50 text-teal-700 hover:bg-teal-600 hover:text-white hover:scale-105',
                sel && 'bg-teal-600 text-white scale-105 shadow-brand-sm',
              )}
            >
              {day}
            </button>
          )
        })}
      </div>

      {/* Time slots */}
      {selectedDate && (
        <div className="animate-[fadeIn_.25s_ease]">
          <p className="text-sm font-bold text-teal-900 mb-3">
            ⏱ {fmtDate(selectedDate + 'T12:00:00')}
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {(byDate[selectedDate] ?? []).map(slot => (
              <button
                key={slot.start}
                onClick={() => onSelect(slot)}
                className="py-2.5 rounded-xl text-[0.82rem] font-bold bg-teal-50 text-teal-700 hover:bg-teal-600 hover:text-white hover:scale-105 transition-all duration-150"
              >
                {fmtTime(slot.start)}
              </button>
            ))}
          </div>
        </div>
      )}

      {availDates.size === 0 && !loading && (
        <p className="text-center text-sm text-stone-400 py-6">
          Keine verfügbaren Termine in diesem Monat.
        </p>
      )}
    </div>
  )
}

// ── Attendee form ─────────────────────────────────────────────
interface FormData { name: string; email: string; phone: string; notes: string }

function AttendeeForm({
  slot, onSubmit, onBack, loading, error,
}: {
  slot:     CalSlot
  onSubmit: (d: FormData) => void
  onBack:   () => void
  loading:  boolean
  error:    string | null
}) {
  const [form, setForm]       = useState<FormData>({ name: '', email: '', phone: '', notes: '' })
  const [touched, setTouched] = useState<Record<string,boolean>>({})

  const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))
  const blur = (k: string) => () => setTouched(t => ({ ...t, [k]: true }))

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
  const nameOk  = form.name.trim().length >= 2
  const valid   = nameOk && emailOk

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({ name: true, email: true })
    if (valid) onSubmit(form)
  }

  const inputBase = 'w-full rounded-xl border px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent'
  const err       = (k: string, msg: string) => touched[k] && msg

  return (
    <form onSubmit={submit} className="animate-[fadeIn_.3s_ease]">
      {/* Slot summary */}
      <div className="bg-gradient-to-br from-teal-50 to-teal-100/60 border border-teal-200 rounded-2xl p-4 mb-6">
        <p className="text-[0.7rem] font-bold uppercase tracking-wider text-teal-600 mb-1">Ihr gewählter Termin</p>
        <p className="font-bold text-teal-900">{fmtDate(slot.start)}</p>
        <p className="text-sm font-bold text-teal-700">{fmtTime(slot.start)} – {fmtTime(slot.end)} Uhr</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {/* Name */}
        <div className="sm:col-span-2">
          <label className="block text-[0.72rem] font-bold text-stone-500 uppercase tracking-wider mb-1.5">Ihr Name *</label>
          <input
            type="text" value={form.name} onChange={set('name')} onBlur={blur('name')}
            placeholder="Vorname Nachname"
            className={cn(inputBase, touched.name && !nameOk ? 'border-red-300 bg-red-50' : 'border-stone-200 bg-white')}
          />
          {err('name', !nameOk ? 'Bitte geben Sie Ihren Namen ein (min. 2 Zeichen).' : '') && (
            <p className="text-xs text-red-500 mt-1">Bitte geben Sie Ihren Namen ein (min. 2 Zeichen).</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-[0.72rem] font-bold text-stone-500 uppercase tracking-wider mb-1.5">E-Mail *</label>
          <input
            type="email" value={form.email} onChange={set('email')} onBlur={blur('email')}
            placeholder="ihre@email.de"
            className={cn(inputBase, touched.email && !emailOk ? 'border-red-300 bg-red-50' : 'border-stone-200 bg-white')}
          />
          {err('email', !emailOk ? 'Ungültige E-Mail-Adresse.' : '') && (
            <p className="text-xs text-red-500 mt-1">Ungültige E-Mail-Adresse.</p>
          )}
        </div>

        {/* Phone (optional) */}
        <div>
          <label className="block text-[0.72rem] font-bold text-stone-500 uppercase tracking-wider mb-1.5">Telefon</label>
          <input
            type="tel" value={form.phone} onChange={set('phone')}
            placeholder="+49 89 …"
            className={cn(inputBase, 'border-stone-200 bg-white')}
          />
        </div>

        {/* Notes */}
        <div className="sm:col-span-2">
          <label className="block text-[0.72rem] font-bold text-stone-500 uppercase tracking-wider mb-1.5">Anmerkungen</label>
          <textarea
            value={form.notes} onChange={set('notes')}
            placeholder="Besondere Situation, Fragen, Pflegegrad …"
            rows={3}
            className={cn(inputBase, 'border-stone-200 bg-white resize-none')}
          />
        </div>
      </div>

      {/* API error */}
      {error && (
        <div className="flex gap-2 p-3.5 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-600 mb-4">
          <span>⚠️</span><span>{error}</span>
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button" onClick={onBack}
          className="flex-1 py-3.5 rounded-full border-2 border-stone-200 text-stone-600 font-bold text-sm hover:border-stone-300 transition-colors"
        >
          ← Zurück
        </button>
        <button
          type="submit" disabled={loading}
          className={cn(
            'flex-[2] flex items-center justify-center gap-2 py-3.5 rounded-full font-bold text-sm uppercase tracking-wider text-white transition-all duration-200',
            loading ? 'bg-teal-400 cursor-wait' : 'bg-gradient-to-r from-teal-600 to-teal-700 shadow-brand-sm hover:-translate-y-0.5 hover:shadow-brand-md',
          )}
        >
          {loading ? (
            <><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Wird gebucht…</>
          ) : '✓ Termin verbindlich buchen'}
        </button>
      </div>
      <p className="text-center text-xs text-stone-400 mt-4">
        Kostenlose Stornierung bis 24 Stunden vorher · Bestätigung per E-Mail
      </p>
    </form>
  )
}

// ── Success state ─────────────────────────────────────────────
function SuccessState({ result, onClose }: { result: NonNullable<ReturnType<typeof useCreateBooking>['result']>; onClose: () => void }) {
  return (
    <div className="text-center py-8 animate-[fadeIn_.4s_ease]">
      <div className="relative w-24 h-24 mx-auto mb-6">
        <div className="absolute inset-0 rounded-full bg-teal-100 animate-ping opacity-40" />
        <div className="relative w-24 h-24 rounded-full bg-teal-100 flex items-center justify-center text-5xl">✅</div>
      </div>
      <h3 className="font-display text-2xl font-bold text-teal-900 mb-2">Termin bestätigt!</h3>
      <p className="text-stone-500 text-sm max-w-xs mx-auto mb-6">
        Wir freuen uns auf das Gespräch. Bitte prüfen Sie Ihr E-Mail-Postfach.
      </p>
      <div className="bg-gradient-to-br from-teal-50 to-teal-100/60 border border-teal-200 rounded-2xl p-5 text-left max-w-sm mx-auto mb-7">
        <p className="text-[0.7rem] font-bold text-teal-600 uppercase tracking-wider mb-2">Ihre Buchungsdetails</p>
        <p className="font-bold text-teal-900 mb-0.5">{result.title}</p>
        <p className="text-sm text-teal-700">
          {new Date(result.start).toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}
          {' · '}
          {new Date(result.start).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr
        </p>
        <p className="text-[0.72rem] text-stone-400 mt-2 font-mono break-all">Buchungs-ID: {result.uid}</p>
      </div>
      <button
        onClick={onClose}
        className="px-8 py-3 rounded-full bg-teal-600 text-white font-bold text-sm uppercase tracking-wider hover:bg-teal-700 transition-colors"
      >
        Schließen
      </button>
    </div>
  )
}

// ── Error state ───────────────────────────────────────────────
function ErrorState({ error, onRetry, onClose }: { error: string | null; onRetry: () => void; onClose: () => void }) {
  return (
    <div className="text-center py-8 animate-[fadeIn_.3s_ease]">
      <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-red-100 flex items-center justify-center text-4xl">❌</div>
      <h3 className="font-display text-xl font-bold text-red-800 mb-2">Buchung fehlgeschlagen</h3>
      <p className="text-stone-500 text-sm mb-6 max-w-xs mx-auto">
        {error ?? 'Ein unbekannter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.'}
      </p>
      <div className="flex gap-3 justify-center">
        <button onClick={onRetry} className="px-6 py-3 rounded-full bg-teal-600 text-white font-bold text-sm hover:bg-teal-700 transition-colors">
          Erneut versuchen
        </button>
        <button onClick={onClose} className="px-6 py-3 rounded-full border-2 border-stone-200 text-stone-600 font-bold text-sm hover:border-stone-300 transition-colors">
          Abbrechen
        </button>
      </div>
    </div>
  )
}

// ── Main CalWidget ────────────────────────────────────────────
export default function CalWidget({ eventTypeId, title, description, onClose }: CalWidgetProps) {
  const [step,         setStep]         = useState<Step>('calendar')
  const [selectedSlot, setSelectedSlot] = useState<CalSlot | null>(null)
  const { createBooking, loading, error, result, reset } = useCreateBooking()

  const handleSlotSelect = (slot: CalSlot) => {
    setSelectedSlot(slot)
    setStep('form')
  }

  const handleFormSubmit = async (formData: { name: string; email: string; phone: string; notes: string }) => {
    if (!selectedSlot) return
    const booking = await createBooking({
      eventTypeId,
      start:           selectedSlot.start,
      appointmentType: eventTypeId as 'info' | 'eval' | 'visit',
      attendee: {
        name:     formData.name,
        email:    formData.email,
        timeZone: tz(),
        language: 'de',
      },
      notes: formData.notes || undefined,
    })
    setStep(booking ? 'success' : 'error')
  }

  const handleRetry = () => {
    reset()
    setSelectedSlot(null)
    setStep('calendar')
  }

  const stepIdx = step === 'calendar' ? 0 : step === 'form' ? 1 : 2

  return (
    <div className="bg-white border-[1.5px] border-stone-100 rounded-[2rem] overflow-hidden shadow-brand-sm">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-7 py-5 border-b border-stone-100 bg-gradient-to-r from-stone-50/60 to-white">
        <div>
          <div className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-teal-600 mb-1">{description}</div>
          <div className="font-display text-[1.35rem] font-bold text-teal-950 leading-tight">{title}</div>
        </div>
        <button
          onClick={onClose} aria-label="Schließen"
          className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 text-lg hover:bg-stone-200 hover:text-stone-700 transition-colors"
        >✕</button>
      </div>

      {/* ── Step bar (only during booking flow) ── */}
      {(step === 'calendar' || step === 'form') && <StepBar current={stepIdx} />}

      {/* ── Content ── */}
      <div className="p-7">
        {step === 'calendar' && (
          <CalendarStep eventTypeId={eventTypeId} onSelect={handleSlotSelect} />
        )}
        {step === 'form' && selectedSlot && (
          <AttendeeForm
            slot={selectedSlot}
            onSubmit={handleFormSubmit}
            onBack={() => { setStep('calendar'); setSelectedSlot(null) }}
            loading={loading}
            error={error}
          />
        )}
        {step === 'success' && result && (
          <SuccessState result={result} onClose={onClose} />
        )}
        {step === 'error' && (
          <ErrorState error={error} onRetry={handleRetry} onClose={onClose} />
        )}
      </div>
    </div>
  )
}