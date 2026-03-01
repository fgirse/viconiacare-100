'use client'

import { useState } from 'react'
import { useAdminStaff } from '@/src/hooks/useAdminData'
import {
  AdminHeader, AdminSearch, FilterPill,
  AdminTable, Thead, Th, Tbody, Tr, Td,
  SkeletonRow, EmptyRow,
} from '@/src/components/admin/AdminShell'
import { cn } from '@/src/lib/utils/utils'

// ── Types ────────────────────────────────────────────────────────────────────
interface StaffContact {
  phone?: string
  mobile?: string
  email?: string
}

interface StaffEmployment {
  type?: string
  startDate?: string
  hoursPerWeek?: number
}

interface StaffMember {
  id: string
  firstName?: string
  lastName?: string
  staffRole?: string
  qualification?: string
  isActive?: boolean
  contact?: StaffContact
  employmentDetails?: StaffEmployment
}

interface StaffListResponse {
  docs: StaffMember[]
  totalDocs: number
}

// ── Role config ───────────────────────────────────────────────────────────────
const ROLES: Record<string, { label: string; icon: string; color: string }> = {
  nurse:     { label: 'Pflegefachkraft',    icon: '🩺', color: 'text-teal-400' },
  caregiver: { label: 'Altenpfleger/in',    icon: '💙', color: 'text-blue-400' },
  helper:    { label: 'Pflegehelfer/in',    icon: '🤝', color: 'text-green-400' },
  manager:   { label: 'Pflegedienstleitung', icon: '⭐', color: 'text-orange-400' },
  admin:     { label: 'Verwaltung',          icon: '🗂', color: 'text-stone-400' },
}

const ROLE_FILTERS = [
  { value: '',         label: 'Alle' },
  { value: 'manager',  label: 'Leitung' },
  { value: 'nurse',    label: 'Fachkraft' },
  { value: 'caregiver',label: 'Altenpflege' },
  { value: 'helper',   label: 'Hilfe' },
  { value: 'admin',    label: 'Verwaltung' },
]

const EMPLOY: Record<string, string> = {
  fulltime: 'Vollzeit', parttime: 'Teilzeit',
  minijob: 'Minijob', freelance: 'Freelance',
}

// ── Staff card (grid view) ────────────────────────────────────────────────────
function StaffCard({ member, onClick }: { member: StaffMember; onClick: () => void }) {
  const role = ROLES[member.staffRole ?? ''] ?? { label: member.staffRole, icon: '👤', color: 'text-stone-400' }

  return (
    <button
      onClick={onClick}
      className="group text-left w-full bg-stone-900 border border-stone-800 rounded-2xl p-5
                 hover:border-teal-700/60 hover:bg-stone-800/50 transition-all"
    >
      {/* Avatar + active indicator */}
      <div className="flex items-start justify-between mb-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-stone-700 to-stone-800 flex items-center justify-center text-base font-black text-stone-300">
            {member.firstName?.[0]}{member.lastName?.[0]}
          </div>
          {member.isActive && (
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-stone-900" />
          )}
        </div>
        <span className={cn('text-[0.7rem] font-bold', role.color)}>
          {role.icon} {role.label}
        </span>
      </div>

      {/* Name */}
      <p className="font-bold text-stone-200 text-[0.9rem] group-hover:text-teal-300 transition-colors">
        {member.firstName} {member.lastName}
      </p>
      {member.qualification && (
        <p className="text-[0.72rem] text-stone-600 mt-0.5 truncate">{member.qualification}</p>
      )}

      {/* Details */}
      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-stone-800">
        {member.employmentDetails?.type && (
          <span className="text-[0.65rem] font-bold uppercase tracking-wide text-stone-600">
            {EMPLOY[member.employmentDetails.type]}
          </span>
        )}
        {member.employmentDetails?.hoursPerWeek && (
          <span className="text-[0.65rem] text-stone-700">
            {member.employmentDetails.hoursPerWeek}h/Woche
          </span>
        )}
        {!member.isActive && (
          <span className="text-[0.65rem] font-bold text-red-500 ml-auto">Inaktiv</span>
        )}
      </div>
    </button>
  )
}

// ── Row component for staff details ───────────────────────────────────────────
function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex gap-3 py-2 border-b border-stone-900 last:border-0">
      <span className="text-[0.7rem] text-stone-600 w-32 flex-shrink-0">{label}</span>
      <span className="text-[0.82rem] text-stone-300 font-medium">{value || <span className="text-stone-700 italic text-xs">—</span>}</span>
    </div>
  )
}

// ── Staff detail drawer ───────────────────────────────────────────────────────
function StaffDrawer({ member, onClose }: { member: StaffMember; onClose: () => void }) {
  if (!member) return null
  const role = ROLES[member.staffRole ?? ''] ?? { label: member.staffRole, icon: '👤', color: 'text-stone-400' }
  const c    = member.contact ?? {}
  const ed   = member.employmentDetails ?? {}

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose} />
      <aside className="fixed right-0 top-0 bottom-0 w-[360px] bg-stone-950 border-l border-stone-800 z-50 flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="px-6 pt-7 pb-5 border-b border-stone-800 sticky top-0 bg-stone-950">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-800 to-stone-800 flex items-center justify-center font-black text-teal-300">
                {member.firstName?.[0]}{member.lastName?.[0]}
              </div>
              <div>
                <p className="font-display font-black text-white text-base leading-none">
                  {member.firstName} {member.lastName}
                </p>
                <p className={cn('text-[0.72rem] font-bold mt-1', role.color)}>
                  {role.icon} {role.label}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="text-stone-600 hover:text-stone-300 text-xl">✕</button>
          </div>

          {/* Active badge */}
          <div className="mt-3">
            <span className={cn(
              'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[0.68rem] font-bold',
              member.isActive
                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                : 'bg-red-500/10 text-red-400 border-red-500/20',
            )}>
              <span className={cn('text-[0.4rem]', member.isActive ? 'text-green-500' : 'text-red-500')}>●</span>
              {member.isActive ? 'Aktiv' : 'Inaktiv'}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 flex-1">
          <p className="text-[0.62rem] font-black uppercase tracking-[0.16em] text-stone-600 mb-3">Kontakt</p>
          <Row label="Telefon"  value={c.phone}  />
          <Row label="Mobil"    value={c.mobile}  />
          <Row label="E-Mail"   value={c.email}   />

          <p className="text-[0.62rem] font-black uppercase tracking-[0.16em] text-stone-600 mt-5 mb-3">Anstellung</p>
          <Row label="Art"           value={ed.type ? EMPLOY[ed.type] ?? ed.type : undefined} />
          <Row label="Einstellung"   value={ed.startDate ? new Date(ed.startDate).toLocaleDateString('de-DE') : undefined} />
          <Row label="Std./Woche"    value={ed.hoursPerWeek ? `${ed.hoursPerWeek} Std.` : undefined} />
          <Row label="Qualifikation" value={member.qualification} />
        </div>

        {/* Actions */}
        <div className="p-5 border-t border-stone-800 flex gap-2">
          <a
            href={`/admin/collections/staff/${member.id}`}
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
export default function AdminStaffPage() {
  const [search,    setSearch]   = useState('')
  const [role,      setRole]     = useState('')
  const [viewMode,  setViewMode] = useState<'cards' | 'table'>('cards')
  const [selected,  setSelected] = useState<StaffMember | null>(null)
  const [showInactive, setShowInactive] = useState(false)

  const { data, loading } = useAdminStaff({
    search,
    role: role || undefined,
    isActive: showInactive ? undefined : true,
  })

  const response  = data as StaffListResponse | null
  const staff     = response?.docs      ?? []
  const totalDocs = response?.totalDocs ?? 0

  return (
    <>
      <div className="p-6 lg:p-9 max-w-[1300px]">
        <p className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-teal-500 mb-1">Admin</p>
        <AdminHeader
          title="Mitarbeiterverwaltung"
          subtitle={`${totalDocs} Mitarbeiter${showInactive ? '' : ' (aktive)'}`}
        >
          {/* View toggle */}
          <div className="flex bg-stone-800 rounded-xl p-1 gap-1">
            {(['cards', 'table'] as const).map(v => (
              <button
                key={v}
                onClick={() => setViewMode(v)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-bold transition-all',
                  viewMode === v
                    ? 'bg-teal-600 text-white'
                    : 'text-stone-500 hover:text-stone-300',
                )}
              >
                {v === 'cards' ? '⊞ Karten' : '≡ Tabelle'}
              </button>
            ))}
          </div>
          <a
            href="/admin/collections/staff/create"
            target="_blank"
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs uppercase tracking-wider transition-colors"
          >
            + Mitarbeiter
          </a>
        </AdminHeader>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="sm:w-64">
            <AdminSearch value={search} onChange={v => setSearch(v)} placeholder="Name suchen…" />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            {ROLE_FILTERS.map(f => (
              <FilterPill
                key={f.value}
                label={f.label}
                active={role === f.value}
                onClick={() => setRole(f.value)}
              />
            ))}
            <button
              onClick={() => setShowInactive(v => !v)}
              className={cn(
                'px-3 py-1.5 rounded-full text-[0.75rem] font-bold transition-all border',
                showInactive
                  ? 'bg-stone-600 border-stone-500 text-stone-200'
                  : 'bg-transparent border-stone-700 text-stone-600 hover:border-stone-500 hover:text-stone-400',
              )}
            >
              + Inaktive
            </button>
          </div>
        </div>

        {/* ── Card grid view ─────────────────────────────── */}
        {viewMode === 'cards' && (
          loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-40 rounded-2xl bg-stone-900 border border-stone-800 animate-pulse" />
              ))}
            </div>
          ) : staff.length === 0 ? (
            <div className="py-20 text-center text-stone-600 font-medium">
              Keine Mitarbeiter gefunden.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {staff.map((m: StaffMember) => (
                <StaffCard key={m.id} member={m} onClick={() => setSelected(m)} />
              ))}
            </div>
          )
        )}

        {/* ── Table view ─────────────────────────────────── */}
        {viewMode === 'table' && (
          <AdminTable>
            <Thead>
              <Th>Mitarbeiter</Th>
              <Th>Rolle</Th>
              <Th>Kontakt</Th>
              <Th>Anstellung</Th>
              <Th>Std./Wo.</Th>
              <Th>Status</Th>
            </Thead>
            <Tbody>
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} cols={6} />)
              ) : staff.length === 0 ? (
                <EmptyRow cols={6} message="Keine Mitarbeiter gefunden." />
              ) : (
                staff.map((m: StaffMember) => {
                  const r = ROLES[m.staffRole ?? ''] ?? { label: m.staffRole, icon: '👤', color: 'text-stone-400' }
                  return (
                    <Tr key={m.id} onClick={() => setSelected(m)}>
                      <Td>
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-stone-800 flex items-center justify-center text-[0.65rem] font-black text-stone-400 flex-shrink-0">
                            {m.firstName?.[0]}{m.lastName?.[0]}
                          </div>
                          <p className="font-bold text-stone-200 text-[0.85rem]">
                            {m.lastName}, {m.firstName}
                          </p>
                        </div>
                      </Td>
                      <Td>
                        <span className={cn('text-[0.78rem] font-bold', r.color)}>
                          {r.icon} {r.label}
                        </span>
                      </Td>
                      <Td>
                        <div className="text-[0.73rem] text-stone-500">
                          {m.contact?.phone && <p>{m.contact.phone}</p>}
                          {m.contact?.email && <p className="truncate max-w-[160px]">{m.contact.email}</p>}
                        </div>
                      </Td>
                      <Td>
                        <span className="text-[0.73rem] text-stone-500">
                          {EMPLOY[m.employmentDetails?.type ?? ''] ?? '—'}
                        </span>
                      </Td>
                      <Td>
                        <span className="text-[0.73rem] text-stone-400">
                          {m.employmentDetails?.hoursPerWeek ? `${m.employmentDetails.hoursPerWeek}h` : '—'}
                        </span>
                      </Td>
                      <Td>
                        <span className={cn(
                          'text-[0.68rem] font-bold',
                          m.isActive ? 'text-green-400' : 'text-red-500',
                        )}>
                          {m.isActive ? '● Aktiv' : '● Inaktiv'}
                        </span>
                      </Td>
                    </Tr>
                  )
                })
              )}
            </Tbody>
          </AdminTable>
        )}
      </div>

      {selected && <StaffDrawer member={selected} onClose={() => setSelected(null)} />}
    </>
  )
}
