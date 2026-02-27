import { getFeaturedTestimonials } from '@/src/lib/getTestimonials'
import { Testimonial } from '@/src/types/testimonial'
import TestimonialCard from './TestimonialCard'

async function loadTestimonials(): Promise<Testimonial[]> {
  try {
    return await getFeaturedTestimonials()
  } catch (err) {
    console.error('[TestimonialsSection] Failed to load testimonials:', err)
    return []
  }
}

export default async function TestimonialsSection() {
  const testimonials = await loadTestimonials()

  if (testimonials.length === 0) return null

  return (
    <section
      id="testimonials"
      className="mb-[20vh] relative top-[20vh] w-[100vw] bg-teal-800/60 py-28 px-6 overflow-hidden"
      aria-labelledby="testimonials-heading"
    >
      {/* Ambient background glow */}
      <div
        className="pointer-events-none absolute inset-0 -z-0"
        aria-hidden="true"
      >
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-400/30 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 max-w-xl">
          <p className="text-amber-400 text-xs font-semibold tracking-[0.3em] uppercase mb-4">
            Familien die uns vertrauen und ihre Geschichte teilen.
          </p>
          <h2
            id="testimonials-heading"
            className="text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight"
          >
            Reale Geschichten von{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-yellow-400">
              echten Familien
            </span>
          </h2>
          <p className="mt-5 text-stone-400 text-lg leading-relaxed font-light">
            Jede Familie hat ihre einzigartige Geschichte. Hier sind einige der Geschichten, die wir teilen dürfen.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              index={index}
            />
          ))}
        </div>

        {/* Footer note */}
        <p className="mt-12 text-center text-stone-200 text-sm tracking-wide">
          Treffen Sie uns und teilen Sie Ihre Geschichte – wir freuen uns darauf, von Ihnen zu hören!
        </p>
      </div>
    </section>
  )
}
