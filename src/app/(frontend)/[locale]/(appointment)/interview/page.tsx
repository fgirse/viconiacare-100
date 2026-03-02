"use client";

import BookingRequestForm from "@/src/components/booking/CalWidget";

export default function InterviewPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-teal-50/60 via-white to-orange-50/40 py-16 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-2 text-[0.75rem] font-bold uppercase tracking-[0.15em] text-teal-600 mb-4">
          <span className="w-6 h-[2px] bg-teal-500 rounded" />
          Terminanfrage
          <span className="w-6 h-[2px] bg-teal-500 rounded" />
        </div>

        {/* Headline */}
        <h1 className="font-display text-center text-[clamp(1.8rem,4vw,2.6rem)] font-black leading-[1.1] tracking-tight text-teal-950 mb-3">
          Ihr erster Schritt –<br />
          <em className="not-italic text-teal-600">kostenlos & unverbindlich.</em>
        </h1>
        <p className="text-center text-stone-500 text-sm leading-relaxed mb-10 max-w-sm mx-auto">
          Wählen Sie Gesprächsart und Wunschtermin. Wir rufen Sie zurück und bestätigen alles per E-Mail.
        </p>

        <BookingRequestForm eventTypeId={"interview"} title={""} description={""} onClose={function (): void {
          throw new Error("Function not implemented.");
        } } />
      </div>
    </main>
  );
}
  