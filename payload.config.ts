import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Collections
import { Users }     from './payload/collections/Users'
import { Patients }  from './payload/collections/Patients'
import { Staff }     from './payload/collections/Staff'
import { Documents } from './payload/collections/Documents'
import { CarePlans } from './payload/collections/CarePlans'
import { Media }     from './payload/collections/Media'
import { Pages }     from './payload/collections/Pages'
import  Testimonials from './payload/collections/Testimonials'
import sharp from 'sharp'
// Globals
import { SiteSettings } from './payload/globals/SiteSettings'
import { Navigation }   from './payload/globals/Navigation'

export default buildConfig({

  // ── Admin ──────────────────────────────────────────────
  admin: {
    user:     Users.slug,
    meta: {
      titleSuffix: '– Viconia Care Admin',
    },
  },

  // ── Editor ─────────────────────────────────────────────
  editor: lexicalEditor({}),

  // ── Database ───────────────────────────────────────────
  db: mongooseAdapter({
    url: process.env.DATABASE_URL as string,
  }),

  sharp,

  // ── Collections ────────────────────────────────────────
  collections: [
    Users, Patients, Staff,
    Documents, CarePlans,
    Media, Pages, Testimonials
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

  defaultDepth: 2,

  // ── Security ───────────────────────────────────────────
  secret: process.env.PAYLOAD_SECRET as string,
  csrf:   [
    process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
    'http://localhost:3000',
  ],

  // ── TypeScript output ──────────────────────────────────
  typescript: {
    outputFile: path.resolve(__dirname, 'src/types/payload-types'),
  },

  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
})