import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'fallback-dev-secret-change-in-production'
)

const COOKIE_NAME = 'pflegeplus-session'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7  // 7 days

export interface SessionPayload {
  userId:    string
  email:     string
  role:      string
  patientId?: string   // linked patient record
  firstName: string
  lastName:  string
  iat?:      number
  exp?:      number
}

// ── Create JWT ────────────────────────────────────────────────────────────────
export async function createSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET)
}

// ── Verify JWT ────────────────────────────────────────────────────────────────
export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}

// ── Get current session (Server Component) ────────────────────────────────────
export async function getSession(): Promise<SessionPayload | null> {
  const token = (await cookies()).get(COOKIE_NAME)?.value
  if (!token) return null
  return verifySession(token)
}

// ── Set session cookie on response ────────────────────────────────────────────
export function setSessionCookie(response: NextResponse, token: string): NextResponse {
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge:   COOKIE_MAX_AGE,
    path:     '/',
  })
  return response
}

// ── Clear session cookie ──────────────────────────────────────────────────────
export function clearSessionCookie(response: NextResponse): NextResponse {
  response.cookies.set(COOKIE_NAME, '', { maxAge: 0, path: '/' })
  return response
}

// ── Get session from request (middleware / API) ───────────────────────────────
export async function getSessionFromRequest(req: NextRequest): Promise<SessionPayload | null> {
  const token = req.cookies.get(COOKIE_NAME)?.value
  if (!token) return null
  return verifySession(token)
}

// ── Auth guard – redirects to login if no session ─────────────────────────────
export async function requireAuth(redirectTo = '/de/login'): Promise<SessionPayload> {
  const session = await getSession()
  if (!session) {
    const { redirect } = await import('next/navigation')
    redirect(redirectTo)
  }
  return session as SessionPayload
}
