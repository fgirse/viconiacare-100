import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/src/lib/auth/session'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

/** GET /api/patients/me – fetches the current patient's full record via Payload */
export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  try {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'patients',
      where: { userAccount: { equals: session.userId } },
      limit: 1,
      depth: 2,
      overrideAccess: true,
    })

    const patient = result.docs?.[0] ?? null

    if (!patient) {
      return NextResponse.json({ error: 'No patient record found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: patient })
  } catch (err) {
    console.error('[/api/patients/me]', err)
    return NextResponse.json({ error: 'Failed to fetch patient data' }, { status: 502 })
  }
}