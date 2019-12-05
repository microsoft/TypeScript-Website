import React from "react"
import { SiteNav } from "./layout/TopNav"
import { SiteFooter } from "./layout/SiteFooter"

export const Layout = (props: any) => {
  const { children } = props
  return (
    <div className="ms-Fabric">
      <SiteNav />
      <main>{children}</main>
      <SiteFooter />
    </div>
  )
}
