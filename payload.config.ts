import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'
import { de } from '@payloadcms/translations/languages/de'
import { en } from '@payloadcms/translations/languages/en'
import { fr } from '@payloadcms/translations/languages/fr'
import { it } from '@payloadcms/translations/languages/it'
import { es } from '@payloadcms/translations/languages/es'
import { pt } from '@payloadcms/translations/languages/pt'
import { tr } from '@payloadcms/translations/languages/tr'
import { uk } from '@payloadcms/translations/languages/uk'
import { ru } from '@payloadcms/translations/languages/ru'
import { resendAdapter } from '@payloadcms/email-resend'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const resendFromAddress = process.env.RESEND_FROM_ADDRESS ?? 'onboarding@resend.dev'
const resendFromName = process.env.RESEND_FROM_NAME ?? 'Viconia Care GmbH'

// Collections
import { Users }     from './payload/collections/Users'
import { Patients }  from './payload/collections/Patients'
import { Staff }     from './payload/collections/Staff'
import { ShiftPlans} from './payload/collections/ShiftPlans'
import { Documents } from './payload/collections/Documents'
import { CarePlans } from './payload/collections/CarePlans'
import { CareSchedules } from './payload/collections/CareSchedules'
import { Invoices } from './payload/collections/Invoices'
import { ServiceRecords } from './payload/collections/ServiceRecords'
import { Media }     from './payload/collections/Media'
import { Pages }     from './payload/collections/Pages'
import { Receivables }    from './payload/collections/Receivables'
import { Routes }    from './payload/collections/Routes'
import { TimeTracking }   from './payload/collections/TimeTracking'
import  Testimonials from './payload/collections/Testimonials'
import Services from '@/payload/collections/Services'
import sharp from 'sharp'
// Globals
import { SiteSettings } from './payload/globals/SiteSettings'
import { Navigation }   from './payload/globals/Navigation'

// Image storage with Vercel Blob
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'




export default buildConfig({
  // ── Admin ──────────────────────────────────────────────
  admin: {
    user: Users.slug,
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
    Users, Patients, Staff, ShiftPlans,
    Documents, CarePlans, CareSchedules, Invoices, ServiceRecords, Receivables,
    Media, Pages, Routes, Services, Testimonials, TimeTracking
  ],

  // ── Globals ────────────────────────────────────────────
  globals: [SiteSettings, Navigation],

  // ── email ────────────────────────────────────────────
  email: resendAdapter({
    defaultFromAddress: resendFromAddress,
    defaultFromName: resendFromName,
    apiKey: process.env.RESEND_API_KEY ?? '',
  }),

  // ── Frontend Localization ──────────────────────────────
  localization: {
    locales: [
      { label: 'Deutsch',    code: 'de' },
      { label: 'English',    code: 'en' },
      { label: 'Français',   code: 'fr' },
      { label: 'Italiano',   code: 'it' },
      { label: 'Español',    code: 'es' },
      { label: 'Português',  code: 'pt' },
      { label: 'Türkçe',     code: 'tr' },
      { label: 'Українська', code: 'uk' },
      { label: 'Русский',    code: 'ru' },
    ],
    defaultLocale: 'de',
    fallback: true,
  },
  // ── i18n ─────────────────────────────────────────────
  i18n: { supportedLanguages: { de, en, fr, it, es, pt, tr, uk, ru }, fallbackLanguage: 'de' },

  // ── Server URL ─────────────────────────────────────────────
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',


  // ── Upload ─────────────────────────────────────────────
  upload: {
    limits: { fileSize: 10000000 },
  },

  defaultDepth: 2,

  // ── PluginsStorage ─────────────────────────────────────────────
  plugins: [
    vercelBlobStorage({
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN,
      // Bypass Vercel's 4.5 MB serverless body limit:
      // the browser uploads directly to Vercel Blob instead of routing
      // through the Next.js API function.
      clientUploads: true,
    }),
  ],

  // ── Security ───────────────────────────────────────────
  secret: process.env.PAYLOAD_SECRET as string,
  csrf: [
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