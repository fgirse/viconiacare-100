import { requireAdmin } from '@/src/lib/auth/admin'
import AdminSidebar from '@/src/components/admin/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin('de')

  return (
    <div className="flex min-h-screen bg-stone-900">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-0 overflow-x-hidden">
        {children}
      </div>
    </div>
  )
}