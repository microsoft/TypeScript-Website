import React from "react"
import { SiteNav, Props } from "./layout/TopNav"
import { SiteFooter } from "./layout/SiteFooter"
import { SeoProps, HeadSEO } from "./HeadSEO";
import "./layout/main.scss"

type LayoutProps = SeoProps & Props & {
  children: any
}

export const Layout = (props: LayoutProps) => {

  return (
    <>
      <HeadSEO {...props} />
      <div className="ms-Fabric">
        <SiteNav {...props} />
        <main>{props.children}</main>
        <SiteFooter />
      </div>
    </>
  )
}
