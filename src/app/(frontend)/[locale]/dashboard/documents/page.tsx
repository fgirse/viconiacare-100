'use client'

import { useState } from 'react'
import { useDocuments } from '@/src/hooks/usePatientData'
import { Card, Badge, Button, EmptyState, Skeleton } from '@/src/components/ui'
import { cn } from '@/src/lib/utils/utils'

// ── Types ─────────────────────────────────────────────────────────────────────
interface Document {
  id: string
  title: string
  category?: string
  createdAt: string
  filesize?: number
  expiresAt?: string
  url?: string
  mimeType?: string
  isConfidential?: boolean
}

// ── Category config ───────────────────────────────────────────────────────────
const CATEGORIES = [
  { value: '',           label: 'Alle',            icon: '📁' },
  { value: 'contract',   label: 'Verträge',         icon: '📜' },
  { value: 'medical',    label: 'Arztberichte',     icon: '🏥' },
  { value: 'medication', label: 'Medikation',       icon: '💊' },
  { value: 'care-report',label: 'Pflegeberichte',  icon: '📊' },
  { value: 'invoice',    label: 'Kostenvoranschlag',icon: '🏦' },
  { value: 'other',      label: 'Sonstiges',        icon: '📄' },
]

const CATEGORY_COLORS: Record<string, 'teal' | 'orange' | 'blue' | 'green' | 'stone' | 'red'> = {
  contract:    'teal',
  medical:     'blue',
  medication:  'orange',
  'care-report': 'green',
  invoice:     'stone',
  other:       'stone',
}

function formatFileSize(bytes: number | undefined) {
  if (!bytes) return '—'
  if (bytes < 1024)      return `${bytes} B`
  if (bytes < 1048576)   return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1048576).toFixed(1)} MB`
}

// ── Document row ──────────────────────────────────────────────────────────────
function DocumentRow({ doc }: { doc: Document }) {
  const cat   = doc.category ?? 'other'
  const color = CATEGORY_COLORS[cat] ?? 'stone'
  const catInfo = CATEGORIES.find(c => c.value === cat)

  const mimeIcon = (mime: string | undefined) => {
    if (mime?.includes('pdf'))   return '📕'
    if (mime?.includes('image')) return '🖼️'
    if (mime?.includes('word'))  return '📝'
    return '📄'
  }

  return (
    <div className="flex items-center gap-4 py-4 group">
      {/* File icon */}
      <div className="w-11 h-11 rounded-2xl bg-stone-100 flex items-center justify-center text-xl flex-shrink-0 group-hover:bg-teal-50 transition-colors">
        {mimeIcon(doc.mimeType)}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-[0.9rem] text-stone-900 truncate">{doc.title}</p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <span className="text-[0.72rem] text-stone-400">
            {new Date(doc.createdAt).toLocaleDateString('de-DE')}
          </span>
          {doc.filesize && (
            <span className="text-[0.72rem] text-stone-300">·</span>
          )}
          <span className="text-[0.72rem] text-stone-400">{formatFileSize(doc.filesize)}</span>
          {doc.expiresAt && (
            <>
              <span className="text-[0.72rem] text-stone-300">·</span>
              <span className="text-[0.72rem] text-orange-500 font-medium">
                Gültig bis {new Date(doc.expiresAt).toLocaleDateString('de-DE')}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Category */}
      <Badge color={color} className="hidden sm:flex">
        {catInfo?.icon} {catInfo?.label}
      </Badge>

      {/* Download */}
      {doc.url && (
        <a
          href={doc.url}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 h-9 rounded-xl border border-stone-200 flex items-center justify-center
                     text-stone-400 hover:bg-teal-50 hover:border-teal-300 hover:text-teal-600
                     transition-all flex-shrink-0"
          title="Herunterladen"
        >
          ↓
        </a>
      )}

      {doc.isConfidential && (
        <span title="Vertraulich" className="text-stone-300 flex-shrink-0">🔒</span>
      )}
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function DocumentsPage() {
  const [activeCategory, setActiveCategory] = useState('')
  const { data, loading } = useDocuments(activeCategory || undefined)

  const docs      = (data as { docs: Document[]; totalDocs: number } | undefined)?.docs ?? []
  const totalDocs = (data as { docs: Document[]; totalDocs: number } | undefined)?.totalDocs ?? 0

  return (
    <div className="p-6 lg:p-10 max-w-[960px]">

      {/* Header */}
      <div className="mb-8">
        <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-teal-600 mb-1">Mein Bereich</p>
        <h1 className="font-display text-[2rem] font-black text-stone-900">Meine Dokumente</h1>
        <p className="text-stone-400 text-sm mt-1">
          {totalDocs > 0 ? `${totalDocs} Dokument${totalDocs !== 1 ? 'e' : ''} gespeichert` : 'Ihre sicheren Gesundheitsdokumente'}
        </p>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={cn(
              'flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[0.78rem] font-bold transition-all duration-150',
              activeCategory === cat.value
                ? 'bg-teal-600 text-white shadow-brand-sm'
                : 'bg-white border border-stone-200 text-stone-500 hover:border-teal-300 hover:text-teal-700',
            )}
          >
            <span>{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Document list */}
      <Card padding="sm">
        {loading ? (
          <div className="divide-y divide-stone-100">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center gap-4 py-4">
                <Skeleton className="w-11 h-11 rounded-2xl" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-2/3 mb-2" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : docs.length > 0 ? (
          <div className="divide-y divide-stone-100">
            {docs.map((doc: Document) => (
              <DocumentRow key={doc.id} doc={doc} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="📁"
            title="Keine Dokumente gefunden"
            description={
              activeCategory
                ? 'Keine Dokumente in dieser Kategorie vorhanden.'
                : 'Ihr Pflegeteam wird hier Ihre Dokumente hochladen.'
            }
            action={activeCategory ? (
              <Button variant="ghost" size="sm" onClick={() => setActiveCategory('')}>
                Alle anzeigen
              </Button>
            ) : undefined}
          />
        )}
      </Card>

      {/* Info note */}
      <div className="mt-6 p-5 bg-teal-50 border border-teal-100 rounded-3xl flex items-start gap-3">
        <span className="text-xl mt-0.5">🔒</span>
        <div>
          <p className="text-sm font-bold text-teal-800 mb-0.5">Datenschutz & Sicherheit</p>
          <p className="text-xs text-teal-700/70 leading-relaxed">
            Alle Ihre Dokumente sind verschlüsselt gespeichert und nur für Sie und Ihr Pflegeteam zugänglich.
            Bei Fragen wenden Sie sich an uns: <a href="tel:+4989123456789" className="font-bold hover:underline">+49 89 123 456 789</a>
          </p>
        </div>
      </div>
    </div>
  )
}