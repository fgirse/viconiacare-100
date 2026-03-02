/**
 * Central configuration for all booking event types.
 *
 * ┌────────────────────────────────────────────────────────────┐
 * │  HOW TO CONFIGURE                                          │
 * │  1. Set CAL_USERNAME to your Cal.com username.             │
 * │  2. For each event, set the `slug` to match the event slug │
 * │     in your Cal.com dashboard (Event Types → slug field).  │
 * └────────────────────────────────────────────────────────────┘
 */

// cal.eu username – matches the event links in the appointment pages
export const CAL_USERNAME = "viconiacare";

export interface EventType {
  id: string;
  icon: string;
  tag: string;
  title: string;
  description: string;
  duration: string;
  format: string;
  cost: string;
  slug: string;
  calLink: string; // exact link passed to getCalApi / data-cal-link
}

export const EVENT_TYPES: EventType[] = [
  {
    id: "telefonat",
    icon: "📞",
    tag: "Schritt 1",
    title: "Info-Telefonat",
    description:
      "Ein erstes, unverbindliches Gespräch um Ihre Situation kennenzulernen, offene Fragen zu klären und den besten nächsten Schritt zu besprechen.",
    duration: "20 Minuten",
    format: "Telefon",
    cost: "Kostenlos",
    slug: "info-telefonat",
    calLink: "viconiacare/info-telefonat",
  },
  {
    id: "interview",
    icon: "🎙",
    tag: "Schritt 2",
    title: "Interview",
    description:
      "Ein ausführliches persönliches Gespräch, in dem wir Ihre Anliegen, Wünsche und konkreten nächsten Schritte gemeinsam erarbeiten.",
    duration: "45 Minuten",
    format: "Video / Hybrid",
    cost: "Nach Absprache",
    slug: "interview",
    calLink: "viconiacare/interview",
  },
  {
    id: "hausbesuch",
    icon: "🏠",
    tag: "Schritt 3",
    title: "Hausbesuch",
    description:
      "Wir kommen direkt zu Ihnen – für eine persönliche Beratung oder Besichtigung vor Ort, ganz ohne Aufwand auf Ihrer Seite.",
    duration: "60–90 Minuten",
    format: "Vor Ort",
    cost: "Terminabhängig",
    slug: "hausbesuch",
    calLink: "viconiacare/hausbesuch",
  },
];
