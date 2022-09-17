import React, { useEffect } from "react"

import "./Sidebar.scss"
import { SeoProps } from "../HeadSEO"
import { inYourLanguage } from "../../copy/inYourLanguage";
import { hasLocalStorage } from "../../lib/hasLocalStorage";
import { allFiles } from "../../__generated__/allPages"
import { getLocalePath } from "./getLocalePath";

type Props = SeoProps & {
  lang: string,
  children: any
}

export const LanguageRecommendations = (props: Props) => {
  useEffect(() => {
    // Don't mess with the mobile UI
    const isSmall = window.innerWidth < 800
    if (isSmall) return


    const suppressed = hasLocalStorage && localStorage.getItem("dont-recommend-translate")

    let localePath = getLocalePath()

    // Heh, ignore dt urls
    if (localePath.startsWith("/dt")) return

    if (localePath === location.pathname) return

    const doesPageExist = allFiles.find(f => f === localePath || f + "/" === localePath)
    if (!doesPageExist) return

    //@ts-ignore
    const userLocale = navigator.language || navigator.userLanguage || "en-UK"
    const userLang = userLocale.split("-")[0]
    const lang = inYourLanguage[userLang] || inYourLanguage["todo"]

    // Show the top nav anchor for in your language
    const quickJump = document.getElementById("my-lang-quick-jump")!
    const quickJumpA = quickJump.firstElementChild as HTMLAnchorElement

    quickJumpA.textContent = lang.shorthand !== "In xx" ? lang.shorthand : `In ${userLang}`
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
    <div className="page-popup" id="language-recommendation" style={{ display: "none" }}>
      <p id="language-recommendation-p">MSG</p>
      <div>
        <button className="first" id="language-recommendation-open"></button>
        <button id="language-recommendation-no-more"></button>
      </div>
    </div>
  )
}

export const OpenInMyLangQuickJump = () =>
  <div id="my-lang-quick-jump" style={{ display: "none" }} className="nav-item"><a href=''>in En</a></div>
