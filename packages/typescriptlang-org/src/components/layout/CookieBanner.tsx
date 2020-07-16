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
    WcpConsent.init(props.lang || "en-US", "cookie-banner", (err, _siteConsent) => {
      if (err) {
        alert(err);
      } else {
        siteConsent = _siteConsent!;
        console.log("getConsent()", siteConsent.getConsent());
        console.log("getConsent().Required", siteConsent.getConsent().Required);
      }
    }, onConsentChanged);

    //call back method when consent is changed by user
    function onConsentChanged(newConsent: any) {
      console.log("onConsentChanged", newConsent);
      console.log("getConsent()", siteConsent.getConsent());
      console.log("getConsentFor(wcpConsentCategory.Required)", siteConsent.getConsentFor(WcpConsent.consentCategories.Required));
      console.log("getConsentFor(wcpConsentCategory.ThirdPartyAnalytics)", siteConsent.getConsentFor(WcpConsent.consentCategories.Analytics));
      console.log("getConsentFor(wcpConsentCategory.SocialMedia)", siteConsent.getConsentFor(WcpConsent.consentCategories.SocialMedia));
      console.log("getConsentFor(wcpConsentCategory.Advertising)", siteConsent.getConsentFor(WcpConsent.consentCategories.Advertising));
      console.log("getConsentFor(wcpConsentCategory.Personalization)", siteConsent.getConsentFor(WcpConsent.consentCategories.Personalization));
    }
  }

  return (
    <>
      <Helmet htmlAttributes={{ lang: props.lang }} onChangeClientState={handleChangeClientState}>
        {typeof window !== 'undefined' && typeof WcpConsent === 'undefined'
          && <script src="https://consentdeliveryfd.azurefd.net/mscc/lib/v2/wcp-consent.js" />}
      </Helmet>

      <div id="cookie-banner"></div>
      {scriptLoaded && verboseCookieLogging()}
    </>
  )
}
