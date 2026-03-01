/**
 * Edge-safe session utilities – no Node.js APIs.
 * Safe to import in middleware (Edge Runtime).
 */
import { jwtVerify } from 'jose'
import type { NextRequest } from 'next/server'

const COOKIE_NAME = 'pflegeplus-session'

const getSecret = () =>
  new TextEncoder().encode(
    process.env.JWT_SECRET ?? 'fallback-dev-secret-change-in-production'
  )

export interface SessionPayload {
  userId:     string
  email:      string
  role:       string
  patientId?: string
  firstName:  string
  lastName:   string
  iat?:       number
  exp?:       number
}

export async function getSessionFromRequest(
  req: NextRequest
): Promise<SessionPayload | null> {
  const token = req.cookies.get(COOKIE_NAME)?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, getSecret())
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}
