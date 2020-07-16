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

  // https://www.1eswiki.com/wiki/WCP_Supported_Language_-_Country_List
  const allLangs = ["ar-SA",
    "bg-BG",
    "bs-BA",
    "ca-ES",
    "cs-CZ",
    "cy-GB",
    "da-DK",
    "de-DE",
    "de-LU",
    "de-AT",
    "de-CH",
    "el-GR",
    "en-GB",
    "en-IE",
    "en-MT",
    "es-ES",
    "es-MX",
    "et-EE",
    "fi-FI",
    "fr-CA",
    "fr-FR",
    "fr-BE",
    "fr-LU",
    "fr-CH",
    "gd-GB",
    "ga-IE",
    "he-IL",
    "hi-IN",
    "hr-HR",
    "hu-HU",
    "id-ID",
    "is-IS",
    "it-IT",
    "ja-JP",
    "kk-KZ",
    "ko-KR",
    "lb-LU",
    "lt-lT",
    "lv-LV",
    "ms-MY",
    "mt-MT",
    "nb-NO",
    "nl-NL",
    "nl-BE",
    "nn-NO",
    "pl-PL",
    "pt-BR",
    "pt-PT",
    "rm-CH",
    "ro-RO",
    "ro-MD",
    "ru-RU",
    "sk-SK",
    "sl-SI",
    "sr-LATN-RS",
    "sv-SE",
    "th-TH",
    "tr-TR",
    "uk-UA",
    "vi-VN",
    "zh-CN",
    "zh-HK",
    "zh-TW"]

  const verboseCookieLogging = () => {
    let siteConsent
    const lang = navigator.language
    const firstWithPrefix = allLangs.find(l => l.startsWith(lang)) || "en-US"

    WcpConsent.init(firstWithPrefix, "cookie-banner", (err, _siteConsent) => {
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
      if (siteConsent.isConsentRequired) {
        siteConsent.manageConsent();
      }
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
