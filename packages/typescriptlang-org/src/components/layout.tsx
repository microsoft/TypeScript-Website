import React from "react"
import { SiteNav } from "./layout/TopNav"


export class Layout extends React.Component<any> {
  render() {
    const { children } = this.props
    return (
      <div className="ms-Fabric">
        <SiteNav />
        <main>{children}</main>
      </div>
    )
  }
}
