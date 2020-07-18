// This file exists to ensure that global.DOMParser
// is set up, to let react-intl do it's work with RichText in
// a message: https://github.com/formatjs/react-intl/issues/1438#issuecomment-523153456

global.DOMParser = new (require("jsdom").JSDOM)().window.DOMParser

const React = require("react")
exports.wrapRootElement = ({ element }) => {
  return <>{element}</>
}

// This code has to run sync across every page to set up the
// state for light/dark modes
const CustomColorSwitcherCode = () => {
  const codeToRunOnClient = `
(function() {

  let hasLocalStorage = false
  try {
    hasLocalStorage = typeof localStorage !== "undefined"
  } catch (error) {}

  const systemIsDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  const customThemeOverride = hasLocalStorage && localStorage.getItem("color-theme")

  if (!customThemeOverride && systemIsDark) {
    document.documentElement.classList.add("dark-theme")
  } else if (customThemeOverride) {
    document.documentElement.classList.add(customThemeOverride)
  }
})()
  `
  return <script dangerouslySetInnerHTML={{ __html: codeToRunOnClient }} />
}

exports.onRenderBody = ({ setPreBodyComponents }) => {
  setPreBodyComponents(<CustomColorSwitcherCode />)
}
