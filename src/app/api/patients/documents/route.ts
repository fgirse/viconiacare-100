import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/src/lib/auth/session'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req)
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const { searchParams } = req.nextUrl
  const category = searchParams.get('category') ?? ''
  const page     = Number(searchParams.get('page') ?? '1')

  try {
    const payload = await getPayload({ config: configPromise })

    const where: Record<string, unknown> = {
      patient: { equals: session.patientId ?? session.userId },
    }
    if (category) where.category = { equals: category }

    const data = await payload.find({
      collection: 'documents',
      where,
      depth: 1,
      limit: 20,
      page,
      sort: '-createdAt',
      overrideAccess: true,
    })

    return NextResponse.json({ success: true, ...data })
  } catch (err) {
    console.error('[/api/patients/documents]', err)
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 502 })
  }
}