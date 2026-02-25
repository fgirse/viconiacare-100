"use client";

import dynamic from "next/dynamic";
import { getCalApi } from "@calcom/embed-react";
import { useEffect, useRef } from "react";

// Load the Cal embed only on the client to avoid SSR performance.mark issues
const Cal = dynamic(() => import("@calcom/embed-react").then(m => m.default), { ssr: false });

export default function MyApp() {
  const initialized = useRef(false);

  useEffect(() => {
    // Guard against React 19 Strict Mode double-invocation
    if (initialized.current) return;
    initialized.current = true;

    (async function () {
      const cal = await getCalApi({ namespace: "interview" });
      cal("ui", {
        cssVarsPerTheme: { light: { "cal-brand": "#d8971b" }, dark: { "cal-brand": "#fafafa" } },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);

  return (
    <Cal
      namespace="interview"
      calLink="frank-girse-rjljth/interview"
      style={{ width: "100%", height: "100%", overflow: "scroll" }}
      config={{ layout: "month_view", useSlotsViewOnSmallScreen: "true" }}
    />
  );
}
  
  