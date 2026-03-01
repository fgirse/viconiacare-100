import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/src/lib/auth/session'

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const { searchParams } = req.nextUrl
  const category = searchParams.get('category') ?? ''
  const page     = searchParams.get('page') ?? '1'

  const siteUrl  = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

  const params = new URLSearchParams({
    'where[patient][equals]': session.patientId ?? session.userId,
    'depth': '1',
    'limit': '20',
    'page':  page,
    'sort':  '-createdAt',
  })
  if (category) params.set('where[category][equals]', category)

  try {
    const res = await fetch(`${siteUrl}/api/documents?${params}`, {
      headers: { Authorization: `users API-Key ${process.env.PAYLOAD_SECRET}` },
      next: { revalidate: 30 },
    })

    if (!res.ok) throw new Error(`Payload error ${res.status}`)
    const data = await res.json()
    return NextResponse.json({ success: true, ...data })
  } catch (err) {
    console.error('[/api/patients/documents]', err)
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 502 })
  }
}