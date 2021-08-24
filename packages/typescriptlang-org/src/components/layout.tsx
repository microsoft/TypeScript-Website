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
        <style>{`
pre data-err {
  background:url("data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%206%203'%20enable-background%3D'new%200%200%206%203'%20height%3D'3'%20width%3D'6'%3E%3Cg%20fill%3D'%23c94824'%3E%3Cpolygon%20points%3D'5.5%2C0%202.5%2C3%201.1%2C3%204.1%2C0'%2F%3E%3Cpolygon%20points%3D'4%2C0%206%2C2%206%2C0.6%205.4%2C0'%2F%3E%3Cpolygon%20points%3D'0%2C2%201%2C3%202.4%2C3%200%2C0.6'%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E") repeat-x 0 100%;
  padding-bottom: 3px;
}`}</style>
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
