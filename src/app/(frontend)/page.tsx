import { redirect } from 'next/navigation'
import { defaultLocale } from '@/src/i18n/config';

// Redirect / → /de  (or /en etc. based on defaultLocale)
export default function RootPage() {
  redirect(`/${defaultLocale}`)
}