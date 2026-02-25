/* First make sure that you have installed the package */

/* If you are using yarn */
// yarn add @calcom/embed-react

/* If you are using npm */
// npm install @calcom/embed-react

"use client"

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";
export default function MyApp() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({"namespace":"info-telefonat"});
      cal("ui", {"hideEventTypeDetails":false,"layout":"month_view"});
    })();
  }, [])
  return <Cal namespace="info-telefonat"
    calLink="viconiacare/info-telefonat"
    calOrigin="https://cal.eu"
    style={{width:"100%",height:"100%",overflow:"scroll", backgroundImage: "url('/Graffity.svg')", backgroundSize: "contain"}}
    config={{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}}
    
    
  />;
};
  