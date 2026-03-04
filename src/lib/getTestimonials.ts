import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { list } from '@vercel/blob'
import { Testimonial } from '@/src/types/testimonial'

const BLOB_PREFIX = 'viconiacare/testimonials/'

/** Normalise a family name to the expected blob filename stem.
 *  e.g. "Uwe Seeler" → "uwe_seeler"
 */
function toBlobStem(familyName: string): string {
  return familyName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_-]/g, '')
}

/** Fetch a name→URL map from Vercel Blob for the testimonials prefix. */
async function getBlobAvatarMap(): Promise<Record<string, string>> {
  try {
    const { blobs } = await list({ prefix: BLOB_PREFIX })
    const map: Record<string, string> = {}
    for (const blob of blobs) {
      // pathname after the prefix, e.g. "uwe_seeler.png"
      const filename = blob.pathname.slice(BLOB_PREFIX.length)
      const stem = filename.replace(/\.[^.]+$/, '') // strip extension
      if (stem) map[stem] = blob.url
    }
    return map
  } catch {
    return {}
  }
}

/**
 * Converts localhost media URLs to relative paths.
 * Next.js image optimiser blocks requests that resolve to private IPs
 * (e.g. localhost / 127.0.0.1) even when the hostname is in remotePatterns.
 * Relative paths bypass the SSRF check in development.
 * In production, absolute URLs are kept as-is — the production hostname is
 * already listed in next.config remotePatterns, and converting to a relative
 * path would cause the image optimiser to make a loopback request that fails
 * in most hosting environments.
 */
function toRelativeMediaUrl(url: string | undefined): string | undefined {
  if (!url) return url
  try {
    const parsed = new URL(url)
    const isLocalhost =
      parsed.hostname === 'localhost' ||
      parsed.hostname === '127.0.0.1' ||
      parsed.hostname === '::1'
    if (isLocalhost) {
      return parsed.pathname + parsed.search
    }
  } catch {
    // not a valid absolute URL – return as-is
  }
  return url
}

export async function getFeaturedTestimonials(): Promise<Testimonial[]> {
  const [payload, blobMap] = await Promise.all([
    getPayload({ config: configPromise }),
    getBlobAvatarMap(),
  ])

  const data = await payload.find({
    collection: 'testimonials',
    where: {
      featured: { equals: true },
    },
    limit: 3,
    sort: '-createdAt',
    depth: 1,
  })

  const docs = data.docs as unknown as Testimonial[]

  return docs.map((t) => {
    // 1. Prefer an explicitly stored avatar URL (normalised for localhost)
    let avatarUrl = toRelativeMediaUrl(t.avatar?.url)

    // 2. Fall back to Vercel Blob image matched by family name
    if (!avatarUrl) {
      const stem = toBlobStem(t.familyName)
      avatarUrl = blobMap[stem]
    }

    return {
      ...t,
      avatar: avatarUrl
        ? { id: t.avatar?.id ?? t.id, url: avatarUrl, alt: t.familyName }
        : t.avatar,
    }
  })
}
