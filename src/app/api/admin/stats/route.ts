import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/src/lib/auth/session'

const CAL_KEY = process.env.CAL_API_KEY ?? ''

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req)
  if (!session || !['admin', 'superadmin', 'editor'].includes(session.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { searchParams } = req.nextUrl
  const startDate = searchParams.get('start') ?? new Date().toISOString()
  const endDate   = searchParams.get('end')   ?? new Date(Date.now() + 30 * 86400000).toISOString()

  try {
    // Fetch all bookings in date range from Cal.com v2
    const params = new URLSearchParams({
      afterStart:   startDate,
      beforeStart:  endDate,
      limit:        '100',
    })

    const res = await fetch(`https://api.cal.com/v2/bookings?${params}`, {
      headers: {
        Authorization:     `Bearer ${CAL_KEY}`,
        'cal-api-version': '2024-08-13',
      },
      next: { revalidate: 60 },
    })

    if (!res.ok) throw new Error(`Cal.com ${res.status}`)
    const data = await res.json()

    return NextResponse.json({
      success: true,
      data:    data.data ?? [],
      total:   data.data?.length ?? 0,
    })
  } catch (err) {
    console.error('[/api/admin/calendar]', err)
    // Return empty so UI degrades gracefully
    return NextResponse.json({ success: true, data: [], total: 0 })
  }
}
