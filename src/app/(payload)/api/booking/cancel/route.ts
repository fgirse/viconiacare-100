import { NextRequest, NextResponse } from 'next/server'

const CAL_API_BASE = 'https://api.cal.com/v2'
const CAL_API_KEY  = process.env.CAL_API_KEY ?? ''

/**
 * POST /api/booking/cancel
 * Body: { uid, reason? }
 */
export async function POST(req: NextRequest) {
  if (!CAL_API_KEY) {
    return NextResponse.json({ error: 'CAL_API_KEY not configured' }, { status: 500 })
  }

  try {
    const body = await req.json()
    const { uid, reason } = body

    if (!uid) {
      return NextResponse.json({ error: 'Missing required field: uid' }, { status: 400 })
    }

    const res = await fetch(`${CAL_API_BASE}/bookings/${uid}/cancel`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${CAL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cancellationReason: reason ?? 'Cancelled by user' }),
    })

    const data = await res.json()

    if (!res.ok) {
      console.error('[/api/booking/cancel] Cal.com error:', data)
      return NextResponse.json(
        { error: data?.message ?? 'Cal.com API error' },
        { status: res.status }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[/api/booking/cancel] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
