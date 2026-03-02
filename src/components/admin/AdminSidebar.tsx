'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/src/lib/utils/utils'
import { useAuthState } from '@/src/hooks/useAuth'

const NAV = [
  { href: '/de/admin',          icon: '◈',  label: 'Übersicht',           exact: true },
  { href: '/de/admin/patients', icon: '⬡',  label: 'Patienten'            },
  { href: '/de/admin/staff',    icon: '◉',  label: 'Mitarbeiter'          },
  { href: '/de/admin/calendar', icon: '▦',  label: 'Kalender'             },
  { href: '/de/dashboard',      icon: '↗',  label: 'Zum Portal',  divider: true },
]

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuthState()

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href)

  return (
    <>
      {/* ── Desktop sidebar ───────────────────────────────────── */}
      <aside className={cn(
        'hidden lg:flex flex-col flex-shrink-0 transition-all duration-300 relative',
        'bg-stone-950 border-r border-stone-800',
        collapsed ? 'w-[64px]' : 'w-[220px]',
      )}>

        {/* Logo */}
        <div className={cn(
          'flex items-center gap-3 border-b border-stone-800/80',
          collapsed ? 'px-4 py-5 justify-center' : 'px-5 py-5',
        )}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-base flex-shrink-0 font-black text-white">
            +
          </div>
          {!collapsed && (
            <div>
              <p className="font-display text-[1rem] font-black text-white leading-none">
                Pflege<span className="text-teal-400">Plus</span>
              </p>
              <p className="text-[0.6rem] font-bold uppercase tracking-[0.15em] text-stone-500 mt-0.5">
                Admin
              </p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-5 px-2.5 flex flex-col gap-0.5">
          {NAV.map((item) => {
              const active = isActive(item.href, item.exact)
              return (
                <div key={item.href}>
                {item.divider && (
                  <div className="my-2 border-t border-stone-800/60" />
                )}
                <Link
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    'flex items-center gap-3 rounded-xl transition-all duration-150',
                    collapsed ? 'px-0 py-2.5 justify-center' : 'px-3 py-2.5',
                    active
                      ? 'bg-teal-500/15 text-teal-400'
                      : 'text-stone-400 hover:bg-stone-800/60 hover:text-stone-200',
                  )}
                >
                  <span className={cn(
                    'text-lg leading-none flex-shrink-0 transition-all',
                    active ? 'text-teal-400' : '',
                  )}>
                    {item.icon}
                  </span>
                  {!collapsed && (
                    <span className="text-[0.82rem] font-bold tracking-wide">
                      {item.label}
                    </span>
                  )}
                  {active && !collapsed && (
                    <span className="ml-auto w-1 h-4 rounded-full bg-teal-500" />
                  )}
                </Link>
              </div>
            )
          })}
        </nav>

        {/* User footer */}
        <div className="border-t border-stone-800/80 p-2.5">
          {user && !collapsed && (
            <div className="px-3 py-2 mb-1">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-teal-600 flex items-center justify-center text-[0.65rem] font-black text-white flex-shrink-0">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </div>
                <div className="min-w-0">
                  <p className="text-[0.75rem] font-bold text-stone-300 truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-[0.62rem] text-stone-600 capitalize">{user.role}</p>
                </div>
              </div>
            </div>
          )}
          <button
            onClick={logout}
            title={collapsed ? 'Abmelden' : undefined}
            className={cn(
              'w-full flex items-center gap-3 rounded-xl py-2.5 text-[0.78rem] font-bold',
              'text-stone-600 hover:bg-red-950/50 hover:text-red-400 transition-all',
              collapsed ? 'justify-center px-0' : 'px-3',
            )}
          >
            <span className="text-base leading-none">⏻</span>
            {!collapsed && 'Abmelden'}
          </button>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(v => !v)}
          className="absolute -right-3 top-[72px] w-6 h-6 rounded-full
                     bg-stone-800 border border-stone-700 text-stone-400
                     hover:text-teal-400 hover:border-teal-600 transition-all
                     flex items-center justify-center text-[0.7rem] font-black z-10"
        >
          {collapsed ? '›' : '‹'}
        </button>
      </aside>

      {/* ── Mobile bottom nav ─────────────────────────────────── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50
                      bg-stone-950/95 backdrop-blur-xl border-t border-stone-800 flex">
        {NAV.filter(n => !n.divider).slice(0, 4).map(item => {
          const active = isActive(item.href, item.exact)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex-1 flex flex-col items-center gap-1 py-3',
                'text-[0.58rem] font-bold uppercase tracking-wide transition-colors',
                active ? 'text-teal-400' : 'text-stone-600',
              )}
            >
              <span className="text-xl leading-none">{item.icon}</span>
              {item.label.split(' ')[0]}
            </Link>
          )
        })}
      </nav>
    </>
  )
}
