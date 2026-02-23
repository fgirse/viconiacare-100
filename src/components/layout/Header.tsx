'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { cn } from '@/src/lib/utils/utils'

// ── Types ─────────────────────────────────────────────────────────────────────
interface NavItem {
  label: string
  href: string
}

interface LangOption {
  code: string
  label: string
  flag: string
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Leistungen', href: '#services' },
  { label: 'Über uns',   href: '#why-us'   },
  { label: 'Termin',     href: '#booking'  },
  { label: 'Kontakt',    href: '#contact'  },
]

const LANGUAGES: LangOption[] = [
  { code: 'de', label: 'Deutsch',   flag: '🇩🇪' },
  { code: 'en', label: 'English',   flag: '🇬🇧' },
  { code: 'it', label: 'Italiano',  flag: '🇮🇹' },
  { code: 'es', label: 'Español',   flag: '🇪🇸' },
  { code: 'pt', label: 'Português', flag: '🇵🇹' },
  { code: 'tr', label: 'Türkçe',    flag: '🇹🇷' },
]

// ── Header ────────────────────────────────────────────────────────────────────
export default function Header() {
  const [scrolled,     setScrolled]     = useState(false)
  const [menuOpen,     setMenuOpen]     = useState(false)
  const [langOpen,     setLangOpen]     = useState(false)
  const [activeLang,   setActiveLang]   = useState<LangOption>(LANGUAGES[0])
  const langRef = useRef<HTMLDivElement>(null)

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close lang dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const handleNavClick = (href: string) => {
    setMenuOpen(false)
    if (href.startsWith('#')) {
      const el = document.querySelector(href)
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <>
      {/* ── Desktop / Tablet Header ──────────────────────────────────── */}
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 h-[72px] flex items-center px-6 transition-all duration-300',
          scrolled
            ? 'bg-white/92 backdrop-blur-xl shadow-sm border-b border-slate-100'
            : 'bg-transparent'
        )}
      >
        <nav className="w-full max-w-[1200px] mx-auto flex items-center gap-8">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-600 to-teal-500 flex items-center justify-center shadow-brand-sm text-xl transition-transform duration-300 group-hover:scale-105">
              🫀
            </div>
            <span className="font-display text-[1.25rem] font-bold text-teal-800 tracking-tight leading-none">
              Pflege<span className="text-orange-500">Plus</span>
            </span>
          </Link>

          {/* Nav links – hidden on mobile */}
          <ul className="hidden lg:flex items-center gap-7 ml-4">
            {NAV_ITEMS.map(item => (
              <li key={item.href}>
                <button
                  onClick={() => handleNavClick(item.href)}
                  className={cn(
                    'relative text-[0.8rem] font-bold uppercase tracking-widest text-slate-600',
                    'transition-colors duration-200 hover:text-teal-700',
                    'after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-[2px]',
                    'after:bg-teal-600 after:rounded-full after:scale-x-0 after:origin-left',
                    'after:transition-transform after:duration-250 hover:after:scale-x-100'
                  )}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Language selector */}
          <div className="hidden md:block relative" ref={langRef}>
            <button
              onClick={() => setLangOpen(v => !v)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full border-[1.5px] border-slate-200',
                'text-[0.78rem] font-bold uppercase tracking-wider text-slate-500',
                'transition-all duration-200 hover:border-teal-400 hover:text-teal-700 hover:bg-teal-50'
              )}
              aria-expanded={langOpen}
              aria-haspopup="listbox"
            >
              <span>{activeLang.flag}</span>
              <span>{activeLang.code.toUpperCase()}</span>
              <ChevronDown className={cn('w-3 h-3 transition-transform duration-200', langOpen && 'rotate-180')} />
            </button>

            {langOpen && (
              <div
                role="listbox"
                className="absolute top-[calc(100%+8px)] right-0 bg-white border border-slate-200 rounded-2xl py-2 shadow-lg min-w-[160px] z-50 animate-fade-in"
              >
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    role="option"
                    aria-selected={activeLang.code === lang.code}
                    onClick={() => { setActiveLang(lang); setLangOpen(false) }}
                    className={cn(
                      'w-full flex items-center gap-2.5 px-3.5 py-2 text-[0.82rem] font-bold',
                      'text-slate-700 transition-colors duration-150 hover:bg-teal-50 hover:text-teal-700',
                      activeLang.code === lang.code && 'bg-teal-50 text-teal-700'
                    )}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* CTA */}
          <Link
            href="#booking"
            onClick={e => { e.preventDefault(); handleNavClick('#booking') }}
            className={cn(
              'hidden lg:flex items-center gap-2 px-5 py-2.5 rounded-full',
              'bg-gradient-to-r from-teal-600 to-teal-700 text-white',
              'text-[0.8rem] font-bold uppercase tracking-wider',
              'shadow-brand-sm transition-all duration-200',
              'hover:-translate-y-0.5 hover:shadow-brand-md'
            )}
          >
            <CalendarIcon className="w-4 h-4" />
            Termin buchen
          </Link>

          {/* Hamburger */}
          <button
            className="lg:hidden flex flex-col gap-[5px] p-2 ml-2"
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Menü öffnen"
          >
            <span className={cn('block w-6 h-[2px] bg-teal-700 rounded-full transition-all duration-250', menuOpen && 'rotate-45 translate-y-[7px]')} />
            <span className={cn('block w-6 h-[2px] bg-teal-700 rounded-full transition-all duration-250', menuOpen && 'opacity-0')} />
            <span className={cn('block w-6 h-[2px] bg-teal-700 rounded-full transition-all duration-250', menuOpen && '-rotate-45 -translate-y-[7px]')} />
          </button>
        </nav>
      </header>

      {/* ── Mobile Menu ──────────────────────────────────────────────── */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-white/97 backdrop-blur-2xl flex flex-col items-center justify-center gap-8',
          'transition-all duration-300',
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      >
        <button
          className="absolute top-5 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 text-xl"
          onClick={() => setMenuOpen(false)}
          aria-label="Menü schließen"
        >
          ✕
        </button>

        {NAV_ITEMS.map((item, i) => (
          <button
            key={item.href}
            onClick={() => handleNavClick(item.href)}
            className="font-display text-3xl font-bold text-teal-800 hover:text-orange-500 transition-colors duration-200"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            {item.label}
          </button>
        ))}

        <button
          onClick={() => handleNavClick('#booking')}
          className="mt-4 px-8 py-3.5 rounded-full bg-gradient-to-r from-teal-600 to-teal-700 text-white font-bold uppercase tracking-wider text-sm shadow-brand-md"
        >
          Termin buchen
        </button>

        {/* Language buttons in mobile menu */}
        <div className="flex flex-wrap gap-2 justify-center">
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => { setActiveLang(lang); setMenuOpen(false) }}
              className={cn(
                'px-3 py-1.5 rounded-full border border-slate-200 text-xs font-bold',
                activeLang.code === lang.code
                  ? 'bg-teal-600 text-white border-teal-600'
                  : 'text-slate-500 hover:border-teal-400 hover:text-teal-700'
              )}
            >
              {lang.flag} {lang.code.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}

// ── Inline SVG icons ──────────────────────────────────────────────────────────
function ChevronDown({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  )
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  )
}
