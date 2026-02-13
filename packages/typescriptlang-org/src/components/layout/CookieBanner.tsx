// https://www.1eswiki.com/wiki/WCP_Cookie_Consent_API#Cookie_Consent_Library_-_JavaScript

import * as React from "react"
import "./cookie.scss"
import { useState, useEffect } from "react"

declare const WcpConsent: any

export const CookieBanner = (props: { lang: string }) => {
  const [scriptLoaded, setScriptLoaded] = useState(typeof window !== 'undefined' && typeof WcpConsent !== 'undefined')

  useEffect(() => {
    if (typeof WcpConsent !== 'undefined') {
      setScriptLoaded(true)
      return
    }

    const script = document.createElement('script')
    script.src = "https://consentdeliveryfd.azurefd.net/mscc/lib/v2/wcp-consent.js"
    script.async = true
    script.onload = () => setScriptLoaded(true)
    document.head.appendChild(script)

    const link = document.createElement('link')
    link.rel = 'preconnect'
    link.href = 'https://consentdeliveryfd.azurefd.net/'
    document.head.appendChild(link)
  }, [])

  const verboseCookieLogging = () => {
    let siteConsent
    // If they ship a bad build of the cookie banner, then even though the script is fully there
    // the global symbols won't be there
    if (typeof WcpConsent === 'undefined' || !WcpConsent) return
    WcpConsent.init("en-US", "cookie-banner", (err, _siteConsent) => {
      if (err) {
        alert(err);
      } else {
        siteConsent = _siteConsent!;
        onConsentChanged(siteConsent)
      }
    }, onConsentChanged);


    function onConsentChanged(newConsent: any) {
      if (newConsent.isConsentRequired) {
        // newConsent.manageConsent();
      }
    }
  }

  return (
    <>
      <div id="cookie-banner" className="openx"></div>
      {(scriptLoaded && verboseCookieLogging(), "")}
    </>
  )
}
