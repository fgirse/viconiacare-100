import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createBooking } from '@/src/lib/cal/client'
import { sendAppointmentConfirmation } from '@/src/lib/email/resend'

const Schema = z.object({
  eventTypeId:   z.union([z.number(), z.enum(['info', 'eval', 'visit'])]),
  start:         z.string(),
  attendee: z.object({
    name:     z.string().min(2),
    email:    z.string().email(),
    timeZone: z.string().default('Europe/Berlin'),
    language: z.string().default('de'),
  }),
  phone:           z.string().optional(),
  notes:           z.string().optional(),
  appointmentType: z.enum(['info', 'eval', 'visit']).default('info'),
})

/**
 * POST /api/booking/create
 * Creates a Cal.com booking and sends a confirmation email.
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

  const { eventTypeId: rawEventTypeId, start, attendee, phone, notes, appointmentType } = parsed.data

  // Resolve string key → numeric Cal.com event type ID
  const numericIdMap: Record<string, number | undefined> = {
    info:  Number(process.env.CAL_EVENT_TYPE_PHONE)     || undefined,
    eval:  Number(process.env.CAL_EVENT_TYPE_INTERVIEW) || undefined,
    visit: Number(process.env.CAL_EVENT_TYPE_HOMEVISIT) || undefined,
  }
  const eventTypeId: number = typeof rawEventTypeId === 'number'
    ? rawEventTypeId
    : (numericIdMap[rawEventTypeId] ?? 0)

  if (!eventTypeId) {
    return NextResponse.json({ error: `Unknown eventTypeId: ${rawEventTypeId}` }, { status: 400 })
  }

  try {
    // ── Create Cal.com booking ────────────────────────────────────
    const booking = await createBooking({
      eventTypeId,
      start,
      attendee: { name: attendee.name, email: attendee.email, timeZone: attendee.timeZone, language: attendee.language },
      metadata: { phone: phone ?? '', notes: notes ?? '' },
      ...(notes ? { bookingFieldsResponses: { notes } } : {}),
    })

    // ── Send confirmation email ───────────────────────────────────
    const startDate = new Date(booking.start)
    await sendAppointmentConfirmation({
      to:              attendee.email,
      firstName:       attendee.name.split(' ')[0],
      appointmentType,
      date:            startDate.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
      time:            startDate.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
      locale:          attendee.language,
    }).catch(e => console.error('Email failed (non-fatal):', e))

    return NextResponse.json({ success: true, data: booking }, { status: 201 })
  } catch (err) {
    console.error('[/api/booking/create]', err)
    return NextResponse.json({ error: 'Booking failed. Please try again.' }, { status: 502 })
  }
}
