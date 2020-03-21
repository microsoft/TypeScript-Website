// Re: https://github.com/microsoft/TypeScript-Website/blob/17d33630f824e0d38963c5a04a40640734422fd7/src/assets/javascript/cookies.js#L22

// This version is different, we basically know that nothing is gonna have to change - so I'm 
// skipping on the extra network requests

// https://uhf.microsoft.com/en/shell/api/mscc?sitename=typescript&domain=typescriptlang.org&country=euregion&mscc_eudomain=true

import React from "react"
import "./cookie.scss"
import { useEffect } from "react"

export const CookieBanner = () => {
  useEffect(() => {
    const cookieName = "MSCC"

    const hasConsent = hasGivenConsentByActivelyUsingTheSite(cookieName)
    if (!hasConsent) {
      const banner = document.getElementById("msccBanner")!
      banner.style.display = "block"

      const giveConsent = () => {
        const newCookie = document.cookie + ` ;${cookieName}=1`
        document.cookie = newCookie
        banner.style.display = "none"
      }

      document.body.addEventListener('mouseup', giveConsent);
      document.body.addEventListener('keyup', giveConsent);
      document.body.addEventListener('submit', giveConsent);
    }

    function hasGivenConsentByActivelyUsingTheSite(cookieName) {
      return document.cookie.includes(cookieName)
    }

  }, [])

  return (
    <div style={{ display: "none" }} id='msccBanner' dir='ltr' data-site-name='uhf-typescript' data-mscc-version='0.4.2' data-nver='aspnet-3.1.3' data-sver='0.1.2' className='cc-banner' role='alert' aria-labelledby='msccMessage' >
      <div className='cc-container'><svg className='cc-icon cc-v-center' x='0px' y='0px' viewBox='0 0 44 44' height='30px' fill='none' stroke='currentColor'>
        <circle cx='22' cy='22' r='20' strokeWidth='2'></circle>
        <line x1='22' x2='22' y1='18' y2='33' strokeWidth='3'></line>
        <line x1='22' x2='22' y1='12' y2='15' strokeWidth='3'></line></svg>
        <span id='msccMessage' className='cc-v-center cc-text' tabIndex={0}>This site uses cookies for analytics, personalized content and ads. By continuing to browse this site, you agree to this use.</span> <a href='https://go.microsoft.com/fwlink/?linkid=845480' target='_top' aria-label='Learn more about Microsoft&#39;s Cookie Policy' id='msccLearnMore' className='cc-link cc-v-center cc-float-right' data-mscc-ic='false'>Learn more</a>
      </div>
    </div>
  )
}
