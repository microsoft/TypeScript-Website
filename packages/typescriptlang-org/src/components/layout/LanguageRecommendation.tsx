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
    // Don't mess with the mobile UI
    const isSmall = window.innerWidth < 800
    if (isSmall) return

    let hasLocalStorage = false
    try {
      hasLocalStorage = typeof localStorage !== `undefined`
    } catch (error) { }
    const suppressed = hasLocalStorage && localStorage.getItem("dont-recommend-translate")

    let localePath = getLocaleVersionOfPage()
    if (localePath.startsWith("/en")) {
      localePath = localePath.slice(3)
    }

    if (localePath === "") localePath = "/"
    if (localePath === location.pathname) return

    const doesPageExist = props.allSitePage.nodes.find(f => f.path === localePath || f.path + "/" === localePath)
    if (!doesPageExist) return

    //@ts-ignore
    const userLocale = navigator.language || navigator.userLanguage || "en-UK"
    const userLang = userLocale.split("-")[0]
    const lang = inYourLanguage[userLang] || inYourLanguage["en"]

    // Show the top nav anchor for in your language
    const quickJump = document.getElementById("my-lang-quick-jump")!
    const quickJumpA = quickJump.firstElementChild as HTMLAnchorElement

    quickJumpA.textContent = lang.shorthand
    quickJumpA.href = localePath
    quickJump.title = lang.body
    quickJump.style.display = "inline-block";

    // Adding the LI somehow makes the search bump up by 2px
    const search = document.getElementById("search-form")!
    search.style.position = "relative"
    search.style.top = "-2px"

    // Allow not showing the popout
    if (suppressed) return

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

export const OpenInMyLangQuickJump = () =>
  <li id="my-lang-quick-jump" style={{ display: "none" }} className="nav-item"><a href=''>in En</a></li>
