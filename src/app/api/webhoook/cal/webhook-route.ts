import { NextRequest, NextResponse } from 'next/server'
import {
  verifyWebhookSignature,
  parseWebhookEvent,
  dispatchWebhookEvent,
  getPrimaryAttendee,
  getBookingMeta,
  formatBookingTime,
  type WebhookHandlerRegistry,
} from '@/src/lib/cal/webhook'
import { sendAppointmentConfirmation } from '@/src/lib/email/resend'
import { getEventBySlug } from '@/src/lib/cal/events'

// ── Handler registry ──────────────────────────────────────────────────────────
const handlers: WebhookHandlerRegistry = {

  BOOKING_CREATED: async (payload) => {
    const attendee  = getPrimaryAttendee(payload)
    const eventConf = getEventBySlug(payload.eventType?.slug)
    const phone     = getBookingMeta(payload, 'phone')

    console.log('[webhook] BOOKING_CREATED', {
      uid:      payload.uid,
      type:     payload.eventType?.slug,
      attendee: attendee?.email,
      phone,
    })

    if (attendee?.email && attendee?.name) {
      const firstName = attendee.name.split(' ')[0]
      const apptType  = (eventConf?.key ?? 'info') as 'info' | 'eval' | 'visit'
      const timeStr   = formatBookingTime(payload)
      const [datePart, timePart] = timeStr.split(', ')

      await sendAppointmentConfirmation({
        to:              attendee.email,
        firstName,
        appointmentType: apptType,
        date:            datePart,
        time:            timePart,
        locale:          attendee.locale?.slice(0, 2) ?? 'de',
      })
    }
  },

  BOOKING_CANCELLED: async (payload) => {
    console.log('[webhook] BOOKING_CANCELLED', {
      uid:    payload.uid,
      reason: payload.cancellationReason,
    })
  },

  BOOKING_RESCHEDULED: async (payload) => {
    const attendee = getPrimaryAttendee(payload)
    console.log('[webhook] BOOKING_RESCHEDULED', {
      uid:         payload.uid,
      previousUid: payload.rescheduleUid,
      newTime:     payload.startTime,
    })

    if (attendee?.email && attendee?.name) {
      const firstName = attendee.name.split(' ')[0]
      const eventConf = getEventBySlug(payload.eventType?.slug)
      const apptType  = (eventConf?.key ?? 'info') as 'info' | 'eval' | 'visit'
      const timeStr   = formatBookingTime(payload)
      const [datePart, timePart] = timeStr.split(', ')

      await sendAppointmentConfirmation({
        to:              attendee.email,
        firstName,
        appointmentType: apptType,
        date:            datePart,
        time:            timePart,
        locale:          attendee.locale?.slice(0, 2) ?? 'de',
      })
    }
  },

  BOOKING_REJECTED: async (payload) => {
    console.log('[webhook] BOOKING_REJECTED', {
      uid:    payload.uid,
      reason: payload.rejectionReason,
    })
  },

  BOOKING_REQUESTED: async (payload) => {
    console.log('[webhook] BOOKING_REQUESTED (pending approval)', payload.uid)
  },

  MEETING_ENDED: async (payload) => {
    console.log('[webhook] MEETING_ENDED', payload.uid)
  },
}

// ── Route handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const rawBody   = await req.text()
  const signature = req.headers.get('x-cal-signature-256') ?? ''

  if (!verifyWebhookSignature(rawBody, signature)) {
    console.warn('[webhook/cal] Invalid or missing signature')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let event
  try {
    event = parseWebhookEvent(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  await dispatchWebhookEvent(event, handlers)

  return NextResponse.json({ received: true })
}
