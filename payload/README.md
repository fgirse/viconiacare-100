# Testimonials Section — Payload CMS + Next.js + Tailwind + TypeScript

## File Structure

```
├── collections/
│   └── Testimonials.ts          # Payload CMS collection config
├── types/
│   └── testimonial.ts           # TypeScript interfaces
├── lib/
│   └── getTestimonials.ts       # Data fetching + seed fallback data
├── components/
│   ├── TestimonialsSection.tsx  # Server Component — layout & data loading
│   └── TestimonialCard.tsx      # Client Component — individual card UI
└── app/
    └── page.tsx                 # Example usage
```

## Setup

### 1. Register the Payload collection

In your `payload.config.ts`:

```ts
import Testimonials from './collections/Testimonials'

export default buildConfig({
  collections: [
    // ...existing collections
    Testimonials,
    Media,          // make sure Media collection exists for avatars
  ],
})
```

### 2. Environment variable

Add to `.env.local`:

```
NEXT_PUBLIC_PAYLOAD_URL=http://localhost:3001
```

### 3. Add to your page

```tsx
import TestimonialsSection from '@/components/TestimonialsSection'

export default function Page() {
  return <main><TestimonialsSection /></main>
}
```

### 4. Seed content in Payload Admin

Go to `/admin` → **Testimonials** → create three entries and check **Featured** on each.

Fields per testimonial:
| Field | Example |
|---|---|
| Family Name | The Hartwell Family |
| Avatar Initials | HF |
| Location | Portland, Oregon |
| Statement | *Your testimonial text* |
| Rating | 5 |
| Featured | ✅ |

> **Development fallback**: If Payload is unreachable, `seedTestimonials` in `lib/getTestimonials.ts` are used automatically — no empty states during local dev.

## Design

- **Theme**: Dark / editorial (`stone-950` background)
- **Accent colors**: Amber, Emerald, Rose — one per card
- **Typography**: Relies on Tailwind defaults; swap `font-serif` class on the quote mark for a custom Google Font
- **Hover effects**: Card lifts, accent bar extends, border lightens
- **ISR**: Testimonials revalidate every hour (`next: { revalidate: 3600 }`)
