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
    depth: 1,
  })

  return data.docs as unknown as Testimonial[]
}
