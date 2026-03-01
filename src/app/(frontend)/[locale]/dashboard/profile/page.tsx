'use client'

import { usePatient } from '@/src/hooks/usePatientData'
import { useAuthState } from '@/src/hooks/useAuth'
import { Card, Badge, Skeleton, Avatar, Button } from '@/src/components/ui'

// ── Info row ──────────────────────────────────────────────────────────────────
function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex gap-4 py-3 border-b border-stone-100 last:border-0">
      <span className="text-[0.75rem] font-bold uppercase tracking-wider text-stone-400 w-36 flex-shrink-0 pt-0.5">
        {label}
      </span>
      <span className="text-[0.9rem] text-stone-800 font-medium">
        {value ?? <span className="text-stone-300 italic text-sm">Nicht angegeben</span>}
      </span>
    </div>
  )
}

// ── Section header ────────────────────────────────────────────────────────────
function SectionHeader({ icon, title, action }: { icon: string; title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="font-display text-lg font-bold text-stone-700 flex items-center gap-2">
        <span>{icon}</span> {title}
      </h2>
      {action}
    </div>
  )
}

const CARE_LEVEL_LABELS: Record<string, string> = {
  '1': 'Pflegegrad 1 – Geringe Beeinträchtigung',
  '2': 'Pflegegrad 2 – Erhebliche Beeinträchtigung',
  '3': 'Pflegegrad 3 – Schwere Beeinträchtigung',
  '4': 'Pflegegrad 4 – Schwerste Beeinträchtigung',
  '5': 'Pflegegrad 5 – Schwerste Beeinträchtigung mit Sonderbelangen',
  'none': 'Noch nicht beantragt',
}

const GENDER_LABELS: Record<string, string> = {
  male: 'Männlich', female: 'Weiblich', diverse: 'Divers',
}

const STATUS_CONFIG: Record<string, { label: string; color: 'teal' | 'orange' | 'green' | 'stone' | 'red' }> = {
  active:     { label: '✅ Aktiv betreut',  color: 'green'  },
  evaluation: { label: '📋 In Evaluation',  color: 'orange' },
  inquiry:    { label: '🔍 Anfrage',         color: 'stone'  },
  paused:     { label: '⏸️ Pausiert',        color: 'stone'  },
  inactive:   { label: '❌ Inaktiv',         color: 'red'    },
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { user }                    = useAuthState()
  const { data: patient, loading } = usePatient()

  const statusInfo = patient?.status ? STATUS_CONFIG[patient.status] : null

  return (
    <div className="p-6 lg:p-10 max-w-[900px]">

      {/* Header */}
      <div className="mb-8">
        <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-teal-600 mb-1">Mein Bereich</p>
        <h1 className="font-display text-[2rem] font-black text-stone-900">Mein Profil</h1>
        <p className="text-stone-400 text-sm mt-1">Ihre persönlichen Daten und Einstellungen</p>
      </div>

      {/* Profile hero card */}
      <Card className="mb-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[80px] bg-gradient-to-r from-teal-800 to-teal-600 rounded-t-3xl" />
        <div className="relative pt-12 flex items-end gap-5 mb-6">
          {loading ? (
            <Skeleton className="w-20 h-20 rounded-full" />
          ) : (
            <Avatar
              firstName={patient?.firstName ?? user?.firstName}
              lastName={patient?.lastName   ?? user?.lastName}
              size="xl"
              className="border-4 border-white shadow-brand-sm"
            />
          )}
          <div className="pb-1">
            {loading ? (
              <>
                <Skeleton className="h-6 w-44 mb-2" />
                <Skeleton className="h-4 w-32" />
              </>
            ) : (
              <>
                <h2 className="font-display text-2xl font-black text-stone-900">
                  {patient?.firstName ?? user?.firstName} {patient?.lastName ?? user?.lastName}
                </h2>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  {statusInfo && <Badge color={statusInfo.color}>{statusInfo.label}</Badge>}
                  {patient?.careLevel && patient.careLevel !== 'none' && (
                    <Badge color="teal">Pflegegrad {patient.careLevel}</Badge>
                  )}
                </div>
              </>
            )}
          </div>
          <div className="ml-auto">
            <Button variant="ghost" size="sm">Bearbeiten</Button>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-stone-100">
          {[
            { label: 'Pflegegrad', value: patient?.careLevel === 'none' || !patient?.careLevel ? '—' : patient.careLevel },
            { label: 'Status',     value: patient?.status ? statusInfo?.label.split(' ').slice(1).join(' ') : '—' },
            { label: 'Versicherung', value: patient?.insuranceInfo?.isPrivate ? 'Privat' : patient?.insuranceInfo?.provider ?? '—' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className="font-display text-xl font-black text-stone-900">{s.value}</p>
              <p className="text-[0.7rem] font-bold uppercase tracking-wider text-stone-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">

        {/* Personal data */}
        <div>
          <SectionHeader icon="👤" title="Persönliche Daten" action={<Button variant="ghost" size="sm">Ändern</Button>} />
          <Card padding="sm">
            {loading ? (
              <div className="space-y-3">
                {[1,2,3,4].map(i => <Skeleton key={i} className="h-10 w-full" />)}
              </div>
            ) : (
              <>
                <InfoRow label="Vorname"     value={patient?.firstName} />
                <InfoRow label="Nachname"    value={patient?.lastName} />
                <InfoRow label="Geburtsdatum" value={patient?.dateOfBirth
                  ? new Date(patient.dateOfBirth).toLocaleDateString('de-DE')
                  : undefined} />
                <InfoRow label="Geschlecht"  value={patient?.gender ? GENDER_LABELS[patient.gender] : undefined} />
                <InfoRow label="Pflegegrad"  value={patient?.careLevel ? CARE_LEVEL_LABELS[patient.careLevel] : undefined} />
              </>
            )}
          </Card>
        </div>

        {/* Contact */}
        <div>
          <SectionHeader icon="📱" title="Kontaktdaten" action={<Button variant="ghost" size="sm">Ändern</Button>} />
          <Card padding="sm">
            {loading ? (
              <div className="space-y-3">
                {[1,2,3,4].map(i => <Skeleton key={i} className="h-10 w-full" />)}
              </div>
            ) : (
              <>
                <InfoRow label="Telefon"   value={patient?.contact?.phone}  />
                <InfoRow label="Mobil"     value={patient?.contact?.mobile} />
                <InfoRow label="E-Mail"    value={patient?.contact?.email || user?.email} />
                <InfoRow label="Straße"    value={patient?.contact?.street} />
                <InfoRow label="PLZ / Ort" value={
                  patient?.contact?.postalCode && patient?.contact?.city
                    ? `${patient.contact.postalCode} ${patient.contact.city}`
                    : patient?.contact?.city ?? patient?.contact?.postalCode
                } />
              </>
            )}
          </Card>
        </div>

        {/* Emergency contact */}
        <div>
          <SectionHeader icon="🆘" title="Notfallkontakt" />
          <Card padding="sm">
            {loading ? (
              <Skeleton className="h-24 w-full" />
            ) : patient?.emergencyContact?.name ? (
              <>
                <InfoRow label="Name"      value={patient.emergencyContact.name} />
                <InfoRow label="Beziehung" value={patient.emergencyContact.relationship} />
                <InfoRow label="Telefon"   value={patient.emergencyContact.phone} />
              </>
            ) : (
              <div className="py-8 text-center">
                <p className="text-stone-400 text-sm">Kein Notfallkontakt hinterlegt</p>
                <Button variant="ghost" size="sm" className="mt-3">Hinzufügen</Button>
              </div>
            )}
          </Card>
        </div>

        {/* Insurance */}
        <div>
          <SectionHeader icon="🏦" title="Krankenversicherung" />
          <Card padding="sm">
            {loading ? (
              <Skeleton className="h-24 w-full" />
            ) : (
              <>
                <InfoRow label="Krankenkasse"     value={patient?.insuranceInfo?.provider} />
                <InfoRow label="Versichertennr."  value={patient?.insuranceInfo?.memberNr}  />
                <InfoRow label="Art"              value={patient?.insuranceInfo?.isPrivate ? 'Privatpatient' : 'Gesetzlich versichert'} />
              </>
            )}
          </Card>
        </div>

        {/* Account / Login */}
        <div className="md:col-span-2">
          <SectionHeader icon="🔐" title="Account & Sicherheit" />
          <Card>
            <div className="grid sm:grid-cols-3 gap-6">
              <div>
                <p className="text-[0.72rem] font-black uppercase tracking-wider text-stone-400 mb-1">E-Mail</p>
                <p className="text-sm font-bold text-stone-800">{user?.email ?? '—'}</p>
              </div>
              <div>
                <p className="text-[0.72rem] font-black uppercase tracking-wider text-stone-400 mb-1">Passwort</p>
                <p className="text-sm font-bold text-stone-800">••••••••••</p>
              </div>
              <div>
                <p className="text-[0.72rem] font-black uppercase tracking-wider text-stone-400 mb-1">Rolle</p>
                <Badge color="teal" className="capitalize">{user?.role ?? '—'}</Badge>
              </div>
            </div>
            <div className="flex gap-3 mt-6 pt-5 border-t border-stone-100">
              <Button variant="ghost" size="sm">E-Mail ändern</Button>
              <Button variant="ghost" size="sm">Passwort ändern</Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Data export note */}
      <div className="mt-8 p-5 bg-stone-50 border border-stone-200 rounded-3xl flex items-start gap-3">
        <span className="text-xl">📋</span>
        <div>
          <p className="text-sm font-bold text-stone-700 mb-0.5">Datenschutz & DSGVO</p>
          <p className="text-xs text-stone-500 leading-relaxed">
            Sie haben das Recht, Ihre Daten einzusehen, zu korrigieren oder zu löschen.
            Kontaktieren Sie uns für einen vollständigen Datenexport oder bei Fragen zum Datenschutz:{' '}
            <a href="mailto:datenschutz@pflegeplus.de" className="text-teal-600 font-bold hover:underline">
              datenschutz@pflegeplus.de
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}