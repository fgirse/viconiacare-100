'use client'

import { useState, useMemo } from 'react'
import { useAdminCalendar } from '@/src/hooks/useAdminData'
import { AdminHeader } from '@/src/components/admin/AdminShell'
import { cn } from '@/src/lib/utils/utils'

// ── Types ────────────────────────────────────────────────────────────────────
interface Attendee {
  name?: string
  email?: string
  timeZone?: string
}

interface BookingEventType {
  slug?: string
}

interface Booking {
  uid: string
  title: string
  startTime: string
  endTime: string
  status: 'accepted' | 'cancelled' | 'pending' | string
  eventType?: BookingEventType
  attendees?: Attendee[]
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const WEEKDAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
const MONTHS   = ['Januar','Februar','März','April','Mai','Juni',
                  'Juli','August','September','Oktober','November','Dezember']

const EVENT_COLORS: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  'info-telefonat': { bg: 'bg-blue-500/15',   border: 'border-blue-500/30',   text: 'text-blue-300',   dot: 'bg-blue-500'   },
  'bedarfsanalyse': { bg: 'bg-teal-500/15',   border: 'border-teal-500/30',   text: 'text-teal-300',   dot: 'bg-teal-500'   },
  'hausbesuch':     { bg: 'bg-orange-500/15', border: 'border-orange-500/30', text: 'text-orange-300', dot: 'bg-orange-500' },
  'default':        { bg: 'bg-stone-700/30',  border: 'border-stone-600/30',  text: 'text-stone-400',  dot: 'bg-stone-500'  },
}

const EVENT_TYPE_LABELS: Record<string, string> = {
  'info-telefonat': 'Info-Telefonat',
  'bedarfsanalyse': 'Bedarfsanalyse',
  'hausbesuch':     'Hausbesuch',
}

function getEventColor(slug?: string) {
  return EVENT_COLORS[slug ?? ''] ?? EVENT_COLORS.default
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
}

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10)
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  const d = new Date(year, month, 1).getDay()
  return d === 0 ? 6 : d - 1  // Mon=0 … Sun=6
}

// ── Event pill (calendar cell) ────────────────────────────────────────────────
function EventPill({ booking, onClick }: { booking: Booking; onClick: () => void }) {
  const slug  = booking.eventType?.slug
  const color = getEventColor(slug)
  return (
    <button
      onClick={e => { e.stopPropagation(); onClick() }}
      className={cn(
        'w-full text-left px-1.5 py-0.5 rounded text-[0.6rem] font-bold truncate mb-0.5',
        'border transition-all hover:brightness-125',
        color.bg, color.border, color.text,
      )}
    >
      {fmtTime(booking.startTime)} {booking.attendees?.[0]?.name?.split(' ')[0] ?? booking.title}
    </button>
  )
}

// ── Booking detail popup ──────────────────────────────────────────────────────
function BookingPopup({ booking, onClose }: { booking: Booking; onClose: () => void }) {
  const slug   = booking.eventType?.slug
  const color  = getEventColor(slug)
  const attendee = booking.attendees?.[0] ?? {}

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
        <div className={cn(
          'w-full max-w-sm bg-stone-950 border rounded-2xl p-6 pointer-events-auto shadow-2xl',
          color.border,
        )}>
          {/* Type badge */}
          <div className="flex items-center justify-between mb-4">
            <span className={cn(
              'px-2.5 py-1 rounded-full text-[0.68rem] font-bold border',
              color.bg, color.border, color.text,
            )}>
            <span className={cn('inline-block w-1.5 h-1.5 rounded-full mr-1.5', color.dot)} />
              {EVENT_TYPE_LABELS[slug ?? ''] ?? booking.title}
            </span>
            <button onClick={onClose} className="text-stone-600 hover:text-stone-300">✕</button>
          </div>

          {/* Date/Time */}
          <div className="mb-5">
            <p className="font-display font-black text-white text-base">
              {new Date(booking.startTime).toLocaleDateString('de-DE', {
                weekday: 'long', day: 'numeric', month: 'long',
              })}
            </p>
            <p className={cn('font-bold mt-0.5', color.text)}>
              {fmtTime(booking.startTime)} – {fmtTime(booking.endTime)} Uhr
            </p>
          </div>

          {/* Attendee */}
          <div className="bg-stone-900 rounded-xl p-4 border border-stone-800 mb-4">
            <p className="text-[0.65rem] font-black uppercase tracking-wider text-stone-600 mb-2">Patient</p>
            <p className="font-bold text-stone-200 text-sm">{attendee.name ?? '—'}</p>
            {attendee.email && <p className="text-stone-500 text-xs mt-0.5">{attendee.email}</p>}
            {attendee.timeZone && <p className="text-stone-700 text-xs mt-0.5">{attendee.timeZone}</p>}
          </div>

          {/* Status */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-stone-600">Buchungs-ID</span>
            <span className="font-mono text-stone-500 truncate ml-2 max-w-[180px]">{booking.uid}</span>
          </div>
          <div className="flex items-center justify-between text-xs mt-2">
            <span className="text-stone-600">Status</span>
            <span className={cn(
              'font-bold',
              booking.status === 'accepted'  ? 'text-green-400' :
              booking.status === 'cancelled' ? 'text-red-400'   : 'text-yellow-400',
            )}>
              {booking.status === 'accepted' ? 'Bestätigt' : booking.status === 'cancelled' ? 'Abgesagt' : 'Ausstehend'}
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

// ── Week view ─────────────────────────────────────────────────────────────────
function WeekView({ weekStart, bookings, onSelect }: {
  weekStart: Date
  bookings: Booking[]
  onSelect: (b: Booking) => void
}) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + i)
    return d
  })

  const today = isoDate(new Date())

  return (
    <div className="grid grid-cols-7 gap-px bg-stone-800 rounded-xl overflow-hidden">
      {days.map(day => {
        const ds   = isoDate(day)
        const isToday = ds === today
        const dayBookings = bookings.filter(b => isoDate(new Date(b.startTime)) === ds)
        return (
          <div key={ds} className="bg-stone-900 min-h-[160px]">
            {/* Header */}
            <div className={cn(
              'px-2 py-2 text-center border-b border-stone-800',
              isToday && 'bg-teal-500/10',
            )}>
              <p className="text-[0.6rem] font-bold uppercase text-stone-600">
                {WEEKDAYS[days.indexOf(day)]}
              </p>
              <p className={cn(
                'text-base font-black leading-none mt-0.5',
                isToday ? 'text-teal-400' : 'text-stone-400',
              )}>
                {day.getDate()}
              </p>
            </div>
            {/* Events */}
            <div className="p-1.5">
              {dayBookings.map(b => (
                <EventPill key={b.uid} booking={b} onClick={() => onSelect(b)} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Month view ────────────────────────────────────────────────────────────────
function MonthView({ year, month, bookings, onSelect, onDayClick }: {
  year: number; month: number
  bookings: Booking[]
  onSelect: (b: Booking) => void
  onDayClick: (d: Date) => void
}) {
  const daysInMonth  = getDaysInMonth(year, month)
  const firstDayOffs = getFirstDayOfMonth(year, month)
  const today        = isoDate(new Date())

  // Build 6-week grid
  const cells: Array<{ date: Date | null; dayNum: number | null }> = []
  for (let i = 0; i < firstDayOffs; i++) cells.push({ date: null, dayNum: null })
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: new Date(year, month, d), dayNum: d })
  }
  while (cells.length % 7 !== 0) cells.push({ date: null, dayNum: null })

  return (
    <div>
      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map(d => (
          <div key={d} className="text-center text-[0.62rem] font-black uppercase tracking-wider text-stone-600 py-2">
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-px bg-stone-800 rounded-xl overflow-hidden">
        {cells.map((cell, idx) => {
          if (!cell.date) {
            return <div key={idx} className="bg-stone-900/50 min-h-[80px]" />
          }
          const ds  = isoDate(cell.date)
          const isToday = ds === today
          const dayBookings = bookings.filter(b => isoDate(new Date(b.startTime)) === ds)

          return (
            <div
              key={ds}
              onClick={() => onDayClick(cell.date!)}
              className={cn(
                'bg-stone-900 min-h-[80px] p-1.5 cursor-pointer transition-colors',
                'hover:bg-stone-800/70',
                isToday && 'ring-1 ring-inset ring-teal-500/40',
              )}
            >
              <div className={cn(
                'w-6 h-6 rounded-full flex items-center justify-center text-xs font-black mb-1',
                isToday
                  ? 'bg-teal-500 text-white'
                  : 'text-stone-500 hover:text-stone-300',
              )}>
                {cell.dayNum}
              </div>
              {dayBookings.slice(0, 2).map(b => (
                <EventPill key={b.uid} booking={b} onClick={() => onSelect(b)} />
              ))}
              {dayBookings.length > 2 && (
                <p className="text-[0.58rem] text-stone-600 font-bold px-1">
                  +{dayBookings.length - 2} mehr
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
type ViewMode = 'month' | 'week'

export default function AdminCalendarPage() {
  const [view,     setView]     = useState<ViewMode>('month')
  const [current,  setCurrent]  = useState(new Date())
  const [selected, setSelected] = useState<Booking | null>(null)

  // Date window for API
  const rangeStart = useMemo(() => {
    const d = new Date(current.getFullYear(), current.getMonth(), 1)
    d.setDate(d.getDate() - 7)
    return d.toISOString()
  }, [current])

  const rangeEnd = useMemo(() => {
    const d = new Date(current.getFullYear(), current.getMonth() + 2, 7)
    return d.toISOString()
  }, [current])

  const { data: bookings, loading } = useAdminCalendar(rangeStart, rangeEnd)
  const allBookings = (bookings ?? []) as unknown as Booking[]

  // Week start (Mon)
  const weekStart = useMemo(() => {
    const d   = new Date(current)
    const day = d.getDay()
    d.setDate(d.getDate() - (day === 0 ? 6 : day - 1))
    return d
  }, [current])

  // Navigation
  const prev = () => {
    if (view === 'month') setCurrent(new Date(current.getFullYear(), current.getMonth() - 1, 1))
    else { const d = new Date(current); d.setDate(d.getDate() - 7); setCurrent(d) }
  }
  const next = () => {
    if (view === 'month') setCurrent(new Date(current.getFullYear(), current.getMonth() + 1, 1))
    else { const d = new Date(current); d.setDate(d.getDate() + 7); setCurrent(d) }
  }
  const goToday = () => setCurrent(new Date())

  // Month label
  const monthLabel = view === 'month'
    ? `${MONTHS[current.getMonth()]} ${current.getFullYear()}`
    : (() => {
        const ws = weekStart
        const we = new Date(ws); we.setDate(we.getDate() + 6)
        return `${ws.getDate()}. – ${we.getDate()}. ${MONTHS[we.getMonth()]} ${we.getFullYear()}`
      })()

  // Sidebar bookings (current month or week)
  const sidebarBookings = allBookings
    .filter(b => {
      const d = new Date(b.startTime)
      if (view === 'month')
        return d.getMonth() === current.getMonth() && d.getFullYear() === current.getFullYear()
      const ws = weekStart.getTime()
      const we = ws + 7 * 86400000
      return d.getTime() >= ws && d.getTime() < we
    })
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())

  const typeCounts = allBookings.reduce((acc: Record<string, number>, b: Booking) => {
    const slug = b.eventType?.slug ?? 'other'
    acc[slug] = (acc[slug] ?? 0) + 1
    return acc
  }, {})

  return (
    <>
      <div className="p-6 lg:p-9">
        <p className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-teal-500 mb-1">Admin</p>
        <AdminHeader title="Kalender" subtitle="Alle Buchungen im Überblick">
          {/* View toggle */}
          <div className="flex bg-stone-800 rounded-xl p-1 gap-1">
            {(['month', 'week'] as ViewMode[]).map(v => (
              <button key={v} onClick={() => setView(v)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-bold transition-all',
                  view === v ? 'bg-teal-600 text-white' : 'text-stone-500 hover:text-stone-300',
                )}>
                {v === 'month' ? '▦ Monat' : '≡ Woche'}
              </button>
            ))}
          </div>
        </AdminHeader>

        <div className="flex gap-6">

          {/* ── Main calendar area ────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Nav bar */}
            <div className="flex items-center gap-3 mb-5">
              <button onClick={prev}    className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition-all font-bold">‹</button>
              <button onClick={next}    className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition-all font-bold">›</button>
              <h2 className="font-display font-black text-white text-lg flex-1">{monthLabel}</h2>
              <button
                onClick={goToday}
                className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-teal-400 text-xs font-bold uppercase tracking-wide transition-all"
              >
                Heute
              </button>
              {loading && (
                <span className="w-4 h-4 rounded-full border-2 border-stone-700 border-t-teal-500 animate-spin" />
              )}
            </div>

            {/* Calendar */}
            {view === 'month' ? (
              <MonthView
                year={current.getFullYear()}
                month={current.getMonth()}
                bookings={allBookings}
                onSelect={setSelected}
                onDayClick={d => { setCurrent(d); setView('week') }}
              />
            ) : (
              <WeekView
                weekStart={weekStart}
                bookings={allBookings}
                onSelect={setSelected}
              />
            )}
          </div>

          {/* ── Sidebar ───────────────────────────────────── */}
          <div className="hidden xl:flex flex-col w-[280px] flex-shrink-0 gap-4">

            {/* Legend */}
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4">
              <p className="text-[0.62rem] font-black uppercase tracking-[0.14em] text-stone-600 mb-3">
                Terminarten
              </p>
              {[
                { slug: 'info-telefonat', label: 'Info-Telefonat'  },
                { slug: 'bedarfsanalyse', label: 'Bedarfsanalyse'  },
                { slug: 'hausbesuch',     label: 'Hausbesuch'       },
              ].map(t => {
                const c = getEventColor(t.slug)
                return (
                  <div key={t.slug} className="flex items-center justify-between py-2 border-b border-stone-800 last:border-0">
                    <div className="flex items-center gap-2">
                      <span className={cn('w-2 h-2 rounded-full', c.dot)} />
                      <span className="text-[0.75rem] text-stone-400">{t.label}</span>
                    </div>
                    <span className="text-[0.75rem] font-black text-stone-300">
                      {typeCounts[t.slug] ?? 0}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Upcoming list */}
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 flex-1 overflow-y-auto max-h-[500px]">
              <p className="text-[0.62rem] font-black uppercase tracking-[0.14em] text-stone-600 mb-3">
                {view === 'month' ? 'Diesen Monat' : 'Diese Woche'} ({sidebarBookings.length})
              </p>
              {sidebarBookings.length === 0 ? (
                <p className="text-stone-700 text-sm text-center py-8">Keine Termine</p>
              ) : (
                <div className="space-y-2">
                  {sidebarBookings.map(b => {
                    const c = getEventColor(b.eventType?.slug)
                    return (
                      <button
                        key={b.uid}
                        onClick={() => setSelected(b)}
                        className={cn(
                          'w-full text-left p-3 rounded-xl border transition-all hover:brightness-110',
                          c.bg, c.border,
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className={cn('text-[0.72rem] font-bold', c.text)}>
                              {EVENT_TYPE_LABELS[b.eventType?.slug ?? ''] ?? b.title}
                            </p>
                            <p className="text-[0.68rem] text-stone-500 mt-0.5">
                              {new Date(b.startTime).toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'short' })}
                              {' · '}{fmtTime(b.startTime)}
                            </p>
                          </div>
                        </div>
                        {b.attendees?.[0]?.name && (
                          <p className="text-[0.68rem] text-stone-600 mt-1.5 truncate">
                            👤 {b.attendees[0].name}
                          </p>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Booking popup */}
      {selected && <BookingPopup booking={selected} onClose={() => setSelected(null)} />}
    </>
  )
}
