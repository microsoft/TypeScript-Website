import * as React from "react"
import { useState } from "react"
import { hasLocalStorage } from "../../lib/hasLocalStorage"

import { useIntl } from "react-intl";

import { footerCopy } from "../../copy/en/footer"
import { createInternational } from "../../lib/createInternational"

const makeDark = () => {
  document.documentElement.classList.remove("light-theme")
  document.documentElement.classList.add("dark-theme")
}

const makeLight = () => {
  document.documentElement.classList.remove("dark-theme")
  document.documentElement.classList.add("light-theme")
}

const switchFont = (newStyle: string, old?: string) => {
  if (old) document.documentElement.classList.remove("font-" + old)
  document.documentElement.classList.add("font-" + newStyle)
}

export const Customize = () => {
  const i = createInternational<typeof footerCopy>(useIntl())
  const systemIsDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  const customThemeOverride = hasLocalStorage && localStorage.getItem("force-color-theme") || "system"
  const [darkModeValue, setDarkMode] = useState(customThemeOverride)

  const customFontOverride = hasLocalStorage && localStorage.getItem("force-font") || "cascadia"
  const [fontValue, setFont] = useState(customFontOverride)

  // Localstorage: force-dark, force-light, undefined 
  // ->
  // CSS Body class: theme-dark, theme-light, theme-dark | theme-light 

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value === "system") {
      systemIsDark ? makeDark() : makeLight()
      hasLocalStorage && localStorage.removeItem("force-color-theme")
    } else if (event.target.value === "force-light") {
      makeLight()
      hasLocalStorage && localStorage.setItem("force-color-theme", "force-light")
    } else if (event.target.value === "force-dark") {
      makeDark()
      hasLocalStorage && localStorage.setItem("force-color-theme", "force-dark")
    }

    setDarkMode(event.target.value)
    if ("playground" in window) document.location.reload()
  }


  // Localstorage: undefined, cascadia, cascadia-ligatures, consolas, ...
  // ->
  // CSS Body class: font-cascadia, font-cascadia, font-cascadia-ligatures | font-consolas, ...

  const handleFontChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    localStorage.setItem("force-font", event.target.value)
    switchFont(event.target.value, customFontOverride)
    setFont(event.target.value)

    if ("playground" in window) document.location.reload()
  }


  return (
    <section id="customize">
      <article>
        <h3>{i("footer_customize")}</h3>
        <label>
          <p>{i("footer_site_colours")}:</p>
          <div className="switch-wrap">
            <select name="colours" value={darkModeValue} onChange={handleThemeChange}>
              <option value="system">{i("footer_site_colours_options_system")}</option>
              <option value="force-light">{i("footer_site_colours_options_always_light")}</option>
              <option value="force-dark">{i("footer_site_colours_options_always_dark")}</option>
            </select>
          </div>
        </label>

        <label>
          <p>{i("footer_code_font")}:</p>
          <div className="switch-wrap">
            <select name="font" value={fontValue} onChange={handleFontChange}>
              <option value="cascadia">Cascadia</option>
              <option value="cascadia-ligatures">Cascadia (ligatures)</option>
              <option value="consolas">Consolas</option>
              <option value="dank-mono">Dank Mono</option>
              <option value="fira-code">Fira Code</option>
              <option value="jetbrains-mono">JetBrains Mono</option>
              <option value="open-dyslexic">OpenDyslexic</option>
              <option value="sf-mono">SF Mono</option>
              <option value="source-code-pro">Source Code Pro</option>
            </select>
          </div>
        </label>
      </article>
    </section>
  )
}
