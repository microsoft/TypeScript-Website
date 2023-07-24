// https://www.1eswiki.com/wiki/WCP_Cookie_Consent_API#Cookie_Consent_Library_-_JavaScript

import * as React from "react"
import "./cookie.scss"
import { useState } from "react"
import { Helmet } from "react-helmet"

declare const WcpConsent: any

export const CookieBanner = (props: { lang: string }) => {
  const [scriptLoaded, setScriptLoaded] = useState(typeof window !== 'undefined' && typeof WcpConsent !== 'undefined')
  const handleChangeClientState = (newState, addedTags) => {
    if (addedTags && addedTags.scriptTags) {
      const foundScript = addedTags.scriptTags.find(({ src }) => src === "https://consentdeliveryfd.azurefd.net/mscc/lib/v2/wcp-consent.js")
      if (foundScript) {
        foundScript.addEventListener('load', () => setScriptLoaded(true), { once: true })
      }
    }
  }

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
      <Helmet htmlAttributes={{ lang: props.lang }} onChangeClientState={handleChangeClientState}>
        {typeof window !== 'undefined' && typeof WcpConsent === 'undefined'
          && <script src="https://consentdeliveryfd.azurefd.net/mscc/lib/v2/wcp-consent.js" async />}
        <link rel="preconnect" href="https://consentdeliveryfd.azurefd.net/" />
      </Helmet>

      <div id="cookie-banner" className="openx"></div>
      {scriptLoaded && verboseCookieLogging()}
    </>
  )
}
