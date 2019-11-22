import React from "react"
import { SiteNav } from "./layout/TopNav"

export const Layout = (props: any) => {
  const { children } = props
  return (
    <div className="ms-Fabric">
      <SiteNav />
      <main>{children}</main>
    </div>
  )
}
