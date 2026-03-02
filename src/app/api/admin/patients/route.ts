import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/src/lib/auth/session'

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req)
  if (!session || !['admin', 'superadmin', 'editor'].includes(session.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { searchParams } = req.nextUrl
  const page     = searchParams.get('page')     ?? '1'
  const limit    = searchParams.get('limit')    ?? '20'
  const status   = searchParams.get('status')   ?? ''
  const search   = searchParams.get('search')   ?? ''
  const careLevel = searchParams.get('careLevel') ?? ''
  const sort     = searchParams.get('sort')     ?? '-createdAt'

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const params  = new URLSearchParams({ depth: '1', limit, page, sort })

  if (status)    params.set('where[status][equals]', status)
  if (careLevel) params.set('where[careLevel][equals]', careLevel)
  if (search) {
    // Search by last name (Payload doesn't support full-text easily; use contains)
    params.set('where[lastName][contains]', search)
  }

  try {
    const res  = await fetch(`${siteUrl}/api/patients?${params}`, {
      headers: { Authorization: `users API-Key ${process.env.PAYLOAD_SECRET}` },
      next: { revalidate: 30 },
    })
    if (!res.ok) throw new Error(`Payload ${res.status}`)
    const data = await res.json()
    return NextResponse.json({ success: true, ...data })
  } catch (err) {
    console.error('[/api/admin/patients]', err)
    return NextResponse.json({ error: 'Failed to fetch patients' }, { status: 502 })
  }
}
