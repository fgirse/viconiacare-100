import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createSession, setSessionCookie } from '@/src/lib/auth/session'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

const LoginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(8),
})

/**
 * POST /api/auth/login
 * Authenticates against Payload CMS users collection.
 * Returns HttpOnly JWT cookie on success.
 */
export async function POST(req: NextRequest) {
  let body: unknown
  try { body = await req.json() }
  catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }

  const parsed = LoginSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 422 }
    )
  }

  const { email, password } = parsed.data
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

  // ── Authenticate via Payload CMS ───────────────────────────────
  let payloadUser: any
  try {
    const res = await fetch(`${siteUrl}/api/users/login`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email, password }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return NextResponse.json(
        { error: err.errors?.[0]?.message ?? 'Ungültige E-Mail oder Passwort.' },
        { status: 401 }
      )
    }

    const data = await res.json()
    payloadUser = data.user
  } catch (err) {
    console.error('[/api/auth/login] Payload error:', err)
    return NextResponse.json({ error: 'Auth service unavailable' }, { status: 503 })
  }

  if (!payloadUser?.isActive) {
    return NextResponse.json(
      { error: 'Ihr Konto ist deaktiviert. Bitte kontaktieren Sie uns.' },
      { status: 403 }
    )
  }

  // ── Look up linked patient record (relationship is on Patient side) ────────
  let patientId: string | undefined
  try {
    const payload = await getPayload({ config: configPromise })
    const patResult = await payload.find({
      collection: 'patients',
      where: { userAccount: { equals: payloadUser.id } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    patientId = patResult.docs?.[0]?.id as string | undefined
  } catch (err) {
    console.warn('[/api/auth/login] Could not resolve patientId:', err)
  }

  // ── Create JWT session ─────────────────────────────────────────
  const token = await createSession({
    userId:    payloadUser.id,
    email:     payloadUser.email,
    role:      payloadUser.role ?? 'user',
    firstName: payloadUser.firstName,
    lastName:  payloadUser.lastName,
    patientId,
  })

  const response = NextResponse.json({
    success: true,
    user: {
      id:        payloadUser.id,
      email:     payloadUser.email,
      firstName: payloadUser.firstName,
      lastName:  payloadUser.lastName,
      role:      payloadUser.role,
    },
  })

  return setSessionCookie(response, token)
}