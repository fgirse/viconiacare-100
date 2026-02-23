import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { slateEditor } from '@payloadcms/richtext-slate'
import path from 'path'

// Collections
import { Users }     from './payload/collections/Users'
import { Patients }  from './payload/collections/Patients'
import { Staff }     from './payload/collections/Staff'
import { Documents } from './payload/collections/Documents'
import { CarePlans } from './payload/collections/CarePlans'
import { Media }     from './payload/collections/Media'
import { Pages }     from './payload/collections/Pages'

// Globals
import { SiteSettings } from '@/payload/globals/SiteSettings'
import { Navigation }   from '@/payload/globals/Navigation'

export default buildConfig({

  // ── Admin ──────────────────────────────────────────────
  admin: {
    user:     Users.slug,
    meta: {
      titleSuffix: '– PflegePlus Admin',
    },
  },

  // ── Editor ─────────────────────────────────────────────
  editor: slateEditor({}),

  // ── Database ───────────────────────────────────────────
  db: mongooseAdapter({
    url: process.env.MONGODB_URI as string,
  }),

  // ── Collections ────────────────────────────────────────
  collections: [
    Users, Patients, Staff,
    Documents, CarePlans,
    Media, Pages,
  ],

  // ── Globals ────────────────────────────────────────────
  globals: [SiteSettings, Navigation],

  // ── Frontend Localization ──────────────────────────────
  localization: {
    locales: [
      { label: 'Deutsch',   code: 'de' },
      { label: 'English',   code: 'en' },
      { label: 'Italiano',  code: 'it' },
      { label: 'Español',   code: 'es' },
      { label: 'Português', code: 'pt' },
      { label: 'Türkçe',    code: 'tr' },
    ],
    defaultLocale: 'de',
    fallback:      true,
  },

  // ── Upload ─────────────────────────────────────────────
  upload: {
    limits: { fileSize: 10_000_000 },
  },

  // ── Security ───────────────────────────────────────────
  secret: process.env.PAYLOAD_SECRET as string,
  csrf:   [
    process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
    'http://localhost:3000',
  ],

  // ── TypeScript output ──────────────────────────────────
  typescript: {
    outputFile: path.resolve(__dirname, 'src/types/payload-types.ts'),
  },

  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
})