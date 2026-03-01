import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/src/lib/auth/session'

/** GET /api/auth/me – returns the current authenticated user from the session cookie */
export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req)

  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  return NextResponse.json({
    success: true,
    user: {
      userId:    session.userId,
      email:     session.email,
      firstName: session.firstName,
      lastName:  session.lastName,
      role:      session.role,
      patientId: session.patientId,
    },
  })
}