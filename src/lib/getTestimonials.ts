import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Testimonial } from '@/src/types/testimonial'

/**
 * Converts absolute self-hosted media URLs to relative paths.
 * Next.js image optimiser blocks requests that resolve to private IPs
 * (e.g. localhost / 127.0.0.1) even when the hostname is in remotePatterns.
 * Relative paths bypass the SSRF check while still working in all environments.
 */
function toRelativeMediaUrl(url: string | undefined): string | undefined {
  if (!url) return url
  try {
    const parsed = new URL(url)
    const serverOrigin = process.env.NEXT_PUBLIC_SERVER_URL
      ? new URL(process.env.NEXT_PUBLIC_SERVER_URL).origin
      : null
    const isLocalhost =
      parsed.hostname === 'localhost' ||
      parsed.hostname === '127.0.0.1' ||
      parsed.hostname === '::1'
    const isSelf = serverOrigin ? parsed.origin === serverOrigin : false
    if (isLocalhost || isSelf) {
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
