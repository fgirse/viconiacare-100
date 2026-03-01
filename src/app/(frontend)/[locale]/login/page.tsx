'use client'

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/src/lib/utils/utils';

export default function LoginPage() {
  const router = useRouter()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState<string | null>(null)
  const [showPw,   setShowPw]   = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email || !password) return
    setLoading(true)
    setError(null)

    try {
      const res  = await fetch('/api/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Anmeldung fehlgeschlagen.')
        return
      }
      router.push('/de/dashboard')
      router.refresh()
    } catch {
      setError('Verbindungsfehler. Bitte versuchen Sie es erneut.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* ── Left – Branding panel ───────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between w-[480px] flex-shrink-0
                      bg-gradient-to-br from-teal-950 via-teal-900 to-teal-800 p-12 relative overflow-hidden">

        {/* Background blobs */}
        <div className="absolute top-[-80px] right-[-80px] w-[360px] h-[360px] rounded-full
                        bg-gradient-radial from-orange-500/20 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-60px] left-[-60px] w-[280px] h-[280px] rounded-full
                        bg-gradient-radial from-teal-400/15 to-transparent blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center text-2xl">
            🫀
          </div>
          <span className="font-display text-2xl font-black text-white">
            Pflege<span className="text-orange-400">Plus</span>
          </span>
        </div>

        {/* Main copy */}
        <div>
          <h2 className="font-display text-[2.6rem] font-black text-white leading-[1.1] mb-5">
            Ihr persönlicher<br />
            <span className="text-orange-400 italic">Pflegebereich</span>
          </h2>
          <p className="text-white/55 text-[1.05rem] leading-relaxed mb-10">
            Verwalten Sie Ihre Termine, Dokumente und Ihren Pflegeplan – sicher und jederzeit verfügbar.
          </p>

          {/* Feature list */}
          {[
            ['📅', 'Termine buchen & verwalten'],
            ['📄', 'Dokumente sicher abrufen'],
            ['📋', 'Pflegeplan einsehen'],
            ['👥', 'Ihr Pflegeteam im Überblick'],
          ].map(([icon, text]) => (
            <div key={text} className="flex items-center gap-3 mb-3">
              <span className="w-8 h-8 rounded-xl bg-white/8 flex items-center justify-center text-sm">{icon}</span>
              <span className="text-white/70 text-sm font-medium">{text}</span>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p className="text-white/30 text-xs">
          Noch kein Konto? Nehmen Sie{' '}
          <Link href="/de#booking" className="text-teal-400 hover:text-teal-300 underline underline-offset-2">
            Kontakt
          </Link>{' '}
          mit uns auf.
        </p>
      </div>

      {/* ── Right – Login form ──────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 bg-stone-50">
        <div className="w-full max-w-[420px]">

          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-10 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-xl">🫀</div>
            <span className="font-display text-xl font-black text-teal-900">
              Pflege<span className="text-orange-500">Plus</span>
            </span>
          </div>

          <h1 className="font-display text-[2rem] font-black text-stone-900 mb-1">
            Willkommen zurück
          </h1>
          <p className="text-stone-400 text-sm mb-9">
            Melden Sie sich mit Ihren Zugangsdaten an.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Email */}
            <div>
              <label className="block text-[0.72rem] font-black uppercase tracking-widest text-stone-500 mb-2">
                E-Mail-Adresse
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="ihre@email.de"
                required
                autoComplete="email"
                className="w-full bg-white border border-stone-200 rounded-2xl px-5 py-3.5 text-sm
                           text-stone-900 placeholder:text-stone-300
                           focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                           transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[0.72rem] font-black uppercase tracking-widest text-stone-500">
                  Passwort
                </label>
                <button
                  type="button"
                  className="text-[0.72rem] text-teal-600 hover:text-teal-700 font-bold"
                >
                  Vergessen?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full bg-white border border-stone-200 rounded-2xl px-5 py-3.5 text-sm
                             text-stone-900 placeholder:text-stone-300
                             focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                             transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-sm"
                  tabIndex={-1}
                >
                  {showPw ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2.5 p-4 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-700">
                <span className="text-base mt-0.5">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !email || !password}
              className={cn(
                'w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl',
                'font-black text-sm uppercase tracking-[0.1em] text-white',
                'transition-all duration-200',
                loading || !email || !password
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-teal-600 to-teal-700 shadow-brand-md hover:-translate-y-0.5 hover:shadow-brand-lg',
              )}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Wird angemeldet…
                </>
              ) : (
                <>
                  Anmelden
                  <span className="text-base">→</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-stone-200" />
            <span className="text-xs text-stone-400 font-medium">oder</span>
            <div className="flex-1 h-px bg-stone-200" />
          </div>

          {/* No account */}
          <div className="text-center">
            <p className="text-sm text-stone-400 mb-3">Noch kein Konto?</p>
            <Link
              href="/de#booking"
              className="inline-flex items-center gap-2 text-sm font-bold text-teal-600
                         hover:text-teal-700 transition-colors"
            >
              Kostenlos Erstgespräch buchen →
            </Link>
          </div>

          {/* Legal */}
          <p className="text-center text-[0.7rem] text-stone-300 mt-10">
            Mit dem Anmelden akzeptieren Sie unsere{' '}
            <Link href="/de/datenschutz" className="underline hover:text-stone-500">Datenschutzrichtlinien</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}