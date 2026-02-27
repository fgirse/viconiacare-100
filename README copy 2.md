# Pflegedienst — Leistungssektion

Next.js · Tailwind CSS · TypeScript · Payload CMS

## Dateistruktur

```
├── collections/
│   └── Services.ts              # Payload CMS Collection
├── types/
│   └── service.ts               # TypeScript-Typen
├── lib/
│   └── getServices.ts           # Datenabruf + Seed-Fallback (8 Leistungen)
├── components/
│   ├── ServiceIcons.tsx         # SVG-Icon-Registry (8 Icons)
│   ├── ServiceCard.tsx          # Karten-Komponente (Client)
│   └── ServicesSection.tsx      # Gesamtsektion (Server Component)
└── app/leistungen/
    └── page.tsx                 # Beispielseite
```

## Pflegebereiche

| Bereich | Icon | Kassenleistung |
|---|---|---|
| Körperpflege & Hygiene | Herz | ✅ |
| Medizinische Behandlungspflege | Spritze | ✅ |
| Hauswirtschaftliche Versorgung | Haus | ❌ |
| Demenzbetreuung | Gehirn | ✅ |
| Palliativpflege | Taube | ✅ |
| Verhinderungspflege | Pfeil-Kreis | ✅ |
| Beratung & Soziale Begleitung | Sprechblase | ✅ |
| Nacht- & Bereitschaftspflege | Mond | ❌ |

## Setup

### 1. Payload Collection registrieren

```ts
// payload.config.ts
import Services from './collections/Services'

export default buildConfig({
  collections: [Services, Media, /* ... */],
})
```

### 2. Umgebungsvariable setzen

```
# .env.local
NEXT_PUBLIC_PAYLOAD_URL=http://localhost:3001
```

### 3. Google Font einbinden (optional, für Playfair Display)

```tsx
// app/layout.tsx
import { Playfair_Display } from 'next/font/google'
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })
```

### 4. Sektion einbinden

```tsx
import ServicesSection from '@/components/ServicesSection'
// In jeder Seite:
<ServicesSection />
```

## Design-Entscheidungen

- **Farbschema**: `yellow-600` (Wärme, Vertrauen) + `emerald-500` (Gesundheit, Natur)
- **Karten-Akzente** wechseln alternierend zwischen Gelb und Grün
- **„Kassenleistung"-Badge** erscheint nur bei erstattungsfähigen Leistungen
- **Hover**: Karte hebt sich an, Pfeil-Button erscheint, Icon-Hintergrund wird intensiver
- **Hintergrund**: Dezente Dotmatrix + farbige Radial-Glows für Tiefe
- **CTA-Footer**: Direkter Aufruf + Beratungslink am Ende der Sektion
- **ISR**: Leistungen werden stündlich neu geladen (`revalidate: 3600`)
- **Fallback**: Wenn Payload nicht erreichbar → automatisch Seed-Daten
