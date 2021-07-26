import * as React from "react"
import { SiteNav, Props } from "./layout/TopNav"
import { SiteFooter } from "./layout/SiteFooter"
import { SeoProps, HeadSEO } from "./HeadSEO";
import "./layout/main.scss"
import { Helmet } from "react-helmet";
import { CookieBanner } from "./layout/CookieBanner"
import { LanguageRecommendations } from "./layout/LanguageRecommendation";
import { withPrefix } from "gatsby";

type LayoutProps = SeoProps & Props & {
  lang: string,
  children: any
  suppressCustomization?: true
  suppressDocRecommendations?: true
}

export const Layout = (props: LayoutProps) => {
  return (
    <>
      <Helmet htmlAttributes={{ lang: props.lang }}>
        {/* Should be a NOOP for anything but edge, and much older browsers */}
        <script src="https://polyfill.io/v3/polyfill.min.js?features=es2015%2CArray.prototype.forEach%2CNodeList.prototype.forEach" />
        <link rel="preload" href={withPrefix('/css/docsearch.css')} as="style" />
      </Helmet>
      <HeadSEO {...props} />
      <div className="ms-Fabric">
        <CookieBanner {...props} />
        <SiteNav {...props} />
        <main role="main">{props.children}</main>
        <SiteFooter {...props} />
        <LanguageRecommendations {...props} />
      </div>
    </>
  )
}
