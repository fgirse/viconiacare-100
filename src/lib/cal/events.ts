/**
 * Cal.com Event Type Configuration
 * Central source of truth for all PflegePlus booking event types.
 * IDs come from .env – slugs are the Cal.com event type slugs.
 */

// ── Types ─────────────────────────────────────────────────────────────────────
export type EventTypeKey = 'info' | 'eval' | 'visit'

export interface CalEventConfig {
  key:         EventTypeKey
  /** Cal.com numeric event type ID (from env) */
  id:          number
  /** Cal.com URL slug */
  slug:        string
  /** Display title (German) */
  title:       string
  /** Short description */
  description: string
  /** Duration in minutes */
  duration:    number
  /** UI step label */
  step:        string
  /** Emoji icon */
  icon:        string
  /** Accent color (Tailwind class fragments) */
  color: {
    bg:     string
    text:   string
    border: string
    badge:  string
  }
  /** Whether this is the recommended/highlighted option */
  recommended: boolean
}

// ── Event type definitions ────────────────────────────────────────────────────
export const CAL_EVENTS: Record<EventTypeKey, CalEventConfig> = {
  info: {
    key:         'info',
    id:          Number(process.env.NEXT_PUBLIC_CAL_EVENT_ID_INFO ?? 111111),
    slug:        process.env.NEXT_PUBLIC_CAL_EVENT_INFO ?? 'info-telefonat',
    title:       'Info-Telefonat',
    description: 'Stellen Sie Ihre Fragen kostenlos und unverbindlich – per Telefon.',
    duration:    30,
    step:        'Schritt 1',
    icon:        '📞',
    color: {
      bg:     'bg-blue-500/10',
      text:   'text-blue-400',
      border: 'border-blue-500/20',
      badge:  'bg-blue-50 text-blue-700 border-blue-200',
    },
    recommended: false,
  },

  eval: {
    key:         'eval',
    id:          Number(process.env.NEXT_PUBLIC_CAL_EVENT_ID_EVAL ?? 222222),
    slug:        process.env.NEXT_PUBLIC_CAL_EVENT_EVAL ?? 'bedarfsanalyse',
    title:       'Bedarfsanalyse',
    description: 'Gemeinsam ermitteln wir Ihren individuellen Pflegebedarf im Detail.',
    duration:    60,
    step:        'Schritt 2',
    icon:        '📋',
    color: {
      bg:     'bg-teal-500/10',
      text:   'text-teal-400',
      border: 'border-teal-500/20',
      badge:  'bg-teal-50 text-teal-700 border-teal-200',
    },
    recommended: true,
  },

  visit: {
    key:         'visit',
    id:          Number(process.env.NEXT_PUBLIC_CAL_EVENT_ID_VISIT ?? 333333),
    slug:        process.env.NEXT_PUBLIC_CAL_EVENT_VISIT ?? 'hausbesuch',
    title:       'Hausbesuch',
    description: 'Wir kommen zu Ihnen nach Hause für eine persönliche Evaluation.',
    duration:    90,
    step:        'Schritt 3',
    icon:        '🏡',
    color: {
      bg:     'bg-orange-500/10',
      text:   'text-orange-400',
      border: 'border-orange-500/20',
      badge:  'bg-orange-50 text-orange-700 border-orange-200',
    },
    recommended: false,
  },
}

// ── Lookup helpers ────────────────────────────────────────────────────────────

/** Get event config by key */
export function getEvent(key: EventTypeKey): CalEventConfig {
  return CAL_EVENTS[key]
}

/** Get all event configs as array */
export function getAllEvents(): CalEventConfig[] {
  return Object.values(CAL_EVENTS)
}

/** Look up event config by Cal.com numeric ID */
export function getEventById(id: number): CalEventConfig | undefined {
  return Object.values(CAL_EVENTS).find(e => e.id === id)
}

/** Look up event config by Cal.com slug */
export function getEventBySlug(slug: string): CalEventConfig | undefined {
  return Object.values(CAL_EVENTS).find(e => e.slug === slug)
}

/** Get the Cal.com event type ID for a given key */
export function getEventTypeId(key: EventTypeKey): number {
  return CAL_EVENTS[key].id
}

/** Get the Cal.com slug for a given key */
export function getEventSlug(key: EventTypeKey): string {
  return CAL_EVENTS[key].slug
}

/** Build a full Cal.com embed/link URL for a given key */
export function getCalLink(key: EventTypeKey, username?: string): string {
  const u    = username ?? process.env.NEXT_PUBLIC_CAL_USERNAME ?? 'pflegeplus'
  const slug = CAL_EVENTS[key].slug
  return `${u}/${slug}`
}

/** Labels for all event types (for dropdowns, selects, etc.) */
export const EVENT_TYPE_OPTIONS = getAllEvents().map(e => ({
  value: e.key,
  label: `${e.icon} ${e.title}`,
  duration: e.duration,
}))
