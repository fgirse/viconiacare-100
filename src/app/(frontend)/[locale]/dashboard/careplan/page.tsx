'use client'

import { useCarePlan } from '@/src/hooks/usePatientData';
import type { CarePlanGoal, Medication, ProgressNote, StaffMember, User } from '@/src/types';
import { Card, Badge, Skeleton, EmptyState, Button } from '@/src/components/ui';
import { cn } from '@/src/lib/utils/utils';
import Link from 'next/link';

// ── Goal item ─────────────────────────────────────────────────────────────────
function GoalItem({ goal }: { goal: CarePlanGoal }) {
  const intervalLabels: Record<string, string> = {
    daily:           'Täglich',
    'multiple-daily': 'Mehrmals täglich',
    weekly:          'Wöchentlich',
    'as-needed':     'Bei Bedarf',
  }

  return (
    <div className={cn(
      'flex items-start gap-4 p-4 rounded-2xl border transition-colors',
      goal.completed
        ? 'bg-green-50 border-green-100'
        : 'bg-white border-stone-100 hover:border-teal-200',
    )}>
      {/* Checkbox */}
      <div className={cn(
        'w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5',
        goal.completed
          ? 'bg-green-500 border-green-500 text-white'
          : 'border-stone-300',
      )}>
        {goal.completed && <span className="text-xs">✓</span>}
      </div>

      <div className="flex-1 min-w-0">
        <p className={cn(
          'font-bold text-[0.9rem]',
          goal.completed ? 'text-green-700 line-through' : 'text-stone-900',
        )}>
          {goal.goal}
        </p>
        {goal.measure && (
          <p className="text-xs text-stone-400 mt-1 leading-relaxed">{goal.measure}</p>
        )}
        {goal.interval && (
          <span className="inline-block mt-2 text-[0.68rem] font-bold uppercase tracking-wider
                           bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">
            {intervalLabels[goal.interval] ?? goal.interval}
          </span>
        )}
      </div>
    </div>
  )
}

// ── Medication item ───────────────────────────────────────────────────────────
function MedItem({ med }: { med: Medication }) {
  return (
    <div className="flex items-start gap-3.5 py-3.5 border-b border-stone-100 last:border-0">
      <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center text-lg flex-shrink-0">
        💊
      </div>
      <div>
        <p className="font-bold text-[0.9rem] text-stone-900">{med.name}</p>
        <div className="flex gap-3 mt-0.5 flex-wrap">
          {med.dosage && (
            <span className="text-xs text-stone-500 flex items-center gap-1">
              <span className="text-stone-300">⚖️</span> {med.dosage}
            </span>
          )}
          {med.time && (
            <span className="text-xs text-stone-500 flex items-center gap-1">
              <span className="text-stone-300">🕐</span> {med.time}
            </span>
          )}
        </div>
        {med.notes && (
          <p className="text-xs text-stone-400 mt-1 italic">{med.notes}</p>
        )}
      </div>
    </div>
  )
}

// ── Progress note ─────────────────────────────────────────────────────────────
function NoteItem({ note }: { note: ProgressNote }) {
  const writer = typeof note.writtenBy === 'object' && note.writtenBy !== null
    ? (note.writtenBy as User)
    : null
  return (
    <div className="relative pl-6 pb-6 last:pb-0">
      {/* Timeline line */}
      <div className="absolute left-0 top-1 bottom-0 w-px bg-stone-200 last:hidden" />
      {/* Dot */}
      <div className="absolute left-[-4px] top-1 w-2.5 h-2.5 rounded-full bg-teal-500 border-2 border-white" />

      <div>
        <p className="text-[0.72rem] font-bold text-stone-400 mb-1.5">
          {new Date(note.date).toLocaleDateString('de-DE', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
          })}
          {note.writtenBy && writer?.firstName && (
            <span className="ml-2 text-teal-600">
              · {writer.firstName} {writer.lastName}
            </span>
          )}
        </p>
        <div className="bg-stone-50 border border-stone-100 rounded-2xl p-4">
          {typeof note.note === 'string' ? (
            <p className="text-sm text-stone-600 leading-relaxed">{note.note}</p>
          ) : (
            <p className="text-sm text-stone-400 italic">Kein Inhalt</p>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function CarePlanPage() {
  const { data: plan, loading } = useCarePlan()

  const totalGoals     = plan?.goals?.length ?? 0
  const completedGoals = plan?.goals?.filter(g => g.completed).length ?? 0
  const progress       = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0

  if (loading) return (
    <div className="p-6 lg:p-10 max-w-[960px] grid gap-6">
      <Skeleton className="h-10 w-64 mb-4" />
      <div className="grid md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-48 rounded-3xl bg-stone-100 animate-pulse" />)}
      </div>
    </div>
  )

  if (!plan) return (
    <div className="p-6 lg:p-10">
      <div className="mb-8">
        <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-teal-600 mb-1">Mein Bereich</p>
        <h1 className="font-display text-[2rem] font-black text-stone-900">Mein Pflegeplan</h1>
      </div>
      <Card>
        <EmptyState
          icon="📋"
          title="Noch kein Pflegeplan vorhanden"
          description="Ihr Pflegeteam erstellt nach der Bedarfsanalyse Ihren individuellen Pflegeplan."
          action={
            <Link href="/de/dashboard/appointments">
              <Button variant="primary" size="sm">Termin vereinbaren</Button>
            </Link>
          }
        />
      </Card>
    </div>
  )

  return (
    <div className="p-6 lg:p-10 max-w-[960px]">

      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-teal-600 mb-1">Mein Bereich</p>
          <h1 className="font-display text-[2rem] font-black text-stone-900">{plan.title}</h1>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <Badge color={plan.status === 'active' ? 'green' : 'stone'}>
              {plan.status === 'active' ? '✅ Aktiv' : plan.status === 'paused' ? '⏸️ Pausiert' : '✔️ Abgeschlossen'}
            </Badge>
            <span className="text-xs text-stone-400">
              Gültig ab {new Date(plan.validFrom).toLocaleDateString('de-DE')}
              {plan.validUntil && ` bis ${new Date(plan.validUntil).toLocaleDateString('de-DE')}`}
            </span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      {totalGoals > 0 && (
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <p className="font-bold text-stone-800">Gesamtfortschritt</p>
            <span className="font-display text-2xl font-black text-teal-600">{progress}%</span>
          </div>
          <div className="h-3 bg-stone-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-teal-400 rounded-full transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-stone-400 mt-2">
            {completedGoals} von {totalGoals} Pflegezielen erreicht
          </p>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">

        {/* ── Goals ─────────────────────────────────────── */}
        <div className="md:col-span-2">
          <h2 className="font-display text-lg font-bold text-stone-700 mb-4 flex items-center gap-2">
            🎯 Pflegeziele
            {totalGoals > 0 && (
              <span className="text-[0.75rem] font-bold text-stone-400 font-sans">
                ({completedGoals}/{totalGoals} erreicht)
              </span>
            )}
          </h2>
          {plan.goals && plan.goals.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-3">
              {plan.goals.map(goal => <GoalItem key={goal.id} goal={goal} />)}
            </div>
          ) : (
            <Card><EmptyState icon="🎯" title="Noch keine Pflegeziele definiert" /></Card>
          )}
        </div>

        {/* ── Medications ───────────────────────────────── */}
        <div>
          <h2 className="font-display text-lg font-bold text-stone-700 mb-4">💊 Medikationsplan</h2>
          {plan.medications && plan.medications.length > 0 ? (
            <Card padding="sm">
              {plan.medications.map(med => <MedItem key={med.id} med={med} />)}
            </Card>
          ) : (
            <Card><EmptyState icon="💊" title="Keine Medikamente eingetragen" /></Card>
          )}
        </div>

        {/* ── Assigned staff ────────────────────────────── */}
        <div>
          <h2 className="font-display text-lg font-bold text-stone-700 mb-4">👥 Mein Pflegeteam</h2>
          {plan.assignedStaff.filter((m): m is StaffMember => typeof m === 'object')?.length > 0 ? (
            <Card padding="sm">
              <div className="divide-y divide-stone-100">
                {plan.assignedStaff
                  .filter((m): m is StaffMember => typeof m === 'object')
                  .map((member, i) => (
                  <div key={i} className="flex items-center gap-3.5 py-3.5 first:pt-0 last:pb-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-600 to-teal-700
                                    flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                      {(member.firstName?.[0] ?? '') + (member.lastName?.[0] ?? '')}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-stone-800">
                        {member.firstName ?? 'Pflegekraft'} {member.lastName ?? ''}
                      </p>
                      {member.staffRole && (
                        <p className="text-xs text-stone-400 capitalize">{member.staffRole}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ) : (
            <Card><EmptyState icon="👥" title="Noch keine Pflegekräfte zugeordnet" /></Card>
          )}
        </div>

        {/* ── Progress notes ────────────────────────────── */}
        <div className="md:col-span-2">
          <h2 className="font-display text-lg font-bold text-stone-700 mb-4">📊 Verlaufsberichte</h2>
          {plan.progressNotes && plan.progressNotes.length > 0 ? (
            <Card>
              <div className="space-y-0">
                {plan.progressNotes
                  .slice()
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 8)
                  .map(note => <NoteItem key={note.id} note={note} />)}
              </div>
            </Card>
          ) : (
            <Card><EmptyState icon="📊" title="Noch keine Verlaufsberichte" /></Card>
          )}
        </div>
      </div>
    </div>
  )
}