import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import resend from '@/src/lib/email/resend'

const FROM  = process.env.EMAIL_FROM     ?? 'ViconiaCare <onboarding@resend.dev>'
const REPLY = process.env.EMAIL_REPLY_TO ?? 'info@rettungsanker-freiburg.de'
const ADMIN = process.env.EMAIL_ADMIN    ?? 'info@rettungsanker-freiburg.de'

const Schema = z.object({
  appointmentType: z.enum(['info', 'eval', 'visit']),
  preferredDate:   z.string().min(1),           // "YYYY-MM-DD"
  preferredTime:   z.string().min(1),           // "morning" | "afternoon" | "evening" | free text
  name:            z.string().min(2),
  email:           z.string().email(),
  phone:           z.string().optional(),
  notes:           z.string().optional(),
})

const typeLabels: Record<string, string> = {
  info:  'Info-Telefonat (30 Min.)',
  eval:  'Bedarfsanalyse (60 Min.)',
  visit: 'Hausbesuch (90 Min.)',
}

const timeLabels: Record<string, string> = {
  morning:   'Vormittag (08:00 – 12:00 Uhr)',
  afternoon: 'Nachmittag (12:00 – 17:00 Uhr)',
  evening:   'Abend (17:00 – 20:00 Uhr)',
}

function fmtDate(iso: string) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('de-DE', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

/**
 * POST /api/booking/request
 * Sends a booking-request notification to the team + confirmation to the user.
 * Does NOT connect to Cal.com.
 */
export async function POST(req: NextRequest) {
  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = Schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 422 })
  }

  const { appointmentType, preferredDate, preferredTime, name, email, phone, notes } = parsed.data

  const typeLabel = typeLabels[appointmentType] ?? appointmentType
  const timeLabel = timeLabels[preferredTime]   ?? preferredTime
  const dateLabel = fmtDate(preferredDate)

  // ── Team notification ──────────────────────────────────────────────────────
  const adminHtml = `
<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8"><title>Neue Terminanfrage</title></head>
<body style="margin:0;padding:32px;font-family:Helvetica,Arial,sans-serif;background:#f5f5f4;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08);">
    <div style="background:linear-gradient(135deg,#0d9488,#0f766e);padding:24px 32px;">
      <h1 style="margin:0;color:#fff;font-size:20px;font-weight:900;">📅 Neue Terminanfrage</h1>
    </div>
    <div style="padding:32px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdfa;border:1px solid #99f6e4;border-radius:12px;margin-bottom:24px;">
        <tr><td style="padding:10px 16px;font-size:13px;font-weight:700;color:#0f766e;width:150px;">Art</td><td style="padding:10px 16px;font-size:15px;color:#1c1917;font-weight:600;">${typeLabel}</td></tr>
        <tr><td style="padding:10px 16px;font-size:13px;font-weight:700;color:#0f766e;">Wunschdatum</td><td style="padding:10px 16px;font-size:15px;color:#1c1917;font-weight:600;">${dateLabel}</td></tr>
        <tr><td style="padding:10px 16px;font-size:13px;font-weight:700;color:#0f766e;">Wunschzeit</td><td style="padding:10px 16px;font-size:15px;color:#1c1917;font-weight:600;">${timeLabel}</td></tr>
        <tr><td style="padding:10px 16px;font-size:13px;font-weight:700;color:#0f766e;">Name</td><td style="padding:10px 16px;font-size:15px;color:#1c1917;font-weight:600;">${name}</td></tr>
        <tr><td style="padding:10px 16px;font-size:13px;font-weight:700;color:#0f766e;">E-Mail</td><td style="padding:10px 16px;font-size:15px;color:#1c1917;font-weight:600;"><a href="mailto:${email}" style="color:#0d9488;">${email}</a></td></tr>
        ${phone ? `<tr><td style="padding:10px 16px;font-size:13px;font-weight:700;color:#0f766e;">Telefon</td><td style="padding:10px 16px;font-size:15px;color:#1c1917;font-weight:600;"><a href="tel:${phone}" style="color:#0d9488;">${phone}</a></td></tr>` : ''}
        ${notes ? `<tr><td style="padding:10px 16px;font-size:13px;font-weight:700;color:#0f766e;vertical-align:top;">Hinweise</td><td style="padding:10px 16px;font-size:15px;color:#1c1917;">${notes}</td></tr>` : ''}
      </table>
      <p style="margin:0;font-size:13px;color:#78716c;">Bitte kontaktieren Sie <strong>${name}</strong> innerhalb von 24 Stunden, um den Termin zu bestätigen.</p>
    </div>
  </div>
</body></html>`

  // ── User confirmation ──────────────────────────────────────────────────────
  const userHtml = `
<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8"><title>Terminanfrage erhalten</title></head>
<body style="margin:0;padding:32px;font-family:Helvetica,Arial,sans-serif;background:#f5f5f4;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08);">
    <div style="background:linear-gradient(135deg,#0d9488,#0f766e);padding:24px 32px;">
      <span style="font-size:22px;font-weight:900;color:#fff;">Viconia<span style="color:#fb923c;">Care</span></span>
    </div>
    <div style="padding:32px;">
      <h1 style="margin:0 0 16px;font-size:24px;font-weight:900;color:#042f2e;">Ihre Anfrage ist eingegangen ✅</h1>
      <p style="margin:0 0 14px;font-size:15px;color:#44403c;line-height:1.7;">Hallo ${name.split(' ')[0]},</p>
      <p style="margin:0 0 20px;font-size:15px;color:#44403c;line-height:1.7;">wir haben Ihre Terminanfrage erhalten und melden uns innerhalb von <strong>24 Stunden</strong>, um einen konkreten Termin mit Ihnen abzustimmen.</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdfa;border:1px solid #99f6e4;border-radius:12px;margin-bottom:24px;">
        <tr><td style="padding:10px 16px;font-size:13px;font-weight:700;color:#0f766e;width:150px;">Art</td><td style="padding:10px 16px;font-size:15px;color:#1c1917;font-weight:600;">${typeLabel}</td></tr>
        <tr><td style="padding:10px 16px;font-size:13px;font-weight:700;color:#0f766e;">Wunschdatum</td><td style="padding:10px 16px;font-size:15px;color:#1c1917;font-weight:600;">${dateLabel}</td></tr>
        <tr><td style="padding:10px 16px;font-size:13px;font-weight:700;color:#0f766e;">Wunschzeit</td><td style="padding:10px 16px;font-size:15px;color:#1c1917;font-weight:600;">${timeLabel}</td></tr>
      </table>
      <p style="margin:0 0 14px;font-size:15px;color:#44403c;line-height:1.7;">Bei dringenden Fragen erreichen Sie uns unter <a href="tel:+4940123456789" style="color:#0d9488;">+49 40 123 456 789</a>.</p>
      <p style="margin:24px 0 0;font-size:14px;color:#78716c;">Mit freundlichen Grüßen,<br><strong>Ihr ViconiaCare-Team</strong></p>
    </div>
    <div style="background:#f5f5f4;padding:20px 32px;border-top:1px solid #e7e5e4;">
      <p style="margin:0;font-size:12px;color:#78716c;">ViconiaCare GmbH · Weidestr. 120 b · 22083 Hamburg</p>
    </div>
  </div>
</body></html>`

  try {
    await Promise.all([
      resend.emails.send({
        from: FROM, reply_to: email, to: ADMIN,
        subject: `📅 Neue Terminanfrage: ${typeLabel} von ${name}`,
        html: adminHtml,
      }),
      resend.emails.send({
        from: FROM, reply_to: REPLY, to: email,
        subject: 'Ihre Terminanfrage – ViconiaCare',
        html: userHtml,
      }),
    ])
    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err) {
    console.error('[/api/booking/request]', err)
    return NextResponse.json({ error: 'Could not send confirmation. Please try again.' }, { status: 502 })
  }
}
