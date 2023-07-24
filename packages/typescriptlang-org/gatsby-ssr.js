// This file exists to ensure that global.DOMParser
// is set up, to let react-intl do its work with RichText in
// a message: https://github.com/formatjs/react-intl/issues/1438#issuecomment-523153456

global.DOMParser = require("xmldom").DOMParser

const React = require("react")
exports.wrapRootElement = ({ element }) => {
  return <>{element}</>
}

// This code has to run sync across every page to set up the
// state for light/dark modes and custom code fonts
const CustomColorSwitcherCode = () => {
  const codeToRunOnClient = `
(function() {

  let hasLocalStorage = false
  try {
    hasLocalStorage = typeof localStorage !== "undefined"
  } catch (error) {}

  const systemIsDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  const hasSetColorTheme = hasLocalStorage && localStorage.getItem("force-color-theme")
  const customThemeOverride = hasLocalStorage && localStorage.getItem("force-color-theme")

  if (!hasSetColorTheme && systemIsDark) {
    document.documentElement.classList.add("dark-theme")
  } else if (customThemeOverride) {
    document.documentElement.classList.add(customThemeOverride.replace("force-", "") + "-theme")
  }

  const customFontOverride = hasLocalStorage && localStorage.getItem("force-font") || "cascadia"
  document.documentElement.classList.add('font-' + customFontOverride)
})()
  `
  return <script dangerouslySetInnerHTML={{ __html: codeToRunOnClient }} />
}

exports.onRenderBody = ({ setPreBodyComponents }) => {
  setPreBodyComponents(<CustomColorSwitcherCode />)
}
