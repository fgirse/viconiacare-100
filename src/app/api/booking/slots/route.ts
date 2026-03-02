import { NextRequest, NextResponse } from 'next/server'
import { getAvailableSlots } from '@/src/lib/cal/client'

/**
 * GET /api/booking/slots
 * Query params: eventTypeId (info|eval|visit), start, end, timeZone
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const eventTypeKey = searchParams.get('eventTypeId') ?? 'info'
  const start        = searchParams.get('start') ?? new Date().toISOString()
  const end          = searchParams.get('end')   ?? new Date(Date.now() + 30 * 86400000).toISOString()
  const timeZone     = searchParams.get('timeZone') ?? 'Europe/Berlin'

  // Map booking type key → numeric Cal.com event type ID from env
  const idMap: Record<string, number | undefined> = {
    info:  Number(process.env.CAL_EVENT_TYPE_PHONE)     || undefined,
    eval:  Number(process.env.CAL_EVENT_TYPE_INTERVIEW) || undefined,
    visit: Number(process.env.CAL_EVENT_TYPE_HOMEVISIT) || undefined,
  }

  const eventTypeId = idMap[eventTypeKey]
  if (!eventTypeId) {
    return NextResponse.json({ error: `Unknown eventTypeId: ${eventTypeKey}` }, { status: 400 })
  }

  try {
    const slots = await getAvailableSlots({ eventTypeId, startTime: start, endTime: end, timeZone })
    return NextResponse.json({ success: true, slots })
  } catch (err) {
    console.error('[/api/booking/slots]', err)
    return NextResponse.json({ error: 'Failed to fetch slots' }, { status: 502 })
  }
}
