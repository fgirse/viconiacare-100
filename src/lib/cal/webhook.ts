/**
 * Cal.com Webhook Utilities
 *
 * Provides:
 *  - HMAC-SHA256 signature verification (verifyWebhookSignature)
 *  - Typed event payloads for all Cal.com trigger events
 *  - Handler registry pattern for clean webhook routing
 *  - Helper to extract booking metadata
 *
 * Usage in /api/webhook/cal/route.ts:
 *   import { verifyWebhookSignature, parseWebhookEvent, webhookHandlers } from '@/lib/cal/webhook'
 */

import crypto from 'crypto'

// ── Signature verification ────────────────────────────────────────────────────

const WEBHOOK_SECRET = process.env.CAL_WEBHOOK_SECRET ?? ''

/**
 * Verify the HMAC-SHA256 signature from Cal.com.
 * Cal sends the signature in the `X-Cal-Signature-256` header as a hex string.
 *
 * @param rawBody   Raw request body string (before JSON.parse)
 * @param signature Hex string from X-Cal-Signature-256 header
 * @returns true if valid, false if invalid
 */
export function verifyWebhookSignature(rawBody: string, signature: string): boolean {
  if (!WEBHOOK_SECRET) {
    // Allow unauthenticated webhooks only in development
    if (process.env.NODE_ENV !== 'production') return true
    console.error('[webhook] CAL_WEBHOOK_SECRET is not set in production!')
    return false
  }

  if (!signature) return false

  try {
    const expected = crypto
      .createHmac('sha256', WEBHOOK_SECRET)
      .update(rawBody)
      .digest('hex')

    // Constant-time comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(signature.toLowerCase(), 'hex'),
      Buffer.from(expected.toLowerCase(), 'hex'),
    )
  } catch {
    return false
  }
}

// ── Typed event payloads ──────────────────────────────────────────────────────

export type CalTriggerEvent =
  | 'BOOKING_CREATED'
  | 'BOOKING_CANCELLED'
  | 'BOOKING_RESCHEDULED'
  | 'BOOKING_REJECTED'
  | 'BOOKING_REQUESTED'
  | 'BOOKING_PAID'
  | 'BOOKING_NO_SHOW_UPDATED'
  | 'FORM_SUBMITTED'
  | 'MEETING_ENDED'
  | 'MEETING_STARTED'
  | 'RECORDING_READY'

export interface CalWebhookAttendee {
  id?:       number
  email:     string
  name:      string
  timeZone?: string
  locale?:   string
  noShow?:   boolean
}

export interface CalWebhookOrganizer {
  id:        number
  name:      string
  email:     string
  timeZone?: string
  locale?:   string
}

export interface CalWebhookEventType {
  id:          number
  title:       string
  slug:        string
  description?: string
  length:      number
  teamId?:     number | null
  teamName?:   string | null
}

export interface CalWebhookBookingPayload {
  /** Cal.com booking UID (stable identifier) */
  uid:           string
  /** Numeric booking ID */
  bookingId?:    number
  title:         string
  type:          string
  status:        'ACCEPTED' | 'PENDING' | 'CANCELLED' | 'REJECTED'
  startTime:     string   // ISO 8601
  endTime:       string   // ISO 8601
  createdAt?:    string
  rescheduled?:  boolean
  /** UID of the previous booking if rescheduled */
  rescheduleUid?: string | null

  attendees:     CalWebhookAttendee[]
  organizer:     CalWebhookOrganizer
  eventType:     CalWebhookEventType

  /** Custom metadata passed at booking creation */
  metadata?:     Record<string, string>
  /** Additional booking fields (notes, etc.) */
  responses?:    Record<string, { value: string; label: string }>

  location?:     string
  videoCallData?: { url: string; id?: string; password?: string } | null
  conferenceCredentialId?: number | null

  /** Cancellation reason (if BOOKING_CANCELLED) */
  cancellationReason?: string | null
  /** Rejection reason (if BOOKING_REJECTED) */
  rejectionReason?:    string | null
  /** Payment info (if BOOKING_PAID) */
  paymentId?:          string | null
  /** Whether the attendee was marked as no-show */
  noShowHost?:         boolean
}

/** Top-level webhook envelope from Cal.com */
export interface CalWebhookEvent<T = CalWebhookBookingPayload> {
  triggerEvent:  CalTriggerEvent
  createdAt:     string
  /** Webhook subscription ID */
  webhookId?:    string
  payload:       T
}

// ── Parse & type-narrow ───────────────────────────────────────────────────────

/**
 * Parse and type the raw webhook body.
 * Throws on invalid JSON.
 */
export function parseWebhookEvent(rawBody: string): CalWebhookEvent {
  return JSON.parse(rawBody) as CalWebhookEvent
}

/**
 * Extract the primary attendee (first in list, non-organizer).
 */
export function getPrimaryAttendee(
  payload: CalWebhookBookingPayload,
): CalWebhookAttendee | undefined {
  return payload.attendees?.[0]
}

/**
 * Extract metadata value safely.
 */
export function getBookingMeta(
  payload: CalWebhookBookingPayload,
  key: string,
): string | undefined {
  return payload.metadata?.[key]
}

/**
 * Format booking time range for display.
 */
export function formatBookingTime(payload: CalWebhookBookingPayload, locale = 'de-DE'): string {
  const start = new Date(payload.startTime)
  const end   = new Date(payload.endTime)
  const date  = start.toLocaleDateString(locale, {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
  const timeFrom = start.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
  const timeTo   = end.toLocaleTimeString(locale,   { hour: '2-digit', minute: '2-digit' })
  return `${date}, ${timeFrom} – ${timeTo} Uhr`
}

// ── Handler registry ──────────────────────────────────────────────────────────
/**
 * Type-safe handler for a specific Cal.com trigger event.
 * Return void or a Promise<void>.
 */
export type WebhookHandler = (
  payload: CalWebhookBookingPayload,
  event:   CalWebhookEvent,
) => Promise<void> | void

/** Registry of handlers keyed by trigger event */
export type WebhookHandlerRegistry = Partial<Record<CalTriggerEvent, WebhookHandler>>

/**
 * Execute the appropriate handler for a webhook event.
 * Logs unhandled events. Errors in handlers are caught and logged (non-fatal).
 *
 * @example
 * const handlers: WebhookHandlerRegistry = {
 *   BOOKING_CREATED: async (payload) => {
 *     await notifyStaff(payload)
 *   },
 *   BOOKING_CANCELLED: async (payload) => {
 *     await updatePatientRecord(payload)
 *   },
 * }
 *
 * await dispatchWebhookEvent(parsed, handlers)
 */
export async function dispatchWebhookEvent(
  event:    CalWebhookEvent,
  registry: WebhookHandlerRegistry,
): Promise<void> {
  const handler = registry[event.triggerEvent]

  if (!handler) {
    console.log(`[webhook/cal] No handler for: ${event.triggerEvent} (uid: ${event.payload?.uid})`)
    return
  }

  try {
    await handler(event.payload, event)
    console.log(`[webhook/cal] ✓ Handled: ${event.triggerEvent} (uid: ${event.payload?.uid})`)
  } catch (err) {
    console.error(`[webhook/cal] ✗ Handler error for ${event.triggerEvent}:`, err)
    // Non-fatal – Cal.com will retry on non-2xx, but we always return 200
    // to avoid infinite retries for application-level errors
  }
}
