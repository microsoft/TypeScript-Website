import React, { useEffect } from "react"

import "./Sidebar.scss"
import { SeoProps } from "../HeadSEO"
import { AllSitePageFragment } from "../../__generated__/gatsby-types";
import { inYourLanguage } from "../../copy/inYourLanguage";

export type AllSitePage = AllSitePageFragment["allSitePage"];

type Props = SeoProps & {
  lang: string,
  children: any
  allSitePage: AllSitePage
}

const getLocaleVersionOfPage = () => {
  // @ts-ignore 
  const userLocale = navigator.language || navigator.userLanguage || "en-UK"
  const userLang = userLocale.split("-")[0]
  const thisPaths = location.pathname.split("/")

  // / -> /es
  if (thisPaths.length === 0) {
    return "/" + userLocale
  }

  const isEnglishPath = thisPaths[1].length !== 2

  // /play -> /zh/play
  if (isEnglishPath) {
    return "/" + userLang + location.pathname
  }

  // /zh/play -> /es/play
  thisPaths[1] = userLang
  // Drop any preceding /s
  if (thisPaths[thisPaths.length - 1] === "") thisPaths.pop()

  return thisPaths.join("/")
}

export const LanguageRecommendations = (props: Props) => {
  useEffect(() => {
    let hasLocalStorage = false
    try {
      hasLocalStorage = typeof localStorage !== `undefined`
    } catch (error) { }
    const suppressed = hasLocalStorage && localStorage.getItem("dont-recommend-translate")
    if (suppressed) return

    let localePath = getLocaleVersionOfPage()
    if (localePath.startsWith("/en")) {
      localePath = localePath.slice(3)
    }

    if (localePath === "") localePath = "/"
    if (localePath === location.pathname) return

    const doesPageExist = props.allSitePage.nodes.find(f => f.path === localePath)
    if (!doesPageExist) return

    //@ts-ignore
    const userLocale = navigator.language || navigator.userLanguage || "en-UK"
    const userLang = userLocale.split("-")[0]
    const lang = inYourLanguage[userLang] || inYourLanguage["en"]

    document.getElementById("language-recommendation-p")!.textContent = lang.body
    const open = document.getElementById("language-recommendation-open")!
    open.textContent = lang.open
    open.onclick = () => document.location.pathname = localePath

    const cancel = document.getElementById("language-recommendation-no-more")!
    cancel.textContent = lang.cancel
    cancel.onclick = () => {
      hasLocalStorage && localStorage.setItem("dont-recommend-translate", "true")
      document.getElementById("language-recommendation")!.style.display = "none"
    }

    document.getElementById("language-recommendation")!.style.display = "block"
  }, [])

  return (
    <div id="language-recommendation" style={{ display: "none" }}>
      <p id="language-recommendation-p">MSG</p>
      <div>
        <button id="language-recommendation-open"></button>
        <button id="language-recommendation-no-more"></button>
      </div>
    </div>
  )
}
