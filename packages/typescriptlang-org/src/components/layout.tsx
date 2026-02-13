import * as React from "react"
import { SiteNav, Props } from "./layout/TopNav"
import { SiteFooter } from "./layout/SiteFooter"
import "./layout/main.scss"
import { CookieBanner } from "./layout/CookieBanner"
import { LanguageRecommendations } from "./layout/LanguageRecommendation";

export type SeoProps = {
  title: string;
  description: string;
  ogTags?: { [key: string]: string };
}

type LayoutProps = SeoProps & Props & {
  lang: string,
  children: any
  suppressCustomization?: true
  suppressDocRecommendations?: true
}
export const Layout = (props: LayoutProps) => {
  return (
    <div className="ms-Fabric">
      <CookieBanner {...props} />
      <SiteNav {...props} />
      <main role="main">{props.children}</main>
      <SiteFooter {...props} />
      <LanguageRecommendations {...props} />
    </div>
  )
}
