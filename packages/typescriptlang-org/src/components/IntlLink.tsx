import React from "react"
import { GatsbyLinkProps, Link, graphql } from "gatsby"
import { AllSitePageFragment } from "../__generated__/gatsby-types";
export type AllSitePage = AllSitePageFragment["allSitePage"];

/** 
 * Creates a <Link> which supports gradual migration, you provide a link to the english page and
 * if the page supports the same version but in your language, it opts for that.
 */
export const createIntlLink = (currentLocale: string, allSitePage: AllSitePageFragment["allSitePage"]) => {
  const paths = allSitePage.nodes.map(n => n.path)

  return (linkProps: GatsbyLinkProps<{}>) => {
    let to = linkProps.to
    const pathIncludesEn = to.startsWith("/en/")

    if (pathIncludesEn) {
      // /en/play -> /ja/play
      const localeVersion = to.replace("/en/", "/" + currentLocale + "/")
      if (paths.includes(localeVersion)) {
        to = localeVersion
      }
    } else {
      // /thing -> /ja/thing
      // This occurs when we want URL compat with old site

      const localeVersion = "/" + currentLocale + "/" + to
      if (paths.includes(localeVersion)) {
        to = localeVersion
      }
    }

    const blocklistIncludes = ["/play", "sandbox",]
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

// This fragment becomes globally available
export const query = graphql`
fragment AllSitePage on Query {
  allSitePage {
    nodes {
      path
    }
  }
}
`

