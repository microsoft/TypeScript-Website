import React from "react"
import { SiteNav, Props } from "./layout/TopNav"
import { SiteFooter } from "./layout/SiteFooter"

export const Layout = (props: Props & { children: any }) => {
  const { children } = props
  return (
    <div className="ms-Fabric">
      <SiteNav {...props} />
      <main>{children}</main>
      <SiteFooter />
    </div>
  )
}
