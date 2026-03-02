"use client";

import { useEffect, useRef } from "react";
import { getCalApi } from "@calcom/embed-react";

interface BookingCardProps {
  icon: string;
  tag: string;
  title: string;
  description: string;
  duration: string;
  format: string;
  cost: string;
  calLink: string; // e.g. "viconiacare/info-telefonat"
}

export default function BookingCard({
  icon,
  tag,
  title,
  description,
  duration,
  format,
  cost,
  calLink,
}: BookingCardProps) {
  // Each card gets its own namespace derived from the calLink slug
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

  return (
    <article className="relative bg-card-bg border border-card-border rounded-xl p-9 flex flex-col card-hover overflow-hidden group">
      {/* Top gold border that animates in on hover */}
      <div className="card-top-border absolute top-0 left-0 right-0 h-0.5 bg-gold" />

      {/* Icon */}
      <div className="w-13 h-13 mb-6 flex items-center justify-center text-2xl rounded-xl bg-gold/10 border border-gold/30 w-14 h-14">
        {icon}
      </div>

      {/* Tag */}
      <p className="text-gold text-[10px] tracking-[3px] uppercase mb-2.5 font-dm">
        {tag}
      </p>

      {/* Title */}
      <h3 className="font-playfair text-cream text-[1.35rem] leading-tight mb-3">
        {title}
      </h3>

      {/* Description */}
      <p className="text-[#6a6a90] text-sm leading-relaxed mb-7 flex-1">
        {description}
      </p>

      {/* Meta chips */}
      <div className="flex flex-wrap gap-3 mb-8">
        {[
          { emoji: "🕐", label: duration },
          { emoji: "📍", label: format },
          { emoji: "💶", label: cost },
        ].map(({ emoji, label }) => (
          <span
            key={label}
            className="flex items-center gap-1.5 text-[#5a5a80] text-xs"
          >
            {emoji} {label}
          </span>
        ))}
      </div>

      <button
        data-cal-namespace={namespace}
        data-cal-link={calLink}
        data-cal-config='{"layout":"month_view"}'
        className="w-full border border-gold text-gold py-3.5 px-5 rounded-md text-sm tracking-[1.5px] uppercase font-dm transition-all duration-200 hover:bg-yellow-600/50 hover:text-white cursor-pointer"
      >
        Termin jetzt buchen
      </button>
    </article>
  );
}
