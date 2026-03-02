"use client";

import { useEffect, useRef } from "react";
import { getCalApi } from "@calcom/embed-react";

// ── Duotone SVG icons ─────────────────────────────────────────────────────────
// Primary stroke: yellow-600 | Secondary fill: yellow-600/20

function IconPhone() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* body fill */}
      <rect x="6" y="4" width="16" height="20" rx="3" fill="#ca8a04" fillOpacity="0.18" />
      {/* outline */}
      <rect x="6" y="4" width="16" height="20" rx="3" stroke="#ca8a04" strokeWidth="1.6" />
      {/* receiver */}
      <path d="M10 9c1.5-1.5 4-1.5 5 0l1.5 1.5c.5.5.5 1.5 0 2l-1 1c-.5.5-.5 1 0 1.5l2 2c.5.5 1 .5 1.5 0l1-1c.5-.5 1.5-.5 2 0l1.5 1.5c1.5 1 1.5 3.5 0 5-2 2-5 2-7 0L9 20c-2-2-2-5 0-7l1-1Z" stroke="#ca8a04" strokeWidth="1.4" strokeLinejoin="round" fill="#ca8a04" fillOpacity="0.10" transform="scale(0.65) translate(4,4)" />
      {/* simplified phone handset */}
      <path d="M10.5 13.5c0-1.7 1.3-3 3-3h1c.6 0 1 .4 1 1v1.5c0 .6-.4 1-1 .9l-.8-.1c-.2 0-.3.1-.3.3.1.7.4 1.4.9 1.9s1.2.8 1.9.9c.2 0 .3-.1.3-.3l-.1-.8c-.1-.6.3-1 .9-1h1.5c.6 0 1 .4 1 1v1c0 .6-.4 1-1 1H17c-3.6 0-6.5-2.9-6.5-6.5v-.8Z" fill="#ca8a04" fillOpacity="0.25" stroke="#ca8a04" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

function IconMic() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* mic body fill */}
      <rect x="10" y="3" width="8" height="13" rx="4" fill="#ca8a04" fillOpacity="0.18" stroke="#ca8a04" strokeWidth="1.6" />
      {/* sound waves / arc */}
      <path d="M7 14a7 7 0 0 0 14 0" stroke="#ca8a04" strokeWidth="1.6" strokeLinecap="round" />
      {/* stand */}
      <line x1="14" y1="21" x2="14" y2="25" stroke="#ca8a04" strokeWidth="1.6" strokeLinecap="round" />
      {/* base */}
      <path d="M10 25h8" stroke="#ca8a04" strokeWidth="1.6" strokeLinecap="round" />
      {/* center dot */}
      <rect x="12.5" y="7" width="3" height="5" rx="1.5" fill="#ca8a04" fillOpacity="0.45" />
    </svg>
  );
}

function IconHouse() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* wall fill */}
      <path d="M6 14v9h16V14" fill="#ca8a04" fillOpacity="0.18" />
      {/* roof fill */}
      <path d="M3 14l11-10 11 10" fill="#ca8a04" fillOpacity="0.32" />
      {/* outline */}
      <path d="M6 14v9h16V14" stroke="#ca8a04" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M3 14l11-10 11 10" stroke="#ca8a04" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
      {/* door */}
      <rect x="11" y="18" width="6" height="5" rx="1" fill="#ca8a04" fillOpacity="0.4" stroke="#ca8a04" strokeWidth="1.3" />
    </svg>
  );
}

// Meta chip icons
function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="7" cy="7" r="6" fill="#ca8a04" fillOpacity="0.18" stroke="#ca8a04" strokeWidth="1.3" />
      <path d="M7 4v3l2 1.5" stroke="#ca8a04" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 1a4.5 4.5 0 0 1 4.5 4.5C11.5 9 7 13 7 13S2.5 9 2.5 5.5A4.5 4.5 0 0 1 7 1Z" fill="#ca8a04" fillOpacity="0.18" stroke="#ca8a04" strokeWidth="1.3" strokeLinejoin="round" />
      <circle cx="7" cy="5.5" r="1.5" fill="#ca8a04" fillOpacity="0.55" stroke="#ca8a04" strokeWidth="1" />
    </svg>
  );
}

function EuroIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="7" cy="7" r="6" fill="#ca8a04" fillOpacity="0.18" stroke="#ca8a04" strokeWidth="1.3" />
      <path d="M9 4.5A3 3 0 1 0 9 9.5" stroke="#ca8a04" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M4.5 6.5h4M4.5 7.5h4" stroke="#ca8a04" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

// Map event id → icon component
const CARD_ICONS: Record<string, React.ReactNode> = {
  telefonat:  <IconPhone />,
  interview:  <IconMic />,
  hausbesuch: <IconHouse />,
};

interface BookingCardProps {
  id: string;
  tag: string;
  title: string;
  description: string;
  duration: string;
  format: string;
  cost: string;
  calLink: string;
}

export default function BookingCard({
  id,
  tag,
  title,
  description,
  duration,
  format,
  cost,
  calLink,
}: BookingCardProps) {
  const namespace = calLink.split("/").pop() ?? calLink;
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    (async () => {
      const cal = await getCalApi({ namespace, embedJsUrl: "https://cal.eu/embed/embed.js" });
      cal("ui", {
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, [namespace]);

  const cardIcon = CARD_ICONS[id] ?? <IconPhone />;

  return (
    <article className="relative bg-yellow-600/5  border border-card-border rounded-xl p-9 flex flex-col card-hover overflow-hidden group">
      <div className="card-top-border absolute top-0 left-0 right-0 h-0.5 bg-gold" />

      {/* Icon */}
      <div className="w-14 h-14 mb-6 flex items-center justify-center rounded-xl bg-yellow-600/10 border border-yellow-600/25">
        {cardIcon}
      </div>

      {/* Tag */}
      <p className="text-stone-800 text-[10px] tracking-[3px] uppercase mb-2.5 font-dm">
        {tag}
      </p>

      {/* Title */}
      <h3 className="font-playfair text-yellow-600 text-[1.35rem] leading-tight mb-3">
        {title}

      </h3>

      {/* Description */}
      <p className="text-stone-600 text-sm leading-relaxed mb-7 flex-1">
        {description}
      </p>

      {/* Meta chips */}
      <div className="flex flex-wrap gap-3 mb-8">
        {([
          { icon: <ClockIcon />, label: duration },
          { icon: <PinIcon />,   label: format   },
          { icon: <EuroIcon />,  label: cost      },
        ] as { icon: React.ReactNode; label: string }[]).map(({ icon, label }) => (
          <span key={label} className="flex items-center gap-1.5 text-stone-800 text-xs">
            {icon} {label}
          </span>
        ))}
      </div>

      <button
        data-cal-namespace={namespace}
        data-cal-link={calLink}
        data-cal-config='{"layout":"month_view"}'
        className="w-full border border-gold text-stone-800 py-3.5 px-5 rounded-md text-sm tracking-[1.5px] uppercase font-dm transition-all duration-200 bg-yellow-600/10 hover:bg-yellow-600/50 hover:text-white cursor-pointer"
      >
        Termin jetzt buchen
      </button>
    </article>
  );
}
