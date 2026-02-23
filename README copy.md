# 🏥 Ambulanter Pflegedienst – Digitale Plattform

Full-Stack Next.js Anwendung für einen ambulanten Pflegedienst.

## Tech Stack

| Bereich        | Technologie                    |
|----------------|--------------------------------|
| Framework      | Next.js 14 (App Router)        |
| Sprache        | TypeScript                     |
| CMS            | Payload CMS 2.x                |
| Datenbank      | MongoDB Atlas                  |
| Styling        | Tailwind CSS                   |
| i18n           | next-intl (DE/EN/IT/ES/PT/TR)  |
| Terminbuchung  | Cal.com                        |
| E-Mail         | Resend                         |
| Hosting        | Vercel + MongoDB Atlas         |

## Rollen

| Rolle       | Rechte                                          |
|-------------|-------------------------------------------------|
| Superadmin  | Vollzugriff, Rollen vergeben, System verwalten  |
| Admin       | User & Patienten verwalten, Reports             |
| Editor      | Content, Dokumente, Pflegepläne bearbeiten      |
| User        | Eigenes Profil, eigene Termine & Dokumente      |

## Erste Schritte

### 1. Repository klonen & Dependencies installieren

```bash
git clone <repo-url>
cd pflegedienst
npm install
```

### 2. Umgebungsvariablen konfigurieren

```bash
cp .env.example .env.local
# .env.local mit echten Werten befüllen
```

Wichtige Werte in `.env.local`:
- `MONGODB_URI` → MongoDB Atlas Connection String
- `PAYLOAD_SECRET` → mind. 32 Zeichen: `openssl rand -base64 32`
- `RESEND_API_KEY` → Resend Dashboard
- `NEXT_PUBLIC_CAL_USERNAME` → Cal.com Benutzername

### 3. Entwicklungsserver starten

```bash
npm run dev
# → http://localhost:3000        (Öffentliche Website)
# → http://localhost:3000/admin  (Payload Admin Panel)
```

### 4. Payload Typen generieren

```bash
npm run generate:types
```

## Projektstruktur

```
pflegedienst/
├── src/
│   ├── app/
│   │   ├── (frontend)/[locale]/  # Öffentliche Seiten (mehrsprachig)
│   │   ├── (admin)/              # Payload Admin
│   │   └── api/                  # API Routes
│   ├── components/               # React Komponenten
│   ├── lib/
│   │   ├── db/         # MongoDB Verbindung
│   │   ├── email/      # Resend E-Mail Service
│   │   ├── auth/       # Authentifizierung
│   │   └── utils/      # Hilfsfunktionen
│   ├── i18n/
│   │   └── locales/    # Übersetzungen (de/en/it/es/pt/tr)
│   └── types/          # TypeScript Typen
├── payload/
│   ├── collections/    # Users, Patients, Staff, Documents, CarePlans
│   ├── globals/        # SiteSettings, Navigation
│   └── access/         # Rollenbasierte Zugriffsregeln
├── emails/             # E-Mail Templates
├── tests/              # Playwright E2E Tests
├── payload.config.ts   # Payload Konfiguration
├── next.config.ts      # Next.js Konfiguration
├── tailwind.config.ts  # Design System
└── middleware.ts       # i18n Routing
```

## Deployment

```bash
# Vercel CLI
npm i -g vercel
vercel

# Umgebungsvariablen in Vercel Dashboard hinterlegen:
# Settings → Environment Variables
```

## Nächste Schritte (Phase 2)

- [ ] Landing Page Komponenten erstellen
- [ ] Cal.com Integration einbinden
- [ ] Header & Footer Komponenten
- [ ] Hero Section mit Animations
