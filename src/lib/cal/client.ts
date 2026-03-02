/**
 * Cal.com API v2 – typed client
 * Docs: https://cal.com/docs/api-reference/v2/introduction
 */
const CAL_BASE = 'https://api.cal.com/v2'
const CAL_KEY  = process.env.CAL_API_KEY ?? ''

function headers(version = '2024-08-13') {
  return {
    'Authorization':   `Bearer ${CAL_KEY}`,
    'Content-Type':    'application/json',
    'cal-api-version': version,
  } as const
}

export interface CalSlot { start: string; end: string; date?: string }

export interface CalAttendee {
  name: string; email: string; timeZone: string; language?: string
}

export interface CreateBookingInput {
  eventTypeId: number; start: string; attendee: CalAttendee
  metadata?: Record<string, string>
  bookingFieldsResponses?: Record<string, string>
}

export interface CalBooking {
  id: number; uid: string; title: string; status: string
  start: string; end: string
  attendees: Array<{ name: string; email: string; timeZone: string }>
  metadata: Record<string, string>
}

export interface CalEventType {
  id: number; title: string; slug: string; length: number
}

// ── API calls ──────────────────────────────────────────────────────────────────

export async function getAvailableSlots({
  eventTypeId, startTime, endTime, timeZone = 'Europe/Berlin',
}: {
  eventTypeId: number
  startTime: string; endTime: string; timeZone?: string
}): Promise<CalSlot[]> {
  const q = new URLSearchParams({
    eventTypeId: String(eventTypeId),
    startTime,
    endTime,
    timeZone,
  })
  const res = await fetch(`${CAL_BASE}/slots/available?${q}`, {
    headers: headers('2024-09-04'),
    next: { revalidate: 60 },
  })
  if (!res.ok) throw new Error(`Cal slots error ${res.status}: ${await res.text()}`)
  const json = await res.json()
  // Cal.com v2: { data: { slots: { "YYYY-MM-DD": [{time: "..."}] } } }
  const slotsMap: Record<string, { time: string }[]> = json.data?.slots ?? {}
  return Object.entries(slotsMap).flatMap(([date, times]) =>
    times.map(s => ({ start: s.time, end: s.time, date }))
  )
}

export async function createBooking(input: CreateBookingInput): Promise<CalBooking> {
  const res = await fetch(`${CAL_BASE}/bookings`, {
    method: 'POST', headers: headers(), body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error(`Cal booking error ${res.status}: ${await res.text()}`)
  return (await res.json()).data
}

export async function cancelBooking(uid: string, reason = 'Cancelled by user') {
  const res = await fetch(`${CAL_BASE}/bookings/${uid}/cancel`, {
    method: 'POST', headers: headers(), body: JSON.stringify({ cancellationReason: reason }),
  })
  if (!res.ok) throw new Error(`Cal cancel error ${res.status}: ${await res.text()}`)
}

export function calLink(slug: string, username?: string) {
  return `${username ?? process.env.NEXT_PUBLIC_CAL_USERNAME ?? 'pflegeplus'}/${slug}`
}