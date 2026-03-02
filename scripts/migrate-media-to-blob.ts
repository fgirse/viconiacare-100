/**
 * migrate-media-to-blob.ts
 *
 * One-shot script: uploads every media file that still points to a localhost
 * URL into Vercel Blob, then patches the MongoDB document so the next deploy
 * returns the real Blob URL.
 *
 * Usage (run ONCE, locally, with the dev server stopped):
 *   bun scripts/migrate-media-to-blob.ts
 *
 * Requirements:
 *   – BLOB_READ_WRITE_TOKEN set in .env
 *   – DATABASE_URL set in .env (MongoDB Atlas)
 *   – Files are findable relative to public/images/
 */

import 'dotenv/config'
import { put, list } from '@vercel/blob'
import { readFileSync, existsSync } from 'fs'
import path from 'path'
import { getPayload } from 'payload'
import configPromise from '../payload.config'

const ROOT = path.resolve(process.cwd())

// Where we look for the raw files (in order of priority)
const SEARCH_DIRS = [
  path.join(ROOT, 'public', 'images'),
  path.join(ROOT, 'media'),
  path.join(ROOT, 'uploads'),
]

function findFile(filename: string): string | null {
  for (const dir of SEARCH_DIRS) {
    const p = path.join(dir, filename)
    if (existsSync(p)) return p
  }
  return null
}

function isLocalhostUrl(url: string | null | undefined): boolean {
  if (!url) return false
  return url.startsWith('http://localhost') || url.startsWith('http://127.0.0.1')
}

async function main() {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) {
    console.error('❌  BLOB_READ_WRITE_TOKEN is not set in .env')
    process.exit(1)
  }

  // ── 1. Build a map of filename → existing Blob URL ────────────────────────
  console.log('☁️   Listing existing Vercel Blob objects…')
  const blobMap = new Map<string, string>()
  let cursor: string | undefined
  do {
    const page = await list({ token, cursor, limit: 1000 })
    for (const blob of page.blobs) {
      const name = blob.pathname.split('/').pop()!
      blobMap.set(name, blob.url)
      console.log(`  found  ${name}  →  ${blob.url}`)
    }
    cursor = page.cursor
  } while (cursor)
  console.log(`\n  ${blobMap.size} blob(s) already in store\n`)

  // ── 2. Connect Payload / MongoDB ──────────────────────────────────────────
  console.log('🔌  Connecting to Payload / MongoDB…')
  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'media',
    limit: 200,
    depth: 0,
    overrideAccess: true,
  })

  console.log(`📋  Found ${docs.length} media document(s)\n`)

  let migrated = 0
  let skipped = 0
  let failed = 0

  for (const doc of docs) {
    const raw = doc as unknown as { id: string; filename?: string; url?: string; mimeType?: string }
    const { id, filename, url, mimeType } = raw

    if (!isLocalhostUrl(url)) {
      console.log(`  ✅  skip  ${filename ?? id} (already a remote URL)`)
      skipped++
      continue
    }

    if (!filename) {
      console.warn(`  ⚠️   skip  id=${id} (no filename)`)
      skipped++
      continue
    }

    // Reuse an already-uploaded blob to avoid duplicate errors
    let blobUrl = blobMap.get(filename)

    if (!blobUrl) {
      const localPath = findFile(filename)
      if (!localPath) {
        console.warn(`  ⚠️   skip  ${filename} (not found in search dirs and not in blob)`)
        failed++
        continue
      }

      console.log(`  ⬆️   uploading  ${filename}  …`)
      try {
        const buffer = readFileSync(localPath)
        const blob = await put(filename, buffer, {
          access: 'public',
          contentType: mimeType ?? 'application/octet-stream',
          token,
          allowOverwrite: true,
        })
        blobUrl = blob.url
      } catch (err) {
        console.error(`  ❌  upload failed  ${filename}`, err)
        failed++
        continue
      }
    } else {
      console.log(`  ♻️   reusing existing blob  ${filename}`)
    }

    console.log(`       patching DB  →  ${blobUrl}`)
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = payload.db as any
      await db.collections['media'].updateOne(
        { _id: id },
        { $set: { url: blobUrl } },
      )
      migrated++
    } catch (err) {
      console.error(`  ❌  DB patch failed  ${filename}`, err)
      failed++
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`✅  migrated : ${migrated}`)
  console.log(`⏭   skipped  : ${skipped}`)
  console.log(`❌  failed   : ${failed}`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  if (failed > 0) process.exit(1)
  process.exit(0)
}

main().catch((err) => {
  console.error('Fatal:', err)
  process.exit(1)
})
