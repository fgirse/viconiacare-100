/**
 * Fallback media route
 *
 * Payload is configured with `staticDir: 'media'`, so it serves uploaded files
 * from `<root>/media/` at `/api/media/file/[filename]`.
 * Those files were never placed in that directory – the originals live in
 * `public/images/`.
 *
 * This route:
 *   1. Tries to serve the exact filename from `public/images/`
 *   2. If not found, strips Payload resize suffixes (e.g. `-400x300`, `-768x1024`)
 *      and tries the base name
 *   3. Returns 404 if still not found
 *
 * Because this is a specific dynamic route (`[filename]`) it takes priority over
 * Payload's catch-all (`(payload)/api/[...slug]`) for these paths.
 */

import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'

const IMAGES_DIR = path.join(process.cwd(), 'public', 'images')

const MIME: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  avif: 'image/avif',
  svg: 'image/svg+xml',
  gif: 'image/gif',
  ico: 'image/x-icon',
  pdf: 'application/pdf',
}

/** Strip Payload-generated size suffixes, e.g. `foo-400x300.png` → `foo.png` */
function stripSizeSuffix(filename: string): string {
  return filename.replace(/-\d+x\d+(\.[^.]+)$/, '$1')
}



async function tryRead(filename: string): Promise<Buffer | null> {
  try {
    return await readFile(path.join(IMAGES_DIR, filename))
  } catch {
    return null
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ filename: string }> },
) {
  const { filename } = await params

  // 1. Exact match
  let buf = await tryRead(filename)

  // 2. Base name (strip resize suffix)
  if (!buf) {
    const base = stripSizeSuffix(filename)
    if (base !== filename) buf = await tryRead(base)
  }

  if (!buf) {
    return new NextResponse('Not found', { status: 404 })
  }

  const ext = path.extname(filename).slice(1).toLowerCase()
  const mime = MIME[ext] ?? 'application/octet-stream'

  return new NextResponse(new Uint8Array(buf), {
    status: 200,
    headers: {
      'Content-Type': mime,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
