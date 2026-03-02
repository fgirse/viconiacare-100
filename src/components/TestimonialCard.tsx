'use client'

import Image from 'next/image'
import { Testimonial } from '@/src/types/testimonial'

interface TestimonialCardProps {
  testimonial: Testimonial
  index: number
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`Rating: ${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`w-4 h-4 transition-colors ${
            i < rating ? 'text-amber-400' : 'text-stone-700'
          }`}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function TestimonialCard({ testimonial, index }: TestimonialCardProps) {
  return (
    <article
      className={`
        group relative flex flex-col gap-6 rounded-2xl
        bg-stone-900 border border-stone-800
        p-8 overflow-hidden
        transition-all duration-500
        hover:-translate-y-1 hover:border-stone-700 hover:shadow-2xl hover:shadow-black/40
      `}
      style={{ animationDelay: `${index * 120}ms` }}
    >
      {/* Accent bar */}
      <span
        className={`absolute top-0 left-8 w-12 h-0.5 rounded-full
          ${index === 0 ? 'bg-amber-400' : index === 1 ? 'bg-emerald-400' : 'bg-rose-400'}
          transition-all duration-500 group-hover:w-20`}
      />

      {/* Quote mark */}
      <span
        className="absolute -top-4 -right-2 text-[9rem] leading-none font-serif
          text-stone-800 select-none pointer-events-none transition-colors
          group-hover:text-stone-700"
        aria-hidden="true"
      >
        &ldquo;
      </span>

      {/* Stars */}
      <StarRating rating={testimonial.rating} />

      {/* Statement */}
      <blockquote className="relative z-10">
        <p className="text-stone-300 text-base leading-relaxed font-light italic tracking-wide">
          &ldquo;{testimonial.statement}&rdquo;
        </p>
      </blockquote>

      {/* Author */}
      <footer className="flex items-center gap-4 mt-auto pt-4 border-t border-stone-800">
        {testimonial.avatar?.url ? (
          <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-stone-700 shrink-0">
            <Image
              src={testimonial.avatar.url}
              alt={testimonial.familyName}
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>
        ) : (
          <div
            className={`w-12 h-12 rounded-full shrink-0 flex items-center justify-center
              text-sm font-semibold tracking-widest text-stone-900
              ${index === 0 ? 'bg-amber-400' : index === 1 ? 'bg-emerald-400' : 'bg-rose-400'}`}
          >
            {testimonial.avatarInitials ?? testimonial.familyName.slice(0, 2).toUpperCase()}
          </div>
        )}
        <div>
          <p className="text-white font-semibold text-sm tracking-wide">
            {testimonial.familyName}
          </p>
          {testimonial.location && (
            <p className="text-stone-500 text-xs mt-0.5 tracking-wider uppercase">
              {testimonial.location}
            </p>
          )}
        </div>
      </footer>
    </article>
  )
}
