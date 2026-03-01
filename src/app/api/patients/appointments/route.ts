 import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/src/lib/auth/session'

const CAL_KEY = process.env.CAL_API_KEY ?? ''

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  try {
    // Fetch bookings from Cal.com filtered by attendee email
    const params = new URLSearchParams({
      attendeeEmail: session.email,
      status:        'upcoming',
      limit:         '10',
    })

    const res = await fetch(`https://api.cal.com/v2/bookings?${params}`, {
      headers: {
        Authorization:   `Bearer ${CAL_KEY}`,
        'cal-api-version': '2024-08-13',
      },
      next: { revalidate: 60 },
    })

    if (!res.ok) throw new Error(`Cal.com error ${res.status}`)
    const data = await res.json()

    return NextResponse.json({ success: true, data: data.data ?? [] })
  } catch (err) {
    console.error('[/api/patients/appointments]', err)
    // Return empty array so UI degrades gracefully
    return NextResponse.json({ success: true, data: [] })
  }
}