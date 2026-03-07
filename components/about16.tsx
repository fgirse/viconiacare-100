import React from "react";
import Image from "next/image";
import Hände from "@/public/images/g17.svg";

import { cn } from "@/src/lib/utils/utils";

const stats = [
  {
    number: "80K+",
    description:
      "From 80K+ users reached to 20+ startups supported, these numbers reflect the scale, impact, and consistency of my work.",
  },
  {
    number: "20+",
    description:
      "Startups supported with innovative solutions and strategic guidance to help them scale and succeed in their markets.",
  },
  {
    number: "95%",
    description:
      "Client satisfaction rate achieved through dedicated support, quality deliverables, and long-term partnerships built on trust.",
  },
];

interface About16Props {
  className?: string;
}

/* ── Handmade duotone SVG icons (yellow-600 / white) ──────────────── */

function IconTarget() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {/* outer ring */}
      <circle cx="12" cy="12" r="9.5" stroke="#ca8a04" strokeWidth="1.6" fill="#ca8a04" fillOpacity="0.12" />
      {/* middle ring */}
      <circle cx="12" cy="12" r="6" stroke="#ca8a04" strokeWidth="1.6" fill="none" />
      {/* inner ring */}
      <circle cx="12" cy="12" r="2.8" fill="#ca8a04" />
      {/* crosshair lines */}
      <line x1="12" y1="2" x2="12" y2="5.5"   stroke="#ca8a04" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="12" y1="18.5" x2="12" y2="22" stroke="#ca8a04" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="2"  y1="12" x2="5.5" y2="12"  stroke="#ca8a04" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="18.5" y1="12" x2="22" y2="12" stroke="#ca8a04" strokeWidth="1.5" strokeLinecap="round" />
      {/* center dot */}
      <circle cx="12" cy="12" r="1.1" fill="white" />
    </svg>
  )
}

function IconNurse() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {/* back person (slightly offset) */}
      <circle cx="15" cy="6.5" r="3" fill="#ca8a04" fillOpacity="0.3" />
      <path d="M10 21c0-3.3 2.2-6 5-6s5 2.7 5 6" stroke="#ca8a04" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.3" />
      {/* front person */}
      <circle cx="9.5" cy="6.5" r="3.2" fill="#ca8a04" />
      <circle cx="9.5" cy="6.5" r="1.4" fill="white" />
      <path d="M4 21c0-3.5 2.5-6.2 5.5-6.2S15 17.5 15 21" stroke="#ca8a04" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      {/* care cross on chest area */}
      <rect x="8.5" y="16.2" width="2" height="4.5" rx="0.5" fill="#ca8a04" fillOpacity="0.5" />
      <rect x="7.2" y="17.5" width="4.6" height="2" rx="0.5" fill="#ca8a04" fillOpacity="0.5" />
    </svg>
  )
}

function IconPhone() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {/* phone body */}
      <rect x="6" y="2" width="12" height="20" rx="2.5" fill="#ca8a04" fillOpacity="0.18" stroke="#ca8a04" strokeWidth="1.6" />
      {/* screen */}
      <rect x="8" y="5" width="8" height="11" rx="1" fill="#ca8a04" fillOpacity="0.35" />
      {/* screen lines (content) */}
      <line x1="9.5" y1="7.5"  x2="14.5" y2="7.5"  stroke="white" strokeWidth="1.1" strokeLinecap="round" />
      <line x1="9.5" y1="9.5"  x2="14.5" y2="9.5"  stroke="white" strokeWidth="1.1" strokeLinecap="round" />
      <line x1="9.5" y1="11.5" x2="12.5" y2="11.5" stroke="white" strokeWidth="1.1" strokeLinecap="round" />
      {/* checkmark on screen */}
      <path d="M9.5 13.5l1.2 1.2 2.3-2.3" stroke="#ca8a04" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      {/* home button */}
      <circle cx="12" cy="19" r="1.1" fill="#ca8a04" />
    </svg>
  )
}

function IconGlobe() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {/* outer circle */}
      <circle cx="12" cy="12" r="9.5" fill="#ca8a04" fillOpacity="0.12" stroke="#ca8a04" strokeWidth="1.6" />
      {/* vertical meridian */}
      <ellipse cx="12" cy="12" rx="4" ry="9.5" stroke="#ca8a04" strokeWidth="1.4" fill="none" />
      {/* equator */}
      <line x1="2.5" y1="12" x2="21.5" y2="12" stroke="#ca8a04" strokeWidth="1.3" />
      {/* upper lat */}
      <path d="M4.5 8c2 1 4 1.5 7.5 1.5S19.5 9 19.5 8" stroke="#ca8a04" strokeWidth="1.1" fill="none" />
      {/* lower lat */}
      <path d="M4.5 16c2-1 4-1.5 7.5-1.5S19.5 15 19.5 16" stroke="#ca8a04" strokeWidth="1.1" fill="none" />
      {/* speech bubble */}
      <rect x="13.5" y="4" width="7" height="5" rx="1.2" fill="#ca8a04" />
      <path d="M15 9.5l-1 1.5 2.5-1" fill="#ca8a04" />
      <line x1="15" y1="6" x2="19" y2="6" stroke="white" strokeWidth="1" strokeLinecap="round" />
      <line x1="15" y1="7.5" x2="18" y2="7.5" stroke="white" strokeWidth="1" strokeLinecap="round" />
    </svg>
  )
}

const FEATURES = [
  {
    Icon: IconTarget,
    title: 'Individuelle Pflegeplanung',
    desc: 'Kein Standardplan. Jeder Pflegeplan wird persönlich erarbeitet – gemeinsam mit Ihnen und Ihren Angehörigen.',
  },
  {
    Icon: IconNurse,
    title: 'Feste Bezugspflegekräfte',
    desc: 'Sie kennen Ihr Team – und Ihr Team kennt Sie. Kontinuität schafft Vertrauen.',
  },
  {
    Icon: IconPhone,
    title: 'Digital & transparent',
    desc: 'Termine online buchen, Dokumente einsehen, Pflegepläne verfolgen – alles in Ihrem persönlichen Bereich.',
  },
  {
    Icon: IconGlobe,
    title: 'Mehrsprachiges Team',
    desc: 'Wir sprechen Ihre Sprache – auf Deutsch, Englisch, Italienisch, Spanisch, Portugiesisch, Russisch, Ukrainisch und Türkisch.',
  },
]

const About16 = ({ className }: About16Props) => {
  return (
    <section className={cn("py-32", className)}>
      <div className="container">
        <div className="grid grid-cols-1 gap-20 lg:grid-cols-6">
          <div className="top-10 col-span-2 flex h-fit w-fit items-center gap-3 lg:sticky">
            <span className="size-2 bg-orange-500" />
            <p className="text-foreground/30 uppercase">Why us?</p>
          </div>
         
          <div className="reveal-why opacity-0 translate-y-7 transition-all duration-700 delay-75 flex items-center gap-2 text-[0.75rem] font-bold uppercase tracking-[0.15em] text-teal-600 mb-4">
            <span className="w-6 h-[2px] bg-teal-500 rounded" />
            Warum wir?
          </div>

          <h2 className="reveal-why opacity-0 translate-y-7 transition-all duration-700 delay-100 font-display text-[clamp(2.2rem,4vw,3.2rem)] font-black leading-[1.1] tracking-[-0.02em] text-teal-950 mb-4">
            Pflege mit <em className="not-italic text-teal-600">Haltung</em> und Herz.
          </h2>

          <p className="reveal-why opacity-0 translate-y-7 transition-all duration-700 delay-150 text-[1.05rem] leading-[1.75] text-stone-500 font-light mb-10">
            Die <span className="font-passionate text-yellow-600 text-[1.05rem]">ViconiaCare GmbH</span> wurde im Februar 2026 neu gegründet. Unser Leitbild und unsere Werte sind fest in unserer täglichen Arbeit verankert. Wir sind ein Team engagierter
            Fachkräfte, das Pflege als Berufung – nicht als Job – versteht.
          </p>

          <div className="flex flex-col gap-6">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="reveal-why opacity-0 translate-y-7 transition-all duration-700 flex gap-4 group"
                style={{ transitionDelay: `${200 + i * 80}ms` }}
              >
                <div className="w-12 h-12 rounded-2xl bg-yellow-50 flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:bg-yellow-100">
                  <f.Icon />
                </div>
                <div>
                  <div className="font-display text-[1.05rem] font-bold text-teal-950 mb-1">{f.title}</div>
                  <div className="text-[0.875rem] leading-[1.65] text-stone-500">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

       

            <div className="relative h-110 w-full">
              <Image
                src={Hände}
                alt="Hände"
                fill
                className="pointer-events-none object-cover"
              />
            </div>
            <ul className="mt-14">
              {stats.map((stat, index) => (
                <li key={index} className="grid grid-cols-5 border-b py-8">
                  <h3 className="col-span-2 text-4xl font-medium">
                    {stat.number}
                  </h3>
                  <p className="col-span-3">{stat.description}</p>
                </li>
              ))}
            </ul>
          </div>
      
    
    </section>
  );
};

export { About16 };
