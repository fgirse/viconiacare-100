'use client'

import { useState, useCallback } from 'react'

interface CreateBookingBody {
  eventTypeId: string
  start:       string
  attendee: {
    name:     string
    email:    string
    timeZone: string
    language?: string
  }
  notes?:           string
  phone?:           string
  appointmentType?: 'info' | 'eval' | 'visit'
}

interface BookingResult {
  uid:    string
  title:  string
  start:  string
  end:    string
  status: string
}

interface UseCreateBookingReturn {
  createBooking: (data: CreateBookingBody) => Promise<BookingResult | null>
  loading:       boolean
  error:         string | null
  result:        BookingResult | null
  reset:         () => void
}

/**
 * Hook to submit a booking to /api/booking/create.
 * Handles loading, error, and success states.
 */
export function useCreateBooking(): UseCreateBookingReturn {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)
  const [result,  setResult]  = useState<BookingResult | null>(null)

  const createBooking = useCallback(async (
    data: CreateBookingBody
  ): Promise<BookingResult | null> => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/booking/create', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(data),
      })

      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error ?? `HTTP ${res.status}`)
      }

      setResult(json.booking)
      return json.booking as BookingResult
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      setError(msg)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setLoading(false)
    setError(null)
    setResult(null)
  }, [])

  return { createBooking, loading, error, result, reset }
}
