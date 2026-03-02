import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/src/lib/auth/session'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  try {
    const payload = await getPayload({ config: configPromise })

    const data = await payload.find({
      collection: 'care-plans',
      where: {
        patient: { equals: session.patientId ?? session.userId },
        status:  { equals: 'active' },
      },
      depth: 2,
      limit: 1,
      sort: '-createdAt',
      overrideAccess: true,
    })

    return NextResponse.json({ success: true, data: data.docs?.[0] ?? null })
  } catch (err) {
    console.error('[/api/patients/careplan]', err)
    return NextResponse.json({ error: 'Failed to fetch care plan' }, { status: 502 })
  }
}