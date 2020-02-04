const React = require("react")
const browserLang = require("browser-lang")
const { withPrefix } = require("gatsby")
const { IntlProvider } = require("react-intl")

const preferDefault = m => (m && m.default) || m

const polyfillIntl = language => {
  const locale = language.split("-")[0]
  try {
    if (!Intl.PluralRules) {
      require("@formatjs/intl-pluralrules/polyfill")
      require(`@formatjs/intl-pluralrules/dist/locale-data/${locale}`)
    }

    if (!Intl.RelativeTimeFormat) {
      require("@formatjs/intl-relativetimeformat/polyfill")
      require(`@formatjs/intl-relativetimeformat/dist/locale-data/${locale}`)
    }
  } catch (e) {
    throw new Error(`Cannot find react-intl/locale-data/${language}`)
  }
}

const withIntlProvider = intl => children => {
  polyfillIntl(intl.language)
  return (
    <IntlProvider locale={intl.language} messages={intl.messages}>
      <IntlContextProvider value={intl}>{children}</IntlContextProvider>
    </IntlProvider>
  )
}

export default ({ element, props }) => {
  if (!props) {
    return
  }

  const { pageContext, location } = props
  const { intl } = pageContext
  const { language, languages, redirect, routed, originalPath } = intl

  if (typeof window !== "undefined") {
    window.___gatsbyIntl = intl
  }
  /* eslint-disable no-undef */
  const isRedirect = redirect && !routed

  if (isRedirect) {
    const { search } = location

    // Skip build, Browsers only
    if (typeof window !== "undefined") {
      let detected =
        window.localStorage.getItem("gatsby-intl-language") ||
        browserLang({
          languages,
          fallback: language,
        })

      if (!languages.includes(detected)) {
        detected = language
      }

      const queryParams = search || ""
      const newUrl = withPrefix(`/${detected}${originalPath}${queryParams}`)
      window.localStorage.setItem("gatsby-intl-language", detected)
      window.location.replace(newUrl)
    }
  }
  const renderElement = isRedirect
    ? GATSBY_INTL_REDIRECT_COMPONENT_PATH &&
      React.createElement(
        preferDefault(require(GATSBY_INTL_REDIRECT_COMPONENT_PATH))
      )
    : element
  return withIntlProvider(intl)(renderElement)
}
