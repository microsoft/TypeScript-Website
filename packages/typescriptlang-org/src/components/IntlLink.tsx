import * as React from "react"
import { GatsbyLinkProps, Link } from "gatsby"
import { allFiles } from "../__generated__/allPages"

/** 
 * Creates a <Link> which supports gradual migration, you provide a link to the english page and
 * if the page supports the same version but in your language, it opts for that.
 */
export const createIntlLink = (currentLocale: string) => {
  const paths = allFiles

  return (linkProps: GatsbyLinkProps<{}>) => {
    let to = linkProps.to

    // /thing -> /ja/thing
    // This occurs when we want URL compat with old site

    const localeVersion = "/" + currentLocale + to
    if (currentLocale !== "en" && paths.includes(localeVersion)) {
      to = localeVersion
    }

    // This effectively needs to be duplicated in gatsby-config.js too
    const blocklistIncludes = ["/play", "sandbox", "/dev"]
    const blocklisted = blocklistIncludes.find(blocked => to.includes(blocked))

    if (blocklisted) {
      // @ts-ignore
      return <a {...linkProps} href={to} />
    } else {
      // @ts-ignore
      return <Link {...linkProps} to={to} />
    }
  }
}


