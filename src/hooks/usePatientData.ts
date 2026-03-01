'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Patient, Document, CarePlan } from '@/src/types'

// ── Generic fetch hook ────────────────────────────────────────────────────────
function useFetch<T>(url: string, enabled = true) {
  const [data,    setData]    = useState<T | null>(null)
  const [loading, setLoading] = useState(enabled)
  const [error,   setError]   = useState<string | null>(null)

  const fetch_ = useCallback(async () => {
    if (!enabled) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(url)
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`)
      setData(json.data ?? json)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }, [url, enabled])

  useEffect(() => { fetch_() }, [fetch_])
  return { data, loading, error, refetch: fetch_ }
}

// ── Patient profile ───────────────────────────────────────────────────────────
export function usePatient() {
  return useFetch<Patient>('/api/patients/me')
}

// ── Documents ─────────────────────────────────────────────────────────────────
export interface DocumentsData {
  docs:       Document[]
  totalDocs:  number
  totalPages: number
  page:       number
}

export function useDocuments(category?: string) {
  const url = category
    ? `/api/patients/documents?category=${category}`
    : '/api/patients/documents'
  return useFetch<DocumentsData>(url)
}

// ── Care plan ─────────────────────────────────────────────────────────────────
export function useCarePlan() {
  return useFetch<CarePlan>('/api/patients/careplan')
}

// ── Appointments ──────────────────────────────────────────────────────────────
export interface Appointment {
  uid:       string
  title:     string
  startTime: string
  endTime:   string
  status:    string
  location?: string
  eventType: { slug: string; title: string }
}

export function useAppointments() {
  return useFetch<Appointment[]>('/api/patients/appointments')
}