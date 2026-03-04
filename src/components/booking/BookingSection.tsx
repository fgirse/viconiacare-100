import BookingCard from "@/src/components/booking/BookingCard";
import { EVENT_TYPES } from "@/src/config/events";

/**
 * Home page – server component.
 * Renders the booking hero + three event-type cards.
 * All interactivity (Cal.com popup) is handled client-side
 * via the data-cal-link attribute + the globally loaded embed script.
 */
export default function BookingSection() {
  return (
    <main className="min-h-screen w-[100vw] bg-stone-50">
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="flex flex-col items-center justify-center text-center px-6 pt-2 pb-20">
        <span className="inline-block border border-yellow-600 text-yellow-600 text-[1rem] tracking-[3px] uppercase px-4 py-1.5 mb-6">
          Terminbuchung
        </span>

        <h1 className="font-playfair text-cream text-4xl md:text-5xl xl:text-6xl leading-tight max-w-2xl mb-5">
          Wählen Sie Ihr
          <br />
          <span className="text-yellow-600">Terminereignis</span>
        </h1>

        <p className="text-stone-700 text-base md:text-lg leading-relaxed max-w-xl">
          Alle Termine werden mit automatischer E-Mail-Bestätigung und
          Kalendereinladung bestätigt. Einfach Wunschtermin wählen – fertig.
        </p>
      </section>

      {/* ── Cards ─────────────────────────────────────────────── */}
      <section className="px-6 pb-24 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {EVENT_TYPES.map((event) => (
            <BookingCard
              key={event.id}
              id={event.id}
              tag={event.tag}
              title={event.title}
              description={event.description}
              duration={event.duration}
              format={event.format}
              cost={event.cost}
              calLink={event.calLink}
            />
          ))}
        </div>
      </section>

      {/* ── Email info banner ─────────────────────────────────── */}
      <section className=" border-t border-card-border bg-stone-300 px-6 py-10">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <div className="text-4xl shrink-0">✉️</div>
          <div>
            <h2 className="font-playfair text-cream text-xl mb-1">
              Automatische E-Mail-Bestätigung
            </h2>
            <p className="text-stone-700 text-sm leading-relaxed">
              Nach Ihrer Buchung erhalten Sie sofort eine Bestätigungsmail mit
              allen Termindetails, einer{" "}
              <span className="text-yellow-600">.ics-Kalendereinladung</span> sowie
              einem direkten Link zum Absagen oder Umbuchen – ohne Anmeldung.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
