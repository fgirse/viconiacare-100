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
