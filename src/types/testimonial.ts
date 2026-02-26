export interface Media {
  id: string
  url: string
  alt?: string
  width?: number
  height?: number
}

export interface Testimonial {
  id: string
  familyName: string
  avatarInitials?: string
  location?: string
  statement: string
  rating: number
  avatar?: Media
  featured?: boolean
  createdAt: string
  updatedAt: string
}

export interface TestimonialsResponse {
  docs: Testimonial[]
  totalDocs: number
  limit: number
  page: number
  totalPages: number
}
