import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Testimonial } from '@/src/types/testimonial'

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
  const payload = await getPayload({ config: configPromise })

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

  // Normalise avatar URLs so Next.js <Image> receives relative paths for
  // self-hosted media (avoids the private-IP SSRF block in Next.js 15+).
  return docs.map((t) => ({
    ...t,
    avatar: t.avatar
      ? { ...t.avatar, url: toRelativeMediaUrl(t.avatar.url) ?? t.avatar.url }
      : t.avatar,
  }))
}
