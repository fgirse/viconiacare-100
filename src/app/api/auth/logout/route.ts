import { NextRequest, NextResponse } from 'next/server'
import { clearSessionCookie } from '@/src/lib/auth/session'

/** POST /api/auth/logout – clears the session cookie */
export async function POST(_req: NextRequest) {
  const response = NextResponse.json({ success: true })
  return clearSessionCookie(response)
}