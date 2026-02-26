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
 * GET /api/booking/slots?eventTypeId=interview&start=YYYY-MM-DD&end=YYYY-MM-DD&tz=Europe/Zurich
 *
 * Proxies to Cal.com v2 /slots endpoint, keeping the API key server-side.
 * Cal.com API: GET /v2/slots?eventTypeId=<numeric>&start=YYYY-MM-DD&end=YYYY-MM-DD&timeZone=...
 * Response: { data: { "YYYY-MM-DD": [{ start: "ISO" }] } }
 */
export async function GET(req: NextRequest) {
  if (!CAL_API_KEY) {
    return NextResponse.json({ error: 'CAL_API_KEY not configured' }, { status: 500 })
  }

  const { searchParams } = req.nextUrl
  const eventTypeSlug = searchParams.get('eventTypeId')
  const start         = searchParams.get('start')
  const end           = searchParams.get('end')
  const tz            = searchParams.get('tz') ?? 'UTC'

  if (!eventTypeSlug || !start || !end) {
    return NextResponse.json(
      { error: 'Missing required params: eventTypeId, start, end' },
      { status: 400 }
    )
  }

  const numericEventTypeId = SLUG_TO_EVENT_TYPE_ID[eventTypeSlug] ?? Number(eventTypeSlug)
  if (!numericEventTypeId) {
    return NextResponse.json(
      { error: `Unknown eventTypeId: "${eventTypeSlug}". Set CAL_EVENT_TYPE_<SLUG> in .env` },
      { status: 400 }
    )
  }

  try {
    const params = new URLSearchParams({
      eventTypeId: String(numericEventTypeId),
      start,
      end,
      timeZone: tz,
    })

    const res = await fetch(`${CAL_API_BASE}/slots?${params}`, {
      headers: {
        Authorization:     `Bearer ${CAL_API_KEY}`,
        'cal-api-version': '2024-09-04',
        'Content-Type':    'application/json',
      },
      next: { revalidate: 60 }, // cache for 60s
    })

    const data = await res.json()

    if (!res.ok) {
      console.error('[/api/booking/slots] Cal.com error:', data)
      return NextResponse.json(
        { error: data?.error?.message ?? data?.message ?? 'Cal.com API error' },
        { status: res.status }
      )
    }

    // Cal.com v2 /slots returns { data: { "YYYY-MM-DD": [{ start: "ISO" }] } }
    const rawSlots: Record<string, { start: string }[]> = data?.data ?? {}

    // Flatten to array of { time } objects (keep legacy shape for the hook)
    const slots = Object.values(rawSlots).flat().map(s => ({ time: s.start }))

    return NextResponse.json({ slots })
  } catch (err) {
    console.error('[/api/booking/slots] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
