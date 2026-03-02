import { NextRequest, NextResponse } from 'next/server'
import { getAvailableSlots } from '@/src/lib/cal/client'

/**
 * GET /api/booking/slots
 * Query params: eventTypeId (info|eval|visit), start, end, timeZone
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const eventTypeId = searchParams.get('eventTypeId') ?? 'info'
  const start       = searchParams.get('start') ?? new Date().toISOString()
  const end         = searchParams.get('end')   ?? new Date(Date.now() + 14 * 86400000).toISOString()
  const timeZone    = searchParams.get('timeZone') ?? 'Europe/Berlin'
  const username    = process.env.NEXT_PUBLIC_CAL_USERNAME ?? 'pflegeplus'

  // Map eventTypeId to Cal slug
  const slugMap: Record<string, string> = {
    info:  process.env.NEXT_PUBLIC_CAL_EVENT_INFO  ?? 'info-telefonat',
    eval:  process.env.NEXT_PUBLIC_CAL_EVENT_EVAL  ?? 'bedarfsanalyse',
    visit: process.env.NEXT_PUBLIC_CAL_EVENT_VISIT ?? 'hausbesuch',
  }
  const eventTypeSlug = slugMap[eventTypeId] ?? eventTypeId

  try {
    const slots = await getAvailableSlots({ eventTypeSlug, username, start, end, timeZone })
    return NextResponse.json({ success: true, data: slots })
  } catch (err) {
    console.error('[/api/booking/slots]', err)
    return NextResponse.json({ error: 'Failed to fetch slots' }, { status: 502 })
  }
}
