import { Testimonial } from '@/src/types/testimonial'

export async function getFeaturedTestimonials(): Promise<Testimonial[]> {
  const baseUrl =
    process.env.NEXT_PUBLIC_PAYLOAD_URL ??
    process.env.SERVER_URL ??
    'http://localhost:3000'

  const url = `${baseUrl}/api/testimonials?where[featured][equals]=true&limit=3&sort=-createdAt&depth=1`

  const res = await fetch(url, { cache: 'no-store' })

  if (!res.ok) {
    throw new Error(`Testimonials API responded with status ${res.status}`)
  }

  const data = await res.json()
  return data.docs as Testimonial[]
}

/** Seed data used as fallback during development */
export const seedTestimonials: Testimonial[] = [
  {
    id: '1',
    familyName: 'The Hartwell Family',
    avatarInitials: 'HF',
    location: 'Portland, Oregon',
    statement:
      'We searched for months before finding exactly what we needed. The entire process was seamless from start to finish — every question answered promptly, every concern addressed with genuine care. Our children are thriving and we couldn\'t be happier.',
    rating: 5,
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    familyName: 'The Okonkwo Family',
    avatarInitials: 'OK',
    location: 'Austin, Texas',
    statement:
      'As a family of five with specific accessibility needs, we were nervous about the whole journey. The team went above and beyond — even suggesting things we hadn\'t thought to ask. We felt seen, heard, and genuinely supported every step of the way.',
    rating: 5,
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    familyName: 'The Nakamura Family',
    avatarInitials: 'NK',
    location: 'Seattle, Washington',
    statement:
      'After two previous disappointing experiences elsewhere, we were skeptical. But from our very first call, the difference was clear. The attention to detail, the responsiveness, the warmth — this is what exceptional service actually looks like.',
    rating: 5,
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]
