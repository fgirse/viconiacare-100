import { redirect } from 'next/navigation'
import { defaultLocale } from '@/src/i18n/config'

// Redirect / → /de (or whatever the default locale is)
export default function RootPage() {
  redirect(`/${defaultLocale}`

    
  )
}