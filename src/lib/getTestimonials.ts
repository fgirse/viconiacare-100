import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Testimonial } from '@/src/types/testimonial'

export async function getFeaturedTestimonials(): Promise<Testimonial[]> {
  const payload = await getPayload({ config: configPromise })

  const data = await payload.find({
    collection: 'testimonials',
    where: {
      featured: { equals: true },
    },
    limit: 3,
    sort: '-createdAt',
  })

  // Cast to our local Testimonial type
  return data.docs as unknown as Testimonial[]
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
