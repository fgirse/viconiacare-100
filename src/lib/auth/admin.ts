import { getSession } from './session'
import { redirect } from 'next/navigation'

/** Require admin or superadmin – redirect to dashboard if insufficient role */
export async function requireAdmin(locale = 'de') {
  const session = await getSession()
  if (!session) redirect(`/${locale}/login`)
  if (!['admin', 'superadmin'].includes(session.role)) {
    redirect(`/${locale}/dashboard`)
  }
  return session
}

export async function requireSuperAdmin(locale = 'de') {
  const session = await getSession()
  if (!session) redirect(`/${locale}/login`)
  if (session.role !== 'superadmin') redirect(`/${locale}/admin`)
  return session
}
