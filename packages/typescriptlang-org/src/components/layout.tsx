import React from "react"
import { SiteNav } from "./layout/TopNav"


export class Layout extends React.Component<any> {
  render() {
    const { children } = this.props
    return (
      <>
        <SiteNav />
        <main>{children}</main>
      </>
    )
  }
}
