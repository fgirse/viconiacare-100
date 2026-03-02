'use client'

import { useState, useEffect, useCallback } from 'react'
import type { CalSlot } from '@/src/lib/cal/client'

interface UseSlotsOptions {
  eventTypeId: string
  timeZone?:   string
  enabled?:    boolean
}

interface UseSlotsReturn {
  slots:     CalSlot[]
  loading:   boolean
  error:     string | null
  refetch:   () => void
  /** Slots grouped by date string "YYYY-MM-DD" (keyed by slot.start) */
  byDate:    Record<string, CalSlot[]>
}

/**
 * Fetches available Cal.com slots for the next 30 days.
 * Calls our backend proxy /api/booking/slots to keep API key server-side.
 */
export function useCalSlots({
  eventTypeId,
  timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone,
  enabled = true,
}: UseSlotsOptions): UseSlotsReturn {

  const [slots,   setSlots]   = useState<CalSlot[]>([])
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  // Compute 30-day window
  const start = new Date()
  const end   = new Date()
  end.setDate(end.getDate() + 30)

  const startStr = start.toISOString().split('T')[0]
  const endStr   = end.toISOString().split('T')[0]

  const fetchSlots = useCallback(async () => {
    if (!enabled || !eventTypeId) return
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        eventTypeId,
        start: startStr,
        end:   endStr,
        tz:    timeZone,
      })

      const res = await fetch(`/api/booking/slots?${params}`)
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error ?? `HTTP ${res.status}`)
      }

      const data = await res.json()
      setSlots(data.slots ?? [])
    } catch (err) {
      setError(String(err instanceof Error ? err.message : err))
      setSlots([])
    } finally {
      setLoading(false)
    }
  }, [eventTypeId, startStr, endStr, timeZone, enabled])

  useEffect(() => { fetchSlots() }, [fetchSlots])

  // Group slots by date
  const byDate = slots.reduce<Record<string, CalSlot[]>>((acc, slot) => {
    const date = slot.start.split('T')[0] // "YYYY-MM-DD"
    if (!acc[date]) acc[date] = []
    acc[date].push(slot)
    return acc
  }, {})

  return { slots, loading, error, refetch: fetchSlots, byDate }
}
