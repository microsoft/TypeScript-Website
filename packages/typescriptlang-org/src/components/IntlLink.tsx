import * as React from "react"

/** 
 * Creates a <a> link which supports gradual migration, you provide a link to the english page and
 * if the page supports the same version but in your language, it opts for that.
 */
export const createIntlLink = (currentLocale: string) => {
  // paths list for locale support - in the future this could be populated
  const paths: string[] = []

  return (linkProps: React.AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }) => {
    let to = linkProps.to

    // /thing -> /ja/thing
    // This occurs when we want URL compat with old site
    const localeVersion = "/" + currentLocale + to
    if (currentLocale !== "en" && paths.includes(localeVersion)) {
      to = localeVersion
    }

    const { to: _to, ...rest } = linkProps
    return <a {...rest} href={to} />
  }
}


