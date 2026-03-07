'use client'
import { useState } from 'react'
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react'
import type { FormEvent } from 'react'

export default function ContactSection() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name:'', email:'', phone:'', message:'' })
  const quickFields: Array<{
    k: 'name' | 'phone'
    t: 'text' | 'tel'
    ph: string
    label: string
    required: boolean
  }> = [
    { k:'name',  t:'text', ph:'Max Mustermann', label:'Name', required:true },
    { k:'phone', t:'tel', ph:'+49 XXX XXXXXX', label:'Telefon', required:false },
  ]

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // TODO: wire to /api/contact endpoint
    await new Promise(r => setTimeout(r, 800))
    setSent(true)
  }

  return (
    <section id="kontakt" className="py-28 bg-stone-50">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Info */}
          <div>
            <span className="text-teal-700 text-sm font-semibold uppercase tracking-[0.15em] block mb-4">Kontakt</span>
            <h2 className="font-display text-4xl md:text-5xl text-stone-900 mb-6">Sprechen Sie uns an</h2>
            <p className="text-stone-500 text-lg leading-relaxed mb-10">
              Wir sind für Sie da — telefonisch, per E-Mail oder direkt über das Kontaktformular.
            </p>
            <div className="space-y-5">
              {[
                { icon: Phone,  label: 'Telefon',     val: '+49 (0) XXX XXXXXXX',    href: 'tel:+49' },
                { icon: Mail,   label: 'E-Mail',       val: 'info@viconiacare.de',      href: 'mailto:info@viconiacare.de' },
                { icon: MapPin, label: 'Adresse',      val: 'Musterstraße 1, 80333 München' },
                { icon: Clock,  label: 'Erreichbar',   val: 'Mo–Fr 08–18 Uhr · Notfall 24/7' },
              ].map(({ icon: Icon, label, val, href }) => (
                <div key={label} className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                    <Icon size={17} className="text-teal-700" />
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-stone-400">{label}</div>
                    {href
                      ? <a href={href} className="text-stone-800 font-medium hover:text-teal-700 transition-colors">{val}</a>
                      : <div className="text-stone-800 font-medium">{val}</div>
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-3xl border border-stone-100 shadow-xl p-8">
            {sent ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={30} className="text-teal-600" />
                </div>
                <h3 className="font-semibold text-stone-900 text-xl mb-2">Nachricht gesendet!</h3>
                <p className="text-stone-500">Wir melden uns innerhalb von 24 Stunden bei Ihnen.</p>
              </div>
            ) : (
              <>
                <h3 className="font-semibold text-stone-900 text-xl mb-6">Schnelle Nachricht</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {quickFields.map(({ k, t, ph, label, required }) => (
                      <div key={k}>
                        <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-stone-400 block mb-1.5">{label}</label>
                        <input type={t} required={required} placeholder={ph}
                          value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl border border-stone-200 text-stone-800 text-sm placeholder:text-stone-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-stone-400 block mb-1.5">E-Mail</label>
                    <input type="email" required placeholder="ihre@email.de"
                      value={form.email} onChange={e => setForm(f => ({...f,email:e.target.value}))}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 text-stone-800 text-sm placeholder:text-stone-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all" />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-stone-400 block mb-1.5">Nachricht</label>
                    <textarea rows={4} required placeholder="Wie können wir Ihnen helfen?"
                      value={form.message} onChange={e => setForm(f => ({...f,message:e.target.value}))}
                      className="w-full px-4 py-3 rounded-xl border border-stone-200 text-stone-800 text-sm placeholder:text-stone-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all resize-none" />
                  </div>
                  <button type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-600 text-white font-semibold py-4 rounded-xl transition-colors shadow-lg shadow-teal-900/20">
                    <Send size={16} /> Nachricht senden
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
