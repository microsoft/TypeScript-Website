import React from "react"
import { SiteNav } from "./layout/TopNav"


declare const __PATH_PREFIX__: string

export class Layout extends React.Component<any> {
  render() {
    const { children } = this.props
    return (
      <div>
        <SiteNav  />
        <main>{children}</main>
      </div>
    )
  }
}
