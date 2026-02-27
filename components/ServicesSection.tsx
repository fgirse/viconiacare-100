import { getActiveServices, seedServices } from '@/src/lib/getServices'
import { Service } from '@/src/types/service'
import ServiceCard from './ServiceCard'
import { Link } from '@/src/i18n/navigation'                                                                                               

async function loadServices(): Promise<Service[]> {
  try {
    const data = await getActiveServices()
    return data.length > 0 ? data : seedServices
  } catch {
    return seedServices
  }
}

export default async function ServicesSection() {
  const services = await loadServices()

  return (
    <section
      id="leistungen"
      aria-labelledby="services-heading"
      className="relative w-full bg-stone-50 py-28 px-6 overflow-hidden"
    >
      {/* Decorative background shapes */}
      <div className="pointer-events-none absolute inset-0 -z-0 overflow-hidden" aria-hidden="true">
        {/* Top-left blob */}
        <div
          className="absolute -top-32 -left-32 w-[28rem] h-[28rem] rounded-full opacity-30"
          style={{
            background:
              'radial-gradient(circle, rgba(234,179,8,0.25) 0%, transparent 70%)',
          }}
        />
        {/* Bottom-right blob */}
        <div
          className="absolute -bottom-32 -right-20 w-[32rem] h-[32rem] rounded-full opacity-20"
          style={{
            background:
              'radial-gradient(circle, rgba(16,185,129,0.3) 0%, transparent 65%)',
          }}
        />
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'radial-gradient(circle, #374151 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">

        {/* Header */}
        <div className="max-w-2xl mb-16">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-5">
            <span className="h-px w-10 bg-yellow-600" />
            <p className="text-yellow-600 text-xs font-bold tracking-[0.3em] uppercase">
              Unsere Leistungen
            </p>
          </div>

          <h2
            id="services-heading"
            className="text-4xl md:text-5xl font-extrabold text-stone-900 leading-tight tracking-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Ambulante Pflege –{' '}
            <span
              className="relative inline-block"
              style={{
                background: 'linear-gradient(135deg, #ca8a04 0%, #10b981 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              persönlich &amp; professionell
            </span>
          </h2>

          <p className="mt-5 text-stone-500 text-lg leading-relaxed font-light">
            Wir kommen zu Ihnen nach Hause – mit Herz, Fachkompetenz und dem Ziel,
            dass Sie so selbstständig wie möglich in Ihrem vertrauten Umfeld leben können.
          </p>

          {/* Stats strip */}
          <div className="mt-8 flex flex-wrap gap-8">
            {[
              { value: '24/7', label: 'Erreichbarkeit' },
              { value: '15+', label: 'Jahre Erfahrung' },
              { value: '100%', label: 'Zugelassener Pflegedienst' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <span className="text-2xl font-extrabold text-yellow-600 leading-none">
                  {stat.value}
                </span>
                <span className="text-stone-500 text-xs mt-1 tracking-wide">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>

        {/* CTA footer */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-6 rounded-2xl bg-white border border-stone-200 p-8 shadow-sm">
          <div>
            <p className="text-stone-900 font-bold text-lg">
              Haben Sie Fragen zu unseren Leistungen?
            </p>
            <p className="text-stone-500 text-sm mt-1">
              Wir beraten Sie kostenlos und unverbindlich – persönlich oder telefonisch.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <a
              href="tel:+49000000000"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-3
                bg-yellow-600 hover:bg-yellow-500 text-white font-semibold text-sm
                transition-colors duration-200 shadow-md hover:shadow-yellow-600/30"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.8a16 16 0 0 0 6.29 6.29l1.86-1.84a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
              </svg>
              Jetzt anrufen
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-3
                bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-sm
                transition-colors duration-200 shadow-md hover:shadow-emerald-500/30"
            >
              Kostenlose Beratung
            </Link>
          </div>
        </div>

      </div>
    </section>
  )
}
