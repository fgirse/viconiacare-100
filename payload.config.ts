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
import { resendAdapter } from '@payloadcms/email-resend'

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
    Users, Patients, Staff,
    Documents, CarePlans,
    Media, Pages, Services, Testimonials
  ],

  // ── Globals ────────────────────────────────────────────
  globals: [SiteSettings, Navigation],

  // ── email ────────────────────────────────────────────
  email: resendAdapter({
    defaultFromAddress: 'no-reply@viconiacare.de',
    defaultFromName: 'Viconia Care GmbH',
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
    ],
    defaultLocale: 'de',
    fallback: true,
  },
  // ── i18n ─────────────────────────────────────────────
  i18n: { supportedLanguages: { de, en, fr, it, es, pt, tr }, fallbackLanguage: 'de' },

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