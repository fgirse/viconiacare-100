'use client'

import { useState, useCallback } from 'react'
import { useAdminPatients } from '@/src/hooks/useAdminData'
import {
  AdminHeader, AdminSearch, FilterPill,
  AdminTable, Thead, Th, Tbody, Tr, Td,
  StatusBadge, SkeletonRow, EmptyRow, Pagination,
} from '@/src/components/admin/AdminShell'
import { cn } from '@/src/lib/utils/utils'

// ── Types ────────────────────────────────────────────────────────────────────
interface PatientContact {
  phone?: string
  mobile?: string
  email?: string
  street?: string
  postalCode?: string
  city?: string
}

interface PatientEmergencyContact {
  name?: string
  relationship?: string
  phone?: string
}

interface PatientInsurance {
  provider?: string
  memberNr?: string
  isPrivate?: boolean
}

interface Patient {
  id: string
  firstName?: string
  lastName?: string
  dateOfBirth?: string
  gender?: string
  careLevel?: string
  status?: string
  contact?: PatientContact
  emergencyContact?: PatientEmergencyContact
  insuranceInfo?: PatientInsurance
  notes?: string
  createdAt?: string
}

interface PatientListResponse {
  docs: Patient[]
  totalDocs: number
  totalPages: number
}

// ── Care level label ──────────────────────────────────────────────────────────
const CL: Record<string, string> = {
  '1': 'PG 1', '2': 'PG 2', '3': 'PG 3',
  '4': 'PG 4', '5': 'PG 5', 'none': '—',
}
const CL_COLOR: Record<string, string> = {
  '1': 'text-green-400', '2': 'text-lime-400', '3': 'text-yellow-400',
  '4': 'text-orange-400', '5': 'text-red-400', 'none': 'text-stone-600',
}

// ── Status filters ────────────────────────────────────────────────────────────
const STATUS_FILTERS = [
  { value: '',           label: 'Alle'       },
  { value: 'inquiry',    label: 'Anfragen'   },
  { value: 'evaluation', label: 'Evaluation' },
  { value: 'active',     label: 'Aktiv'      },
  { value: 'paused',     label: 'Pausiert'   },
  { value: 'inactive',   label: 'Inaktiv'    },
]

// ── Detail drawer helper components ───────────────────────────────────────────
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-6">
    <p className="text-[0.62rem] font-black uppercase tracking-[0.16em] text-stone-600 mb-3">{title}</p>
    <div className="space-y-2">{children}</div>
  </div>
)
const Row = ({ label, value }: { label: string; value?: string | null }) => (
  <div className="flex gap-3">
    <span className="text-[0.72rem] text-stone-600 w-28 flex-shrink-0 pt-[1px]">{label}</span>
    <span className="text-[0.82rem] text-stone-300 font-medium">{value || <span className="text-stone-700 italic text-xs">—</span>}</span>
  </div>
)

// ── Detail drawer ─────────────────────────────────────────────────────────────
function PatientDrawer({ patient, onClose }: { patient: Patient; onClose: () => void }) {
  if (!patient) return null
  const c = patient.contact ?? {}
  const e = patient.emergencyContact ?? {}
  const ins = patient.insuranceInfo ?? {}

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose} />
      {/* Drawer */}
      <aside className="fixed right-0 top-0 bottom-0 w-[380px] bg-stone-950 border-l border-stone-800 z-50 flex flex-col overflow-y-auto animate-[slideInRight_.25s_ease]">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-6 pt-7 pb-5 border-b border-stone-800 sticky top-0 bg-stone-950">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-600 to-teal-800 flex items-center justify-center text-sm font-black text-white flex-shrink-0">
                {patient.firstName?.[0]}{patient.lastName?.[0]}
              </div>
              <div>
                <p className="font-display font-black text-white text-base leading-tight">
                  {patient.firstName} {patient.lastName}
                </p>
                <StatusBadge status={patient.status ?? 'inactive'} />
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-stone-600 hover:text-stone-300 text-xl leading-none mt-1">✕</button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1">
          <Section title="Persönliche Daten">
            <Row label="Geburtsdatum" value={patient.dateOfBirth
              ? new Date(patient.dateOfBirth).toLocaleDateString('de-DE') : undefined} />
            <Row label="Geschlecht" value={
              patient.gender === 'male' ? 'Männlich' :
              patient.gender === 'female' ? 'Weiblich' : patient.gender} />
            <Row label="Pflegegrad"
              value={patient.careLevel !== 'none' ? `Pflegegrad ${patient.careLevel}` : 'Nicht beantragt'} />
          </Section>

          <Section title="Kontakt">
            <Row label="Telefon"  value={c.phone} />
            <Row label="Mobil"    value={c.mobile} />
            <Row label="E-Mail"   value={c.email} />
            <Row label="Adresse"  value={[c.street, c.postalCode && c.city ? `${c.postalCode} ${c.city}` : c.city].filter(Boolean).join(', ')} />
          </Section>

          {e.name && (
            <Section title="Notfallkontakt">
              <Row label="Name"        value={e.name} />
              <Row label="Beziehung"   value={e.relationship} />
              <Row label="Telefon"     value={e.phone} />
            </Section>
          )}

          <Section title="Versicherung">
            <Row label="Krankenkasse" value={ins.provider} />
            <Row label="Vers.-Nr."    value={ins.memberNr} />
            <Row label="Art"          value={ins.isPrivate ? 'Privatpatient' : 'Gesetzlich'} />
          </Section>

          {patient.notes && (
            <Section title="Notizen">
              <p className="text-[0.8rem] text-stone-400 leading-relaxed bg-stone-900 rounded-xl p-3 border border-stone-800">
                {patient.notes}
              </p>
            </Section>
          )}
        </div>

        {/* Actions */}
        <div className="p-5 border-t border-stone-800 flex gap-2">
          <a
            href={`/admin/collections/patients/${patient.id}`}
            target="_blank"
            className="flex-1 text-center py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500
                       text-white font-bold text-xs uppercase tracking-wider transition-colors"
          >
            In Payload öffnen
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700
                       text-stone-400 font-bold text-xs uppercase tracking-wider transition-colors"
          >
            Schließen
          </button>
        </div>
      </aside>
    </>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AdminPatientsPage() {
  const [search,   setSearch]   = useState('')
  const [status,   setStatus]   = useState('')
  const [page,     setPage]     = useState(1)
  const [selected, setSelected] = useState<Patient | null>(null)

  const { data, loading } = useAdminPatients({ search, status, page })

  const response   = data as PatientListResponse | null
  const patients   = response?.docs       ?? []
  const totalDocs  = response?.totalDocs  ?? 0
  const totalPages = response?.totalPages ?? 1

  const handleSearch = useCallback((v: string) => {
    setSearch(v); setPage(1)
  }, [])
  const handleStatus = useCallback((v: string) => {
    setStatus(v); setPage(1)
  }, [])

  return (
    <>
      <div className="p-6 lg:p-9 max-w-[1300px]">
        <p className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-teal-500 mb-1">Admin</p>
        <AdminHeader
          title="Patientenübersicht"
          subtitle={`${totalDocs} Patienten gesamt`}
        >
          <a
            href="/admin/collections/patients/create"
            target="_blank"
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs uppercase tracking-wider transition-colors"
          >
            + Neuer Patient
          </a>
        </AdminHeader>

        {/* Filter row */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="sm:w-72">
            <AdminSearch
              value={search}
              onChange={handleSearch}
              placeholder="Nach Nachname suchen…"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {STATUS_FILTERS.map(f => (
              <FilterPill
                key={f.value}
                label={f.label}
                active={status === f.value}
                onClick={() => handleStatus(f.value)}
              />
            ))}
          </div>
        </div>

        {/* Table */}
        <AdminTable>
          <Thead>
            <Th>#</Th>
            <Th>Patient</Th>
            <Th>Status</Th>
            <Th>Pflegegrad</Th>
            <Th>Kontakt</Th>
            <Th>Versicherung</Th>
            <Th>Seit</Th>
          </Thead>
          <Tbody>
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} cols={7} />)
            ) : patients.length === 0 ? (
              <EmptyRow cols={7} message="Keine Patienten gefunden." />
            ) : (
              patients.map((p: Patient, i: number) => (
                <Tr key={p.id} onClick={() => setSelected(p)}>
                  <Td>
                    <span className="text-stone-700 text-xs font-mono">
                      {((page - 1) * 20) + i + 1}
                    </span>
                  </Td>
                  <Td>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-stone-700 to-stone-800 flex items-center justify-center text-[0.65rem] font-black text-stone-400 flex-shrink-0">
                        {p.firstName?.[0]}{p.lastName?.[0]}
                      </div>
                      <div>
                        <p className="font-bold text-stone-200 text-[0.85rem]">
                          {p.lastName}, {p.firstName}
                        </p>
                        {p.dateOfBirth && (
                          <p className="text-[0.68rem] text-stone-600">
                            *{new Date(p.dateOfBirth).toLocaleDateString('de-DE')}
                          </p>
                        )}
                      </div>
                    </div>
                  </Td>
                  <Td><StatusBadge status={p.status ?? 'inactive'} /></Td>
                  <Td>
                    <span className={cn('font-bold text-sm', CL_COLOR[p.careLevel ?? 'none'])}>
                      {CL[p.careLevel ?? 'none']}
                    </span>
                  </Td>
                  <Td>
                    <div className="text-[0.75rem]">
                      {p.contact?.phone && <p>{p.contact.phone}</p>}
                      {p.contact?.email && (
                        <p className="text-stone-600 truncate max-w-[160px]">{p.contact.email}</p>
                      )}
                    </div>
                  </Td>
                  <Td>
                    <span className="text-[0.75rem]">
                      {p.insuranceInfo?.isPrivate
                        ? <span className="text-teal-400 font-bold">Privat</span>
                        : <span className="text-stone-500">{p.insuranceInfo?.provider ?? 'GKV'}</span>
                      }
                    </span>
                  </Td>
                  <Td>
                    <span className="text-[0.72rem] text-stone-600">
                      {p.createdAt ? new Date(p.createdAt).toLocaleDateString('de-DE') : '—'}
                    </span>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </AdminTable>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="mt-0">
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        )}
      </div>

      {/* Detail drawer */}
      {selected && <PatientDrawer patient={selected} onClose={() => setSelected(null)} />}
    </>
  )
}
