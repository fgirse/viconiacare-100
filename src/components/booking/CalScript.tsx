"use client";

import Script from "next/script";

/**
 * Loads the Cal.com embed script once, globally.
 * Uses next/script with strategy="lazyOnload" so it does not block rendering.
 * After the script loads, it initialises Cal with German locale and dark theme.
 */
export default function CalScript() {
  return (
    <Script
      src="https://app.cal.com/embed/embed.js"
      strategy="lazyOnload"
      onLoad={() => {
        // @ts-expect-error Cal is injected globally by the embed script
        if (typeof Cal !== "undefined") {
          // @ts-expect-error Cal is injected globally by the embed script
          Cal("init", { origin: "https://app.cal.com" });
          // @ts-expect-error Cal is injected globally by the embed script
          Cal("ui", {
            language: "de",
            theme: "light",
            hideEventTypeDetails: false,
            layout: "month_view",
          });
        }
      }}
    />
  );
}
