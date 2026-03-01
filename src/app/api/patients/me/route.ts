import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/src/lib/auth/session'

/** GET /api/patients/me – fetches the current patient's full record via Payload */
export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

  try {
    // Fetch from Payload local API (server-side)
    const res = await fetch(
      `${siteUrl}/api/patients?where[userAccount][equals]=${session.userId}&depth=2`,
      {
        headers: {
          Authorization: `users API-Key ${process.env.PAYLOAD_SECRET}`,
        },
        next: { revalidate: 60 },
      }
    )

    if (!res.ok) throw new Error(`Payload error ${res.status}`)

    const data = await res.json()
    const patient = data.docs?.[0] ?? null

    if (!patient) {
      return NextResponse.json({ error: 'No patient record found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: patient })
  } catch (err) {
    console.error('[/api/patients/me]', err)
    return NextResponse.json({ error: 'Failed to fetch patient data' }, { status: 502 })
  }
}