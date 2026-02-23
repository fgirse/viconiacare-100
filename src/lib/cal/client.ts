// Cal.com types for use with the Cal.eu API

export interface CalSlot {
  /** ISO 8601 start time, e.g. "2026-03-10T09:00:00Z" */
  time: string
  /** Duration in minutes */
  duration?: number
  /** Optional attendees count */
  attendees?: number
}

export interface CalSlotsResponse {
  slots: Record<string, CalSlot[]>
}

export interface CalBookingPayload {
  eventTypeId: string
  start: string
  name: string
  email: string
  phone?: string
  timeZone: string
  language?: string
  metadata?: Record<string, string>
}

export interface CalBookingResponse {
  uid: string
  status: 'ACCEPTED' | 'PENDING' | 'CANCELLED' | 'REJECTED'
  startTime: string
  endTime: string
}
