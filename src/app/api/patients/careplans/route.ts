import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/src/lib/auth/session'

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const params  = new URLSearchParams({
    'where[patient][equals]': session.patientId ?? session.userId,
    'where[status][equals]':  'active',
    'depth': '2',
    'limit': '1',
    'sort':  '-createdAt',
  })

  try {
    const res = await fetch(`${siteUrl}/api/care-plans?${params}`, {
      headers: { Authorization: `users API-Key ${process.env.PAYLOAD_SECRET}` },
      next: { revalidate: 60 },
    })

    if (!res.ok) throw new Error(`Payload error ${res.status}`)
    const data = await res.json()
    return NextResponse.json({ success: true, data: data.docs?.[0] ?? null })
  } catch (err) {
    console.error('[/api/patients/careplan]', err)
    return NextResponse.json({ error: 'Failed to fetch care plan' }, { status: 502 })
  }
}