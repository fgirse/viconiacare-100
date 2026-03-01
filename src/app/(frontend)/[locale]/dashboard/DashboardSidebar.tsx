'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/src/lib/utils/utils'
import { Avatar, AvatarFallback } from '@/src/components/ui/avatar';
import { useAuthState } from '@/src/hooks/useAuth';
import Image from 'next/image'

import Logo from '@/public/images/ViconiaCareLogoobg.svg'
const NAV_ITEMS = [
  { href: '/de/dashboard',              icon: '🏠', label: 'Übersicht'     },
  { href: '/de/dashboard/appointments', icon: '📅', label: 'Termine'       },
  { href: '/de/dashboard/careplan',     icon: '📋', label: 'Pflegeplan'    },
  { href: '/de/dashboard/documents',    icon: '📄', label: 'Dokumente'     },
  { href: '/de/dashboard/profile',      icon: '👤', label: 'Mein Profil'   },
]

export default function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuthState()

  return (
    <>
      {/* ── Desktop Sidebar ────────────────────────────────────── */}
      <aside className={cn(
        'hidden lg:flex flex-col bg-white border-r border-stone-100 transition-all duration-300 flex-shrink-0',
        collapsed ? 'w-[72px]' : 'w-[240px]'
      )}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-6 border-b border-stone-100">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
            <Image src={Logo} alt="Logo" width={32} height={32} className="rounded-xl" />
          </div>
          {!collapsed && (
            <span className="font-passionate text-xl font-bold text-yellow-600">
              ViconiaCare
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-6 px-3 flex flex-col gap-1">
          {NAV_ITEMS.map(item => {
            const active = pathname === item.href || (item.href !== '/de/dashboard' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-200',
                  'text-[0.82rem] font-bold',
                  active
                    ? 'bg-teal-50 text-teal-700 shadow-[inset_0_0_0_1.5px_theme(colors.teal.200)]'
                    : 'text-stone-500 hover:bg-stone-50 hover:text-stone-800'
                )}
                title={collapsed ? item.label : undefined}
              >
                <span className="text-[1.1rem] flex-shrink-0">{item.icon}</span>
                {!collapsed && item.label}
                {active && !collapsed && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-500" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* User + Logout */}
        <div className="border-t border-stone-100 p-3">
          {user && !collapsed && (
            <div className="flex items-center gap-2.5 px-2 py-2 mb-1">
              <Avatar size="sm">
                <AvatarFallback className="bg-teal-100 text-teal-700 font-bold">
                  {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-[0.8rem] font-bold text-stone-800 truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-[0.7rem] text-stone-400 truncate">{user.email}</p>
              </div>
            </div>
          )}
          <button
            onClick={logout}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-[0.82rem] font-bold',
              'text-stone-400 hover:bg-red-50 hover:text-red-600 transition-all duration-200'
            )}
            title={collapsed ? 'Abmelden' : undefined}
          >
            <span className="text-[1.1rem]">🚪</span>
            {!collapsed && 'Abmelden'}
          </button>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(v => !v)}
          className="absolute top-[76px] -right-3 w-6 h-6 rounded-full bg-white border border-stone-200 shadow-sm flex items-center justify-center text-stone-400 hover:text-teal-600 transition-colors"
          aria-label={collapsed ? 'Sidebar öffnen' : 'Sidebar schließen'}
        >
          {collapsed ? '›' : '‹'}
        </button>
      </aside>

      {/* ── Mobile Bottom Nav ──────────────────────────────────── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-stone-100 z-50 flex">
        {NAV_ITEMS.slice(0, 5).map(item => {
          const active = pathname === item.href || (item.href !== '/de/dashboard' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex-1 flex flex-col items-center gap-1 py-3 text-[0.6rem] font-bold uppercase tracking-wide transition-colors',
                active ? 'text-teal-600' : 'text-stone-400'
              )}
            >
              <span className={cn('text-xl', active && 'scale-110 transition-transform')}>{item.icon}</span>
              {item.label.split(' ')[0]}
            </Link>
          )
        })}
      </nav>
    </>
  )
}
