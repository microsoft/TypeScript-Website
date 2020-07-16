import * as React from "react"
import { SiteNav, Props } from "./layout/TopNav"
import { SiteFooter } from "./layout/SiteFooter"
import { SeoProps, HeadSEO } from "./HeadSEO";
import "./layout/main.scss"
import { AppInsights } from "./AppInsights";
import { Helmet } from "react-helmet";
import { CookieBanner } from "./layout/CookieBanner"

type LayoutProps = SeoProps & Props & {
  lang: string,
  children: any
}

export const Layout = (props: LayoutProps) => {
  return (
    <>
      <Helmet htmlAttributes={{ lang: props.lang }}>
        {/* Should be a NOOP for anything but edge, and much older browsers */}
        <script src="https://polyfill.io/v3/polyfill.min.js?features=es2015%2CArray.prototype.forEach%2CNodeList.prototype.forEach" />

      </Helmet>
      <HeadSEO {...props} />
      <div className="ms-Fabric">
        <SiteNav {...props} />
        <CookieBanner {...props} />
        <main role="main">{props.children}</main>
        <SiteFooter {...props} />
      </div>
      <AppInsights />
    </>
  )
}
