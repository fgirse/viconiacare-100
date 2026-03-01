'use client'

import { useState, useEffect, useCallback } from 'react'
import { Patient } from '@/src/types' // adjust path as needed

export interface StaffDoc {
  _id: string
  name: string
  email: string
  role: string
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

// ── Generic admin fetch ───────────────────────────────────────────────────────
function useAdminFetch<T>(url: string | null) {
  const [data,    setData]    = useState<T | null>(null)
  const [loading, setLoading] = useState(!!url)
  const [error,   setError]   = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!url) return
    setLoading(true); setError(null)
    try {
      const res  = await fetch(url)
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`)
      setData(json.data ?? json)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }, [url])

  useEffect(() => { load() }, [load])
  return { data, loading, error, refetch: load }
}

// ── Stats ─────────────────────────────────────────────────────────────────────
export interface AdminStats {
  totalPatients:  number
  activePatients: number
  newInquiries:   number
  inEvaluation:   number
  totalStaff:     number
  activeStaff:    number
  statusCounts:   Record<string, number>
}

export function useAdminStats() {
  return useAdminFetch<AdminStats>('/api/admin/stats')
}

// ── Patients ──────────────────────────────────────────────────────────────────
export interface AdminPatientsParams {
  page?:      number
  status?:    string
  careLevel?: string
  search?:    string
  sort?:      string
}

export function useAdminPatients(params: AdminPatientsParams = {}) {
  const qs = new URLSearchParams()
  if (params.page)      qs.set('page',      String(params.page))
  if (params.status)    qs.set('status',    params.status)
  if (params.careLevel) qs.set('careLevel', params.careLevel)
  if (params.search)    qs.set('search',    params.search)
  if (params.sort)      qs.set('sort',      params.sort)

  const url = `/api/admin/patients?${qs}`
  return useAdminFetch<{ docs: Patient[]; totalDocs: number; totalPages: number; page: number }>(url)
}

// ── Calendar ──────────────────────────────────────────────────────────────────
export interface CalendarBooking {
  _id: string
  patientId: string
  staffId: string
  startTime: string
  endTime: string
  status: string
  createdAt?: string
  updatedAt?: string
}

// ── Staff ─────────────────────────────────────────────────────────────────────
export interface AdminStaffParams {
  role?:     string
  isActive?: boolean
  search?:   string
}

export function useAdminStaff(params: AdminStaffParams = {}) {
  const qs = new URLSearchParams()
  if (params.role)                    qs.set('role',     params.role)
  if (params.isActive !== undefined)  qs.set('isActive', String(params.isActive))
  if (params.search)                  qs.set('search',   params.search)

  return useAdminFetch<{ docs: StaffDoc[]; totalDocs: number }>(
    `/api/admin/staff?${qs}`
  )
}

// ── Calendar ──────────────────────────────────────────────────────────────────
export function useAdminCalendar(start: string, end: string) {
  const url = `/api/admin/calendar?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`
  return useAdminFetch<CalendarBooking[]>(url)
}
