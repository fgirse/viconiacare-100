import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/src/lib/auth/session'

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req)
  if (!session || !['admin', 'superadmin', 'editor'].includes(session.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { searchParams } = req.nextUrl
  const page       = searchParams.get('page')     ?? '1'
  const limit      = searchParams.get('limit')    ?? '50'
  const role       = searchParams.get('role')     ?? ''
  const isActive   = searchParams.get('isActive') ?? ''
  const search     = searchParams.get('search')   ?? ''
  const sort       = searchParams.get('sort')     ?? 'lastName'

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const params  = new URLSearchParams({ depth: '1', limit, page, sort })

  if (role)     params.set('where[staffRole][equals]', role)
  if (isActive) params.set('where[isActive][equals]', isActive)
  if (search)   params.set('where[lastName][contains]', search)

  try {
    const res  = await fetch(`${siteUrl}/api/staff?${params}`, {
      headers: { Authorization: `users API-Key ${process.env.PAYLOAD_SECRET}` },
      next: { revalidate: 30 },
    })
    if (!res.ok) throw new Error(`Payload ${res.status}`)
    const data = await res.json()
    return NextResponse.json({ success: true, ...data })
  } catch (err) {
    console.error('[/api/admin/staff]', err)
    return NextResponse.json({ error: 'Failed to fetch staff' }, { status: 502 })
  }
}
