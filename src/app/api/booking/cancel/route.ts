import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { cancelBooking } from '@/src/lib/cal/client';
import { getSessionFromRequest } from '@/src/lib/auth/session'

const Schema = z.object({
  uid:    z.string().min(1),
  reason: z.string().optional(),
})

/** POST /api/booking/cancel */
export async function POST(req: NextRequest) {
  // Auth check – must be logged in
  const session = await getSessionFromRequest(req)
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = Schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'uid is required' }, { status: 422 })
  }

  try {
    await cancelBooking(parsed.data.uid, parsed.data.reason ?? 'Cancelled via portal')
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[/api/booking/cancel]', err)
    return NextResponse.json({ error: 'Cancellation failed' }, { status: 502 })
  }
}
