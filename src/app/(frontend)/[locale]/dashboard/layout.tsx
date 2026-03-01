import { requireAuth } from '@/src/lib/auth/session';
import DashboardSidebar from '@/src/app/(frontend)/[locale]/dashboard/DashboardSidebar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Server-side auth guard – redirects to /de/login if no session
  await requireAuth('/de/login')

  return (
    <div className="flex min-h-screen bg-stone-50">
      {/* Sidebar (relative positioned for collapse toggle) */}
      <div className="relative">
        <DashboardSidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-0">
        {children}
      </div>
    </div>
  )
}