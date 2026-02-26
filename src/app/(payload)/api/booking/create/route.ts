import { NextRequest, NextResponse } from 'next/server'

const CAL_API_BASE = 'https://api.cal.com/v2'
const CAL_API_KEY  = process.env.CAL_API_KEY ?? ''

/** Map slug → numeric Cal.com event type ID (set in .env) */
const SLUG_TO_EVENT_TYPE_ID: Record<string, number> = {
  phone:     Number(process.env.CAL_EVENT_TYPE_PHONE     ?? 0),
  interview: Number(process.env.CAL_EVENT_TYPE_INTERVIEW ?? 0),
  homevisit: Number(process.env.CAL_EVENT_TYPE_HOMEVISIT ?? 0),
}

/**
 * POST /api/booking/create
 * Body: { eventTypeId, start, attendee: { name, email, timeZone, language? }, notes? }
 */
export async function POST(req: NextRequest) {
  if (!CAL_API_KEY) {
    return NextResponse.json({ error: 'CAL_API_KEY not configured' }, { status: 500 })
  }

  try {
    const body = await req.json()
    const { eventTypeId, start, attendee, notes } = body

    if (!eventTypeId || !start || !attendee?.name || !attendee?.email) {
      return NextResponse.json(
        { error: 'Missing required fields: eventTypeId, start, attendee.name, attendee.email' },
        { status: 400 }
      )
    }

    const numericEventTypeId = SLUG_TO_EVENT_TYPE_ID[eventTypeId] ?? Number(eventTypeId)
    if (!numericEventTypeId) {
      return NextResponse.json(
        { error: `Unknown or unconfigured eventTypeId: "${eventTypeId}". Set CAL_EVENT_TYPE_<SLUG> in .env` },
        { status: 400 }
      )
    }

    const payload = {
      eventTypeId: numericEventTypeId,
      start,
      attendee: {
        name:     attendee.name,
        email:    attendee.email,
        timeZone: attendee.timeZone ?? 'UTC',
        language: attendee.language ?? 'de',
      },
      ...(notes ? { metadata: { notes } } : {}),
    }

    const res = await fetch(`${CAL_API_BASE}/bookings`, {
      method:  'POST',
      headers: {
        Authorization:     `Bearer ${CAL_API_KEY}`,
        'cal-api-version': '2024-08-13',
        'Content-Type':    'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = await res.json()

    if (!res.ok) {
      console.error('[/api/booking/create] Cal.com error:', data)
      return NextResponse.json(
        { error: data?.message ?? 'Cal.com API error' },
        { status: res.status }
      )
    }

    const b = data?.data ?? data
    return NextResponse.json({
      booking: {
        uid:    b.uid,
        title:  b.title,
        start:  b.startTime,
        end:    b.endTime,
        status: b.status,
      },
    })
  } catch (err) {
    console.error('[/api/booking/create] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
